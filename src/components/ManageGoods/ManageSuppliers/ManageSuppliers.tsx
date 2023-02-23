import React, { useEffect, useState } from "react"
import DemoDropDown from "../../DemoDropDown"
import DownloadIcon from "../../icons/DownloadIcon"
import PlusIcon from "../../icons/PlusIcon"
import UploadIcon from "../../icons/UploadIcon"
import PrimaryBtn from "../../PrimaryBtn"
import SearchInput from "../../SearchInput"
import ShowLabelBar from "../../Filter/ShowLabelBar"
import Table from "../../Table"
import Pagination from "../../Pagination"
import Link from "next/link"
import ShowDetailIcon from "../../icons/ShowDetailIcon"
import BigNumber from "bignumber.js"
import useDebounce from "../../../hooks/useDebounce"
import { useQueries } from "react-query"
import {
  getListSupplier,
  getListExportSupplier,
} from "../../../apis/supplier-module"
import * as XLSX from "xlsx/xlsx"
import EditIcon from "../../icons/EditIcon"
import { format, parseISO } from "date-fns"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Tên nhà cung cấp",
        accessor: (data: any) => <p>{data?.supplierName}</p>,
      },
      {
        Header: "Số điện thoại",
        accessor: (data: any) => <p>{data?.supplierPhone}</p>,
      },
      {
        Header: "Email",
        accessor: (data: any) => <p>{data?.supplierEmail}</p>,
      },
      {
        Header: "Địa chỉ",
        accessor: (data: any) => <p>{data?.province}</p>,
      },
      {
        Header: "Hành động",
        accessor: (data: any) => {
          return (
            <div className="flex items-center gap-2">
              <Link href={`/edit-supplier/${data?.supplierId}`}>
                <a>
                  <EditIcon />
                </a>
              </Link>
              <Link href={`/supplier-detail/${data?.supplierId}`}>
                <a className="w-full">
                  <ShowDetailIcon />
                </a>
              </Link>
            </div>
          )
        },
      },
    ],
  },
]

function ManageSuppliers({ ...props }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeSelected, setTypeSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listSupplier, setListSupplier] = useState<any>()

  const [listSupplierExport, setListSupplierExport] = useState<any>()

  //change queryParamsObj when change listFilter in one useEffect
  useEffect(() => {
    if (listFilter) {
      const queryObj = listFilter.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParams(queryObj)
    }
  }, [listFilter])

  const handleRemoveFilter = (itemIndex) => {
    const listRemove = listFilter.filter((i, index) => index !== itemIndex)
    setListFilter(listRemove)
  }

  useQueries([
    {
      queryKey: [
        "getListSupplier",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getListSupplier({
            search: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListSupplier(response?.data)

          //fix cứng, sẽ sửa lại sau khi BE sửa api
          const exportFile = await getListExportSupplier({
            search: debouncedSearchValue,
            offset: 0,
            limit: 1000,
            ...queryParams,
          })
          setListSupplierExport(exportFile?.data)
          //-----------

          return response?.data
        } else {
          const response = await getListSupplier({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListSupplier(response?.data)
          //fix cứng, sẽ sửa lại sau khi BE sửa api
          const exportFile = await getListExportSupplier({})
          setListSupplierExport(exportFile?.data)

          //-----------

          return response?.data
        }
      },
    },
  ])

  const handleExportProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(listSupplierExport?.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <ImportExportButton
            onClick={handleExportProduct}
            accessoriesLeft={<DownloadIcon />}
          >
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <Link href={`/add-supplier`}>
          <a>
            <PrimaryBtn
              className="max-w-[250px]"
              accessoriesLeft={<PlusIcon />}
            >
              Thêm nhà cung cấp
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder="Tìm kiếm bằng tên nhà cung cấp"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full col-span-3"
            />
          </div>
          <ShowLabelBar
            isExpandedLabelBar={true}
            listFilter={listFilter}
            handleRemoveFilter={handleRemoveFilter}
            appliedDate={undefined}
            dateRange={undefined}
            handleRemoveDatefilter={handleRemoveFilter}
          />
        </div>

        {/* Table */}
        <div className="mt-4 table-style">
          {/* {data && ( */}
          <Table
            pageSizePagination={pageSize}
            columns={columns}
            data={listSupplier?.data}
          />
          {/* )} */}
        </div>
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={listSupplier?.total}
        />
      </div>
    </div>
  )
}

export default ManageSuppliers

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
