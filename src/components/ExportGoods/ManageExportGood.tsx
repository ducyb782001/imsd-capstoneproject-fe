import React, { useEffect, useState } from "react"
import DownloadIcon from "../icons/DownloadIcon"
import PlusIcon from "../icons/PlusIcon"
import UploadIcon from "../icons/UploadIcon"
import PrimaryBtn from "../PrimaryBtn"
import SearchInput from "../SearchInput"
import ShowLabelBar from "../Filter/ShowLabelBar"
import Table from "../Table"
import Pagination from "../Pagination"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import BigNumber from "bignumber.js"
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import { getListExportProduct, getListProduct } from "../../apis/product-module"
import * as XLSX from "xlsx/xlsx"
import EditIcon from "../icons/EditIcon"
import { da } from "date-fns/locale"
import { format, parseISO } from "date-fns"
import { getListExportTypeGood } from "../../apis/type-good-module"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"
import { getListExportSupplier } from "../../apis/supplier-module"
import ChooseStatusDropdown from "../ImportGoods/ChooseStatusDropdown"
import ChooseSupplierImportGoodDropdown from "../ImportGoods/ChooseSupplierImportGoodDropdown"
import { getListImportProduct } from "../../apis/import-product-module"
import { getAllExportProduct } from "../../apis/export-product-module"
import TableSkeleton from "../Skeleton/TableSkeleton"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã đơn xuất",
        accessor: (data: any) => <p>{data?.exportCode}</p>,
      },
      {
        Header: "Ghi chú",
        accessor: (data: any) => <p>{data?.note}</p>,
      },
      {
        Header: "Tổng tiền",
        accessor: (data: any) => <p>{data?.totalPrice}</p>,
      },
      {
        Header: "Trạng thái",
        accessor: (data: any) => (
          <div className="flex justify-center">
            <StatusDisplay data={data} />
          </div>
        ),
      },

      {
        Header: "Ngày xuất",
        accessor: (data: any) => (
          <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
        ),
      },
      {
        Header: " ",
        accessor: (data: any) => <DetailImportProduct data={data} />,
      },
    ],
  },
]

const status = [
  { id: 0, status: "Đang xử lý" },

  {
    id: 1,
    status: "Đang nhập hàng",
  },
  {
    id: 2,
    status: "Hoàn thành",
  },
  {
    id: 3,
    status: "Đã hủy",
  },
]

function ManageExportGoods({ ...props }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [statusSelected, setStatusSelected] = useState<any>()
  const [typeSelected, setTypeSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listExportProduct, setListExportProduct] = useState<any>()

  const [listImportProductExport, setListImportProductExport] = useState<any>()
  const [isLoadingListExport, setIsLoadingListExport] = useState(true)

  useEffect(() => {
    if (nhaCungCapSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "supId",
          applied: "Nhà cung cấp",
          value: nhaCungCapSelected?.supplierName,
          id: nhaCungCapSelected?.supplierId,
        },
      ])
    }
  }, [nhaCungCapSelected])
  useEffect(() => {
    if (statusSelected) {
      // Them logic check id cua type phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "state",
          applied: "Trạng thái",
          value: statusSelected?.status,
          id: statusSelected?.id,
        },
      ])
    }
  }, [statusSelected])

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
        "getListExportProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getAllExportProduct({
            code: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListExportProduct(response?.data)

          //fix cứng, sẽ sửa lại sau khi BE sửa api
          const exportFile = await getListImportProduct({
            code: debouncedSearchValue,
            offset: 0,
            limit: 1000,
            ...queryParams,
          })
          setListImportProductExport(exportFile?.data)
          //-----------

          return response?.data
        } else {
          const response = await getAllExportProduct({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListExportProduct(response?.data)
          setIsLoadingListExport(response?.data?.isLoading)

          //-----------

          return response?.data
        }
      },
    },
  ])

  const handleExportProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(listImportProductExport?.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }
  console.log(listExportProduct)

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
        <Link href={`/create-export-report`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              Tạo đơn xuất hàng
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid items-center justify-between w-full gap-1 md:grid-cols-[70%_28%] mb-4">
            <SearchInput
              placeholder="Tìm theo mã đơn xuất, nhà cung cấp"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={"Trạng thái"}
              showing={statusSelected}
              setShowing={setStatusSelected}
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
        {isLoadingListExport ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listExportProduct?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listExportProduct?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageExportGoods

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

function StatusDisplay({ data }) {
  if (data?.state == 0) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white rounded-2xl bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">Đang Xử lý</h1>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="w-32 mt-4 font-medium text-center rounded-2xl bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">Đang nhập hàng</h1>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white bg-green-50 border border-green-500 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">Hoàn thành</h1>
      </div>
    )
  } else {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white rounded-2xl bg-red-50 border border-red-500">
        <h1 className="m-2 ml-3 text-red-500">Đã hủy</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  if (data?.state == 0) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/export-report-draff/${data?.exportId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/export-report-detail/${data?.exportId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/export-report-succeed/${data?.exportId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/export-report-canceled/${data?.exportId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  }
}
