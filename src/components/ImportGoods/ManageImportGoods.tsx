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
import ChooseStatusDropdown from "./ChooseStatusDropdown"
import ChooseSupplierImportGoodDropdown from "./ChooseSupplierImportGoodDropdown"
import { getListImportProduct } from "../../apis/import-product-module"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã đơn nhập",
        accessor: (data: any) => <p>{data?.importCode}</p>,
      },
      {
        Header: "Ghi chú",
        accessor: (data: any) => <p>{data?.note}</p>,
      },
      {
        Header: "Nhà cung cấp",
        accessor: (data: any) => <p>{data?.supplier?.supplierName}</p>,
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
        Header: "Ngày nhập",
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

function ManageImportGoods({ ...props }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [statusSelected, setStatusSelected] = useState<any>()
  const [typeSelected, setTypeSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listImportProduct, setListImportProduct] = useState<any>()

  const [listImportProductExport, setListImportProductExport] = useState<any>()
  const [listSupplier, setListSupplier] = useState<any>()

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
        "getListImportProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getListImportProduct({
            code: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListImportProduct(response?.data)

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
          const response = await getListImportProduct({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListImportProduct(response?.data)
          //-----------

          return response?.data
        }
      },
    },
    {
      queryKey: ["getListFilter"],
      queryFn: async () => {
        const supplierList = await getListExportSupplier({})
        setListSupplier(supplierList?.data?.data)
        return supplierList?.data
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
        <Link href={`/create-import-report`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              Tạo đơn nhập hàng
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid items-center justify-between w-full gap-1 md:grid-cols-[51%_23%_23%]">
            <SearchInput
              placeholder="Tìm theo mã đơn nhập, nhà cung cấp"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full mb-4"
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={"Trạng thái"}
              showing={statusSelected}
              setShowing={setStatusSelected}
            />

            <ChooseSupplierImportGoodDropdown
              listDropdown={listSupplier}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
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
            data={listImportProduct?.data}
          />
          {/* )} */}
        </div>
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={listImportProduct?.total}
        />
      </div>
    </div>
  )
}

export default ManageImportGoods

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
      <div className="bg-orange-50 text-white font-medium mt-4 w-32 text-center rounded-md">
        <h1 className="m-2 ml-3 text-orange-500">Đang Xử lý</h1>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="bg-green-50 text-white font-medium mt-4 w-32 text-center rounded-3xl">
        <h1 className="m-2 ml-3 text-green-500">Đang nhập hàng</h1>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="bg-green-50 text-white font-medium mt-4 w-32 text-center rounded-3xl">
        <h1 className="m-2 ml-3 text-green-500">Hoàn thành</h1>
      </div>
    )
  } else {
    return (
      <div className="bg-red-50 text-white font-medium mt-4 w-32 text-center rounded-md">
        <h1 className="m-2 ml-3 text-red-500">Đã hủy</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  if (data?.state == 0) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/import-report-draff/${data?.importId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/import-report-detail/${data?.importId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/import-report-succeed/${data?.importId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/import-report-canceled/${data?.importId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  }
}
