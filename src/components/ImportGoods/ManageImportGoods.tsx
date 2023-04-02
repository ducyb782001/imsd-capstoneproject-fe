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
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import * as XLSX from "xlsx/xlsx"
import { format, parseISO } from "date-fns"
import { getListExportSupplier } from "../../apis/supplier-module"
import ChooseStatusDropdown from "./ChooseStatusDropdown"
import { getListImportProduct } from "../../apis/import-product-module"
import TableSkeleton from "../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import BigNumber from "bignumber.js"
import ShowDetail from "../ShowDetail"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"

function ManageImportGoods() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("import_code"),
          accessor: (data: any) => <p>{data?.importCode}</p>,
        },
        {
          Header: t("note"),
          accessor: (data: any) => <p>{data?.note}</p>,
        },
        {
          Header: t("supplier"),
          accessor: (data: any) => <p>{data?.supplier?.supplierName}</p>,
        },
        {
          Header: t("created_date"),
          accessor: (data: any) => (
            <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
          ),
        },
        {
          Header: t("total_cost"),
          accessor: (data: any) => (
            <p>{new BigNumber(data?.totalCost).toFormat()} đ</p>
          ),
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
      status: t("in_import"),
    },
    {
      id: 2,
      status: t("complete"),
    },
    {
      id: 3,
      status: t("cancelled"),
    },
  ]

  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [statusSelected, setStatusSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParamsStatus, setQueryParamsStatus] = useState<any>({})
  const [queryParamsSupplier, setQueryParamsSupplier] = useState<any>({})

  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilterStatus, setListFilterStatus] = useState([])
  const [listFilterSuplier, setListFilterSuplier] = useState([])

  const [listImportProduct, setListImportProduct] = useState<any>()

  const [listImportProductExport, setListImportProductExport] = useState<any>()
  const [listSupplier, setListSupplier] = useState<any>()

  const [isLoadingListImport, setIsLoadingListImport] = useState(true)

  useEffect(() => {
    if (nhaCungCapSelected) {
      setListFilterSuplier([
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
      setListFilterStatus([
        {
          key: "state",
          applied: t("status"),
          value: statusSelected?.status,
          id: statusSelected?.id,
        },
      ])
    }
  }, [statusSelected])

  //change queryParamsObj when change listFilterStatus in one useEffect
  useEffect(() => {
    if (listFilterStatus) {
      const queryObj = listFilterStatus.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParamsStatus(queryObj)
    }
  }, [listFilterStatus])

  const handleRemoveFilterStatus = (itemIndex) => {
    const listRemove = listFilterStatus.filter(
      (i, index) => index !== itemIndex,
    )
    setListFilterStatus(listRemove)
  }

  useEffect(() => {
    if (listFilterSuplier) {
      const queryObj = listFilterSuplier.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParamsSupplier(queryObj)
    }
  }, [listFilterSuplier])

  const handleRemoveFilterSupplier = (itemIndex) => {
    const listRemove = listFilterSuplier.filter(
      (i, index) => index !== itemIndex,
    )
    setListFilterSuplier(listRemove)
  }

  useQueries([
    {
      queryKey: [
        "getListImportProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParamsSupplier,
        queryParamsStatus,
      ],
      queryFn: async () => {
        setIsLoadingListImport(true)
        const queryObj = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          ...queryParamsStatus,
          ...queryParamsSupplier,
        }
        if (debouncedSearchValue) {
          queryObj["code"] = debouncedSearchValue
        }
        const response = await getListImportProduct(queryObj)
        setListImportProduct(response?.data)
        setIsLoadingListImport(false)
        return response?.data
      },
    },
    {
      queryKey: ["getListFilterStatus"],
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
      <div className="flex items-center justify-end">
        <Link href={`/create-import-report`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("create_import_report")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 items-center justify-between w-full gap-2 md:grid-cols-[50%_23%_23%] mb-4">
            <SearchInput
              placeholder={"Tìm theo mã đơn nhập, tên NCC"}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={t("status")}
              showing={statusSelected}
              setShowing={setStatusSelected}
            />

            <ChooseSupplierDropdown
              listDropdown={listSupplier}
              textDefault={t("supplier")}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShowLabelBar
              isExpandedLabelBar={true}
              listFilter={listFilterStatus}
              handleRemoveFilter={handleRemoveFilterStatus}
              appliedDate={undefined}
              dateRange={undefined}
              handleRemoveDatefilter={handleRemoveFilterStatus}
            />
            <ShowLabelBar
              isExpandedLabelBar={true}
              listFilter={listFilterSuplier}
              handleRemoveFilter={handleRemoveFilterSupplier}
              appliedDate={undefined}
              dateRange={undefined}
              handleRemoveDatefilter={handleRemoveFilterSupplier}
            />
          </div>
        </div>
        {isLoadingListImport ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listImportProduct?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listImportProduct?.total}
            />
          </>
        )}
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
  const { t } = useTranslation()
  if (data?.state == 0) {
    return (
      <div className="w-32 font-medium text-center text-white rounded-lg bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">{t("in_progress")}</h1>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="w-32 font-medium text-center rounded-lg bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">{t("in_import")}</h1>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="w-32 font-medium text-center text-white border border-green-500 rounded-lg bg-green-50">
        <h1 className="m-2 ml-3 text-green-500">{t("complete")}</h1>
      </div>
    )
  } else {
    return (
      <div className="w-32 font-medium text-center text-white border border-red-500 rounded-lg bg-red-50">
        <h1 className="m-2 ml-3 text-red-500">{t("cancelled")}</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  if (data?.state == 0) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/import-report-draff/${data?.importId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/import-report-detail/${data?.importId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/import-report-succeed/${data?.importId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/import-report-canceled/${data?.importId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  }
}
