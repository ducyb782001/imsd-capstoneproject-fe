import React, { useEffect, useState } from "react"
import DownloadIcon from "../icons/DownloadIcon"
import PlusIcon from "../icons/PlusIcon"
import UploadIcon from "../icons/UploadIcon"
import PrimaryBtn from "../PrimaryBtn"
import SearchInput from "../SearchInput"
import Table from "../Table"
import Pagination from "../Pagination"
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import {
  getListExportTypeGood,
  getListTypeGood,
} from "../../apis/type-good-module"
import * as XLSX from "xlsx/xlsx"
import AddTypePopup from "../ManageGoods/AddTypePopup"
import EditTypePopup from "../ManageGoods/EditTypePopup"
import DetailTypePopup from "../ManageGoods/DetailTypePopup"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Tên loại sản phẩm",
        accessor: (data: any) => <p>{data?.categoryName}</p>,
      },
      {
        Header: "Hành động",
        accessor: (data: any) => {
          return (
            <div className="flex items-center gap-2">
              <EditTypePopup id={data?.categoryId} />
              <DetailTypePopup id={data?.description} />
            </div>
          )
        },
      },
    ],
  },
]

function ManageTypeGoods({ ...props }) {
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [listTypeGood, setListTypeGood] = useState<any>()

  const [listTypeGoodExport, setListTypeGoodExport] = useState<any>()
  const [listFilter, setListFilter] = useState([])

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
          console.log(response?.data)
          //fix cứng, sẽ sửa lại sau khi BE sửa api
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

          //fix cứng, sẽ sửa lại sau khi BE sửa api
          const exportFile = await getListExportTypeGood({})
          setListTypeGoodExport(exportFile?.data)

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
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <AddTypePopup className="max-w-[250px]" />
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder="Tìm kiếm bằng tên loại sản phẩm"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full col-span-3"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 table-style">
          {/* {data && ( */}
          <Table
            pageSizePagination={pageSize}
            columns={columns}
            data={listTypeGood?.data}
          />
          {/* )} */}
        </div>
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
