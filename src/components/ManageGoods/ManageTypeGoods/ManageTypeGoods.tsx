import React, { useEffect, useState } from "react"
import DownloadIcon from "../../icons/DownloadIcon"
import UploadIcon from "../../icons/UploadIcon"
import SearchInput from "../../SearchInput"
import Table from "../../Table"
import Pagination from "../../Pagination"
import useDebounce from "../../../hooks/useDebounce"
import { useQueries } from "react-query"
import {
  getListExportTypeGood,
  getListTypeGood,
} from "../../../apis/type-good-module"
import * as XLSX from "xlsx/xlsx"
import AddTypePopup from "./AddTypePopup"
import EditTypePopup from "./EditTypePopup"
import DetailTypePopup from "./DetailTypePopup"
import TableSkeleton from "../../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"

function ManageTypeGoods() {
  const { t } = useTranslation()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [listTypeGood, setListTypeGood] = useState<any>()

  const [listTypeGoodExport, setListTypeGoodExport] = useState<any>()
  const [listFilter, setListFilter] = useState([])
  const [isLoadingListType, setIsLoadingListType] = useState(true)

  const column = [
    {
      Header: " ",
      columns: [
        {
          Header: t("name_type"),
          accessor: (data: any) => (
            <div>
              <p>{data?.categoryName}</p>
            </div>
          ),
        },
        {
          Header: t("action"),
          accessor: (data: any) => {
            return (
              <div className="flex items-center col-span-2 gap-2">
                <EditTypePopup id={data?.categoryId} />
                <DetailTypePopup id={data?.description} />
              </div>
            )
          },
        },
      ],
    },
  ]

  useEffect(() => {
    if (listFilter) {
      const queryObj = listFilter.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParams(queryObj)
    }
  }, [listFilter])

  useQueries([
    {
      queryKey: [
        "getListTypeGood",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getListTypeGood({
            search: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListTypeGood(response?.data)
          //fix c???ng, s??? s???a l???i sau khi BE s???a api
          const exportFile = await getListExportTypeGood({
            search: debouncedSearchValue,
            offset: 0,
            limit: 1000,
            ...queryParams,
          })
          setListTypeGoodExport(exportFile?.data)
          //-----------

          return response?.data
        } else {
          const response = await getListTypeGood({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListTypeGood(response?.data)

          //fix c???ng, s??? s???a l???i sau khi BE s???a api
          const exportFile = await getListExportTypeGood({})
          setListTypeGoodExport(exportFile?.data)
          setIsLoadingListType(response?.data?.isLoading)
          //-----------

          return response?.data
        }
      },
    },
  ])

  const handleExportTypeGood = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(listTypeGoodExport?.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <ImportExportButton
            onClick={handleExportTypeGood}
            accessoriesLeft={<DownloadIcon />}
          >
            Xu???t file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nh???p file
          </ImportExportButton>
        </div>
        <AddTypePopup className="max-w-[250px]" />
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder={t("search.searchInType")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full col-span-3"
            />
          </div>
        </div>
        {isLoadingListType ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={column}
                data={listTypeGood?.data}
                columnSize="w-1"
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listTypeGood?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageTypeGoods

function ImportExportButton({
  accessoriesLeft,
  children,
  onClick = null,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`text-base text-primary max-w-[120px] px-2 py-3 flex gap-2 items-center ${className}`}
    >
      {accessoriesLeft && <div>{accessoriesLeft}</div>}
      {children}
    </button>
  )
}
