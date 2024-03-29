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
import useDebounce from "../../../hooks/useDebounce"
import { useQueries } from "react-query"
import {
  getListSupplier,
  getListExportSupplier,
} from "../../../apis/supplier-module"
import * as XLSX from "xlsx/xlsx"
import EditIcon from "../../icons/EditIcon"
import TableSkeleton from "../../Skeleton/TableSkeleton"
import { useTranslation } from "react-i18next"
import GreenStatus from "../../ReturnGood/GreenStatus"
import YellowStatus from "../../ReturnGood/YellowStatus"

function ManageSuppliers({ ...props }) {
  const { t } = useTranslation()
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("supplier_name"),
          accessor: (data: any) => (
            <p
              title={data?.supplierName || ""}
              className="truncate-2-line max-w-[300px]"
            >
              {data?.supplierName}
            </p>
          ),
        },
        {
          Header: t("phone_number"),
          accessor: (data: any) => <p>{data?.supplierPhone}</p>,
        },
        {
          Header: "Email",
          accessor: (data: any) => (
            <p className="truncate-2-line">{data?.supplierEmail || "---"}</p>
          ),
        },
        {
          Header: t("address"),
          accessor: (data: any) => <RenderAddress data={data} />,
        },
        {
          Header: t("status"),
          accessor: (data: any) =>
            data?.status ? (
              <div className="flex justify-center">
                <GreenStatus status={t("on_sale")} />
              </div>
            ) : (
              <div className="flex justify-center">
                <YellowStatus status={t("off_sale")} />
              </div>
            ),
        },
        {
          Header: t("action"),
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
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listSupplier, setListSupplier] = useState<any>()

  const [listSupplierExport, setListSupplierExport] = useState<any>()
  const [isLoadingListSupplier, setIsLoadingListSupplier] = useState(true)
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
        setIsLoadingListSupplier(true)
        const queryObj = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          ...queryParams,
        }
        if (debouncedSearchValue) {
          queryObj["search"] = debouncedSearchValue
        }
        const response = await getListSupplier(queryObj)
        setListSupplier(response?.data)
        setIsLoadingListSupplier(false)

        return response?.data
      },
    },
  ])

  return (
    <div>
      <div className="flex items-center justify-end">
        <Link href={`/add-supplier`}>
          <a>
            <PrimaryBtn
              className="max-w-[250px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("add_new_supplier")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder={t("search_in_supplier")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full col-span-3"
            />
          </div>
        </div>

        {isLoadingListSupplier ? (
          <TableSkeleton />
        ) : (
          <div className="mt-4 table-style">
            <Table
              pageSizePagination={pageSize}
              columns={columns}
              data={listSupplier?.data}
            />
          </div>
        )}
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

function RenderAddress(data) {
  const [fullAddressRes, setFullAddressRes] = useState("")

  useEffect(() => {
    if (!data) return

    const { address, ward, district, city } = data.data

    const fullAddress = [address, ward?.name, district?.name, city?.name]
      .filter(Boolean)
      .join(", ")

    setFullAddressRes(fullAddress)
  }, [data])

  return (
    <p
      title={data?.data?.address || "---"}
      className="truncate-2-line max-w-[250px]"
    >
      {fullAddressRes || "---"}
    </p>
  )
}
