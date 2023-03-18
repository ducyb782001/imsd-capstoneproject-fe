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

function ManageReturnCustomer() {
  const { t } = useTranslation()

  const fake_data = [
    {
      returnId: 2005,
      returnCode: "HOHA1",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 0,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "HOHA1",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 1,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "HOHA1",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 2,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "HOHA1",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 3,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "HOHA1",
      returnCost: 160000,
      supplier: "Công ty trách nhiệm hữu hạn Tây Bắc",
      status: 1,
      create: "Kiểm kho Lâm",
      createDate: Date.now(),
      returnDate: Date.now(),
    },
    {
      returnId: 2005,
      returnCode: "HOHA1",
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
          Header: t("bill_create_user"),
          accessor: (data: any) => <p>{data?.create}</p>,
        },
        {
          Header: t("return_date"),
          accessor: (data: any) => (
            // <p>{format(parseISO(data?.returnDate), "dd/MM/yyyy HH:mm")}</p>
            <p>{format(data?.returnDate, "dd/MM/yyyy HH:mm")}</p>
          ),
        },
        {
          Header: "Giá trị đơn trả",
          accessor: (data: any) => <p>{data?.returnCost}</p>,
        },
        {
          Header: "Lý do",
          accessor: (data: any) => <p>Trả hàng vì không thích mua nữa</p>,
        },
        {
          Header: " ",
          accessor: (data: any) => <DetailImportProduct data={data} />,
        },
      ],
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2"></div>
        <Link href={`/create-return-customer`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              Tạo đơn hoàn hàng
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <SearchInput
          placeholder={t("search_return")}
          onChange={(e) => setSearchParam(e.target.value)}
          className="w-full"
        />
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

export default ManageReturnCustomer

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
        <Link href={`/return-customer-draff/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.status == 1) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-customer-pending/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else if (data?.status == 2) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-customer-detail/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/return-customer-detail/${data?.returnId}`}>
          <a className="w-full">
            <ShowDetailIcon />
          </a>
        </Link>
      </div>
    )
  }
}
