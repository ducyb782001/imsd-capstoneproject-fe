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

function ManageReturnExportGoods() {
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
          Header: "Giá trị trả hàng",
          accessor: (data: any) => (
            <p>{new BigNumber(data?.total).toFormat()} đ</p>
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
        const object = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          type: "export",
        }
        if (debouncedSearchValue) {
          object["code"] = debouncedSearchValue
        }

        const response = await getListReturnGoods(object)

        setIsLoadingListReturn(response?.data?.isLoading)
        setListReturnExportGoods(response?.data)
        return response?.data
      },
    },
  ])

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
        <Link href={`/create-return-export-good`}>
          <a>
            <PrimaryBtn
              className="max-w-[230px]"
              accessoriesLeft={<PlusIcon />}
            >
              Hoàn hàng
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <SearchInput
          placeholder={t("search_return")}
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

export default ManageReturnExportGoods

function DetailImportProduct({ data }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/return-import-detail/${data?.returnsId}`}>
        <a className="w-full">
          <ShowDetailIcon />
        </a>
      </Link>
    </div>
  )
}
