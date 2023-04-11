import React, { useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import PrimaryBtn from "../PrimaryBtn"
import SearchInput from "../SearchInput"
import Table from "../Table"
import Pagination from "../Pagination"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import { format, parseISO } from "date-fns"
import TableSkeleton from "../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import { getListReturnGoods } from "../../apis/return-product-module"
import BigNumber from "bignumber.js"

function ManageReturnProducts() {
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
          Header: t("value_return_money"),
          accessor: (data: any) => (
            <p className="whitespace-nowrap">
              {new BigNumber(data?.total).toFormat()} đ
            </p>
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => (
            <p title={data?.note} className="truncate-2-line md:max-w-[100px]">
              {data?.note || "---"}
            </p>
          ),
        },
        {
          Header: " ",
          accessor: (data: any) => <DetailImportProduct data={data} />,
        },
      ],
    },
  ]

  const [searchParam, setSearchParam] = useState<string>("")
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [isLoadingListReturn, setIsLoadingListReturn] = useState(true)
  const [listReturnExportGoods, setListReturnExportGoods] = useState<any>()

  useQueries([
    {
      queryKey: [
        "getListReturnGoods",
        debouncedSearchValue,
        currentPage,
        pageSize,
      ],
      queryFn: async () => {
        setIsLoadingListReturn(true)

        const object = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          type: "export",
        }
        if (debouncedSearchValue) {
          object["code"] = debouncedSearchValue
        }

        const response = await getListReturnGoods(object)

        setIsLoadingListReturn(false)
        setListReturnExportGoods(response?.data)
        return response?.data
      },
    },
  ])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2"></div>
        <Link href={`/create-return-order`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("hoanhang")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <SearchInput
          placeholder={t("search_by_return")}
          onChange={(e) => setSearchParam(e.target.value)}
          className="w-full mb-4"
        />
        {isLoadingListReturn ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listReturnExportGoods?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listReturnExportGoods?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageReturnProducts

function DetailImportProduct({ data }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/return-order-detail/${data?.returnsId}`}>
        <a className="w-full">
          <ShowDetailIcon />
        </a>
      </Link>
    </div>
  )
}
