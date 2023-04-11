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
import TableSkeleton from "../../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import PrimaryBtn from "../../PrimaryBtn"
import PlusIcon from "../../icons/PlusIcon"

function ManageTypeGoods() {
  const { t } = useTranslation()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [listTypeGood, setListTypeGood] = useState<any>()

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
              <p
                title={data?.categoryName || ""}
                className="max-w-[500px] truncate-2-line"
              >
                {data?.categoryName ? data?.categoryName : "---"}
              </p>
            </div>
          ),
        },
        {
          Header: t("mota"),
          accessor: (data: any) => {
            return (
              <div
                title={data?.description || ""}
                className="truncate-2-line max-w-[500px]"
              >
                {data?.description ? data?.description : "---"}
              </div>
            )
          },
        },
        {
          Header: t("edit"),
          accessor: (data: any) => {
            return (
              <div className="flex items-center gap-2">
                <EditTypePopup id={data?.categoryId} />
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
        setIsLoadingListType(true)

        const queryObj = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
        }
        if (debouncedSearchValue) {
          queryObj["search"] = debouncedSearchValue
        }
        const response = await getListTypeGood(queryObj)
        setListTypeGood(response?.data)
        setIsLoadingListType(false)

        return response?.data
      },
    },
  ])

  return (
    <div>
      <div className="flex items-center justify-end">
        <AddTypePopup className="max-w-[250px]">
          <PrimaryBtn>
            <PlusIcon /> {t("add_type")}
          </PrimaryBtn>
        </AddTypePopup>
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
          <div className="mt-4 table-style">
            <Table
              pageSizePagination={pageSize}
              columns={column}
              data={listTypeGood?.data}
            />
          </div>
        )}
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={listTypeGood?.total}
        />
      </div>
    </div>
  )
}

export default ManageTypeGoods
