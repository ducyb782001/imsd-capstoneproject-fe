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
import TableSkeleton from "../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import ChooseSupplierImportGoodDropdown from "../ImportGoods/ChooseSupplierImportGoodDropdown"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListReturnGoods } from "../../apis/return-product-module"
import BigNumber from "bignumber.js"
import ShowDetail from "../ShowDetail"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"

function ManageReturnGood() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("return_code"),
          accessor: (data: any) => <p>{data?.returnsCode}</p>,
        },
        {
          Header: t("supplier"),
          accessor: (data: any) => <p>{data?.supplier?.supplierName}</p>,
        },
        {
          Header: t("bill_create_user"),
          accessor: (data: any) => <p>{data?.user?.userName}</p>,
        },
        {
          Header: t("return_date"),
          accessor: (data: any) => (
            <p>
              {format(
                parseISO(
                  data?.created ? data?.created : new Date().toISOString(),
                ),
                "dd/MM/yyyy HH:mm",
              )}
            </p>
          ),
        },
        {
          Header: "Giá trị trả hàng",
          accessor: (data: any) => (
            <p>{new BigNumber(data?.total).toFormat()} đ</p>
          ),
        },
        {
          Header: "Ghi chú",
          accessor: (data: any) => <p>{data?.note}</p>,
        },
        {
          Header: " ",
          accessor: (data: any) => <DetailImportProduct data={data} />,
        },
      ],
    },
  ]

  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])
  const [listSupplier, setListSupplier] = useState<any>()

  const [isLoadingListReturn, setIsLoadingListReturn] = useState(true)
  const [listReturnImportGoods, setListReturnImportGoods] = useState<any>()

  useQueries([
    {
      queryKey: [
        "getListReturnGoods",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        setIsLoadingListReturn(true)

        const object = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          type: "import",
          ...queryParams,
        }
        if (debouncedSearchValue) {
          object["code"] = debouncedSearchValue
        }

        const response = await getListReturnGoods(object)

        setIsLoadingListReturn(false)
        setListReturnImportGoods(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        const supplierList = await getListExportSupplier({})
        setListSupplier(supplierList?.data?.data)
        return supplierList?.data
      },
    },
  ])

  useEffect(() => {
    if (nhaCungCapSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilter([
        {
          key: "supId",
          applied: t("supplier"),
          value: nhaCungCapSelected?.supplierName,
          id: nhaCungCapSelected?.supplierId,
        },
      ])
    }
  }, [nhaCungCapSelected])

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

  // const handleExportProduct = () => {
  //   const dateTime = Date().toLocaleString() + ""
  //   const worksheet = XLSX.utils.json_to_sheet(listImportProductExport?.data)
  //   const workbook = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  //   XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  // }

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
          <div className="grid items-center justify-between w-full grid-cols-1 gap-1 mb-4 md:grid-cols-73">
            <SearchInput
              placeholder={t("search_return")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />
            <ChooseSupplierDropdown
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
        {isLoadingListReturn ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listReturnImportGoods?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listReturnImportGoods?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageReturnGood

function DetailImportProduct({ data }) {
  return (
    <div className="flex items-center w-full gap-2">
      <Link href={`/return-import-detail/${data?.returnsId}`}>
        <a className="w-full">
          <ShowDetail />
        </a>
      </Link>
    </div>
  )
}
