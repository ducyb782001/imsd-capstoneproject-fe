import React, { useEffect, useState } from "react"
import DatePicker from "../DatePicker"
import DemoDropDown from "../DemoDropDown"
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
import { getListProduct } from "../../apis/product-module"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã SP",
        accessor: (data: any) => <p>{data?.productCode}</p>,
      },
      {
        Header: "Ảnh",
        accessor: (data: any) => (
          <div className="w-[35px] h-[35px] rounded-xl">
            <img
              className="object-cover rounded-xl"
              src="/images/image-default.png"
              alt="image-product"
            />
          </div>
        ),
      },
      {
        Header: "Tên sản phẩm",
        accessor: (data: any) => <p>{data?.productName}</p>,
      },
      {
        Header: "Nhà cung cấp",
        accessor: (data: any) => <p>{data?.supplier?.supplierName}</p>,
      },
      {
        Header: "Loại",
        accessor: (data: any) => <p>{data?.category?.categoryName}</p>,
      },
      {
        Header: "Tồn kho",
        accessor: (data: any) => (
          <p>{new BigNumber(data?.inStock).toFormat()}</p>
        ),
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Ngày khởi tạo",
        accessor: (data: any) => <p>12/08/2022 15:30</p>,
      },
      {
        Header: " ",
        accessor: (data: any) => {
          return (
            <Link href={`/product-detail/${data?.id}`}>
              <a className="w-full">
                <ShowDetailIcon />
              </a>
            </Link>
          )
        },
      },
    ],
  },
]

const listNhaCungCapDemo = [
  { id: "1", name: "Hacom" },
  { id: "3", name: "Kinh Do" },
]
const listCategoryDemo = [
  { id: "1", name: "Laptop" },
  { id: "2", name: "Phone" },
]

function ManageGoods({ ...props }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeSelected, setTypeSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listProduct, setListProduct] = useState<any>()

  useEffect(() => {
    if (nhaCungCapSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "supId",
          applied: "Nhà cung cấp",
          value: nhaCungCapSelected?.name,
          id: nhaCungCapSelected?.id,
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
          value: typeSelected?.name,
          id: typeSelected?.id,
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
          if(debouncedSearchValue) {
            const response = await getListProduct({
              search: debouncedSearchValue,
              offset: (currentPage - 1) * pageSize,
              limit: pageSize,
              ...queryParams,
            })
            setListProduct(response?.data)
            return response?.data
          } else {
            const response = await getListProduct({
              offset: (currentPage - 1) * pageSize,
              limit: pageSize,
              ...queryParams,
            })
            setListProduct(response?.data)
            return response?.data
          }
         
        },
      },
    ])
  console.log("List: ", listProduct)
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <ImportExportButton accessoriesLeft={<DownloadIcon />}>
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <Link href={`/add-product`}>
          <a>
            <PrimaryBtn
              className="max-w-[200px]"
              accessoriesLeft={<PlusIcon />}
            >
              Thêm sản phẩm
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-602020">
            <SearchInput
              placeholder="Tìm kiếm theo tên/ mã sản phẩm"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />
            <DemoDropDown
              listDropdown={listNhaCungCapDemo}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <DemoDropDown
              listDropdown={listCategoryDemo}
              textDefault={"Loại sản phẩm"}
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

        {/* Table */}
        <div className="mt-4 table-style">
          {/* {data && ( */}
          <Table
            pageSizePagination={pageSize}
            columns={columns}
            data={listProduct?.data}
          />
          {/* )} */}
        </div>
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={listProduct?.total}
        />
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
