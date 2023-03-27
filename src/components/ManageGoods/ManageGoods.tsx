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
import { format, parseISO } from "date-fns"
import { getListExportTypeGood } from "../../apis/type-good-module"
import ChooseSupplierDropdown from "./ChooseSupplierDropdown"
import ChooseTypeDropdown from "./ChooseTypeDropdown"
import { getListExportSupplier } from "../../apis/supplier-module"
import TableSkeleton from "../Skeleton/TableSkeleton"
import useScanDetection from "../../hooks/useScanDetection"
import { useTranslation } from "react-i18next"
import ShowDetail from "../ShowDetail"
import EditDetail from "../EditDetail"

function ManageGoods({ ...props }) {
  const { t } = useTranslation()
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("product_code"),
          accessor: (data: any) => <p>{data?.productCode}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <div className="w-[35px] h-[35px] rounded-xl">
              <img
                className="object-cover w-full h-full rounded-xl"
                src={data?.image ? data?.image : "/images/image-default.png"}
                alt="image-product"
              />
            </div>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[150px]">{data?.productName}</p>
          ),
        },
        {
          Header: t("supplier"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[150px]">
              {data?.supplier?.supplierName}
            </p>
          ),
        },
        {
          Header: t("type.type"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[150px]">
              {data?.category?.categoryName}
            </p>
          ),
        },
        {
          Header: t("in_stock"),
          accessor: (data: any) => (
            <p>{data?.inStock ? new BigNumber(data?.inStock).toFormat() : 0}</p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
        },
        {
          Header: t("created_date"),
          accessor: (data: any) => (
            <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
          ),
        },
        {
          Header: " ",
          accessor: (data: any) => {
            return (
              <div className="flex items-center w-full gap-2">
                <Link href={`/edit-product/${data?.productId}`}>
                  <a className="w-full">
                    <EditDetail />
                  </a>
                </Link>
                <Link href={`/product-detail/${data?.productId}`}>
                  <a className="w-full">
                    <ShowDetail />
                  </a>
                </Link>
              </div>
            )
          },
        },
      ],
    },
  ]

  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeSelected, setTypeSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listProduct, setListProduct] = useState<any>()

  const [listProductExport, setListProductExport] = useState<any>()
  const [listSupplier, setListSupplier] = useState<any>()
  const [listCategory, setListCategory] = useState<any>()
  const [isLoadingListProducts, setIsLoadingListProducts] = useState(true)

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
    if (typeSelected) {
      // Them logic check id cua type phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "catId",
          applied: "Loại",
          value: typeSelected?.categoryName,
          id: typeSelected?.categoryId,
        },
      ])
    }
  }, [typeSelected])

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

  useScanDetection({
    onComplete: (code) => {
      setSearchParam(code)
    },
    minLength: 13,
  })

  useEffect(() => {
    setSearchParam(searchParam.replace("Shift", ""))
  }, [searchParam])

  useQueries([
    {
      queryKey: [
        "getListProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getListProduct({
            search: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListProduct(response?.data)

          const exportFile = await getListProduct({
            search: debouncedSearchValue,
            offset: 0,
            limit: 1000,
            ...queryParams,
          })
          setListProductExport(exportFile?.data)
          //-----------

          return response?.data
        } else {
          const response = await getListProduct({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListProduct(response?.data)

          const exportFile = await getListExportProduct({
            offset: 0,
            limit: 1000,
          })
          setListProductExport(exportFile?.data)
          setIsLoadingListProducts(response?.data?.isLoading)
          //-----------

          return response?.data
        }
      },
    },
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        const category = await getListExportTypeGood({
          search: debouncedSearchValue,
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          ...queryParams,
        })
        setListCategory(category?.data?.data)
        const typeGood = await getListExportSupplier({})
        setListSupplier(typeGood?.data?.data)
      },
    },
  ])

  const handleExportProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(listProductExport?.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
    <div>
      <div className="flex items-center justify-end">
        <Link href={`/add-product`}>
          <a>
            <PrimaryBtn
              className="max-w-[200px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("add_product")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full grid-cols-1 gap-4 md:grid-cols-602020">
            <SearchInput
              placeholder={t("search.searchInGoods")}
              value={searchParam ? searchParam : ""}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />
            <ChooseSupplierDropdown
              listDropdown={listSupplier}
              textDefault={t("supplier")}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <ChooseTypeDropdown
              listDropdown={listCategory}
              textDefault={t("type.typeGoods")}
              showing={typeSelected}
              setShowing={setTypeSelected}
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

        {isLoadingListProducts ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listProduct?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listProduct?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageGoods

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
