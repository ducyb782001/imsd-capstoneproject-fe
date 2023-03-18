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
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import * as XLSX from "xlsx/xlsx"
import { format, parseISO } from "date-fns"
import ChooseStatusDropdown from "../ImportGoods/ChooseStatusDropdown"
import { getListImportProduct } from "../../apis/import-product-module"
import { getAllExportProduct } from "../../apis/export-product-module"
import TableSkeleton from "../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import ChooseSupplierImportGoodDropdown from "../ImportGoods/ChooseSupplierImportGoodDropdown"
import { getListExportSupplier } from "../../apis/supplier-module"

function ManageReturnGood() {
  const { t } = useTranslation()

  const fake_data = [
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 0,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 1,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 2,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 3,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 1,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "TAHA2601",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 1,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
  ]
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("return_code"),
          accessor: (data: any) => <p>{data?.returnCode}</p>,
        },
        {
          Header: t("return_cost"),
          accessor: (data: any) => <p>{data?.returnCost}</p>,
        },
        {
          Header: t("supplier"),
          accessor: (data: any) => <p>{data?.supplier}</p>,
        },
        {
          Header: t("status"),
          accessor: (data: any) => (
            <div className="flex justify-center">
              <StatusDisplay data={data} />
            </div>
          ),
        },
        {
          Header: t("bill_create_user"),
          accessor: (data: any) => <p>{data?.create}</p>,
        },
        {
          Header: t("created_report_import"),
          accessor: (data: any) => (
            <p>{format(data?.createDate, "dd/MM/yyyy HH:mm")}</p>
            // <p>{format(parseISO(data?.createDate), "dd/MM/yyyy HH:mm")}</p>
          ),
        },
        {
          Header: t("return_date"),
          accessor: (data: any) => (
            // <p>{format(parseISO(data?.returnDate), "dd/MM/yyyy HH:mm")}</p>
            <p>{format(data?.returnDate, "dd/MM/yyyy HH:mm")}</p>
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
    { id: 0, status: t("in_progress") },
    {
      id: 1,
      status: t("complete"),
    },
    {
      id: 2,
      status: t("cancelled"),
    },
  ]

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
  const [listSupplier, setListSupplier] = useState<any>()

  useEffect(() => {
    if (nhaCungCapSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "supId",
          applied: t("supplier"),
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
          applied: t("status"),
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
        <div className="flex gap-2"></div>
        <Link href={`/create-return-report`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("create_return_good")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid items-center justify-between w-full gap-1 md:grid-cols-[50%_24%_24%] mb-4">
            <SearchInput
              placeholder={t("search_return")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />
            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={t("status")}
              showing={statusSelected}
              setShowing={setStatusSelected}
            />

            <ChooseSupplierImportGoodDropdown
              listDropdown={listSupplier}
              textDefault={t("supplier")}
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
        {isLoadingListExport ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={fake_data}
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

export default ManageReturnGood

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
  const { t } = useTranslation()
  if (data?.status == 0) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white rounded-2xl bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">{t("in_progress")}</h1>
      </div>
    )
  } else if (data?.status == 1) {
    return (
      <div className="w-32 mt-4 font-medium text-center rounded-2xl bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">{t("in_return_progress")}</h1>
      </div>
    )
  } else if (data?.status == 2) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white border border-green-500 bg-green-50 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">{t("complete")}</h1>
      </div>
    )
  } else if (data?.status == 3) {
    return (
      <div className="w-32 mt-4 font-medium text-center text-white border border-red-500 rounded-2xl bg-red-50">
        <h1 className="m-2 ml-3 text-red-500">{t("cancelled")}</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  if (data?.status == 0) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-report-draff/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.status == 1) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-good-pending/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.status == 2) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-report-detail/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-report-detail/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  }
}
