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
import ChooseStatusDropdown from "../ImportGoods/ChooseStatusDropdown"
import TableSkeleton from "../Skeleton/TableSkeleton"
import { getListStockTakeProduct } from "../../apis/stocktake-product-module"
import { format, parseISO } from "date-fns"
import { useTranslation } from "react-i18next"
import ShowDetail from "../ShowDetail"

function ManageCheckGoods() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("check_code"),
          accessor: (data: any) => <p>{data?.stocktakeCode}</p>,
        },

        {
          Header: t("staff_created"),
          accessor: (data: any) => <p>{data?.createdBy?.userName || "---"}</p>,
        },
        {
          Header: t("created_report_check"),
          accessor: (data: any) => (
            <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
          ),
        },
        {
          Header: t("check_staff"),
          accessor: (data: any) => <p>{data?.updatedBy?.userName || "---"}</p>,
        },

        {
          Header: t("check_date"),
          accessor: (data: any) => (
            <p>
              {data?.updated
                ? format(parseISO(data?.updated), "dd/MM/yyyy HH:mm")
                : "---"}
            </p>
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
    { id: 0, status: t("checking_status") },
    {
      id: 1,
      status: t("complete"),
    },
    {
      id: 2,
      status: t("cancelled"),
    },
  ]

  const [statusSelected, setStatusSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listCheckProduct, setListCheckProduct] = useState<any>()

  const [listCheckProductExport, setListCheckProductExport] = useState<any>()
  const [isLoadingListExport, setIsLoadingListExport] = useState(true)

  useEffect(() => {
    if (statusSelected) {
      // Them logic check id cua type phai khac thi moi them vao list
      setListFilter([
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
        "getListCheckProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        setIsLoadingListExport(true)

        const queryObj = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          ...queryParams,
        }
        if (debouncedSearchValue) {
          queryObj["code"] = debouncedSearchValue
        }
        const response = await getListStockTakeProduct(queryObj)
        setIsLoadingListExport(false)
        setListCheckProduct(response?.data)
        return response?.data
      },
    },
  ])

  const handleExportProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(listCheckProductExport?.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
    <div>
      <div className="flex items-center justify-end">
        <Link href={`/create-check-report`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("create_check_good")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 items-center justify-between w-full gap-1 md:grid-cols-[70%_28%] mb-4">
            <SearchInput
              placeholder={t("search.searchInCheck")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={t("status")}
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
                data={listCheckProduct?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listCheckProduct?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageCheckGoods

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
      <div className="font-medium text-center text-white rounded-lg bg-orange-50 border border-[#D69555]">
        <h1 className="m-2 ml-3 text-orange-500">{t("checking_status")}</h1>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="font-medium text-center text-white border border-green-500 rounded-lg bg-green-50">
        <h1 className="m-2 ml-3 text-green-500">{t("complete")}</h1>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="font-medium text-center text-white border border-red-500 rounded-lg bg-red-50">
        <h1 className="m-2 ml-3 text-red-500">{t("cancelled")}</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  if (data?.state == 0) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/draff-check-good/${data?.stocktakeId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/check-good-detail/${data?.stocktakeId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="flex items-center w-full gap-2">
        <Link href={`/check-good-detail/${data?.stocktakeId}`}>
          <a className="w-full">
            <ShowDetail />
          </a>
        </Link>
      </div>
    )
  }
}
