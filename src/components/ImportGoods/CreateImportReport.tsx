import React, { useEffect, useState } from "react"
import SmallTitle from "../SmallTitle"
import DemoDropDown from "../DemoDropDown"
import PrimaryBtn from "../PrimaryBtn"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct, getListProduct } from "../../apis/product-module"
import SearchInput from "../SearchInput"
import Table from "../Table"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import BigNumber from "bignumber.js"
import { getSupplierDetail } from "../../apis/supplier-module"
import Pagination from "../Pagination"
import useDebounce from "../../hooks/useDebounce"

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
              className="object-cover rounded-xl w-full h-full"
              src={data?.image}
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
        Header: "Loại",
        // accessor: (data: any) => <p>{data?.category?.categoryName}</p>,
        accessor: (data: any) => <p>{data?.categoryName}</p>,
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Ngày khởi tạo",
        accessor: (data: any) => (
          <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
        ),
      },
      {
        Header: " ",
        accessor: (data: any) => {
          return (
            <div className="flex items-center gap-2">
              <Link href={`/product-detail/${data?.productId}`}>
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

interface Supplier {
  supplierId: number
  supplierName: string
  supplierPhone: string
  city: string
  district: string
  ward: string
  address: string
  note: string
  supplierEmail: string
  status: boolean
}
function CreateImportReport(props) {
  const [supplier, setSupplier] = useState<Supplier>()
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  const [imageUploaded, setImageUploaded] = useState("")
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [listProductSupplier, setListProductSupplier] = useState<any>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)

  const router = useRouter()

  const queryId = router.query.supplierid
  useQueries([
    {
      queryKey: ["getSupplierDetail", router.query.supplierid],
      queryFn: async () => {
        const response = await getSupplierDetail(router.query.supplierid)
        await setSupplier(response?.data)
        return response?.data
      },
    },
    {
      queryKey: [
        "getListProduct",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryId,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const listProduct = await getListProduct({
            search: debouncedSearchValue,
            offset: 0,
            limit: 1000,
            supId: queryId,
            ...queryParams,
          })
          await setListProductSupplier(listProduct?.data)
        } else {
          const listProduct = await getListProduct({
            offset: 0,
            limit: 1000,
            supId: queryId,
          })
          await setListProductSupplier(listProduct?.data)
        }
      },
    },
  ])

  useEffect(() => {
    setSupplier({
      ...supplier,
      status: true,
    })
  }, [isEnabled])

  const handleEditSupplier = (event) => {
    router.push("/edit-supplier/" + supplier?.supplierId)
  }

  return (
    <div>
      <div>
        <div className="md:grid-cols-4">
          <div className="bg-white  col-span-3"></div>
          <div className="bg-white col-span-1"></div>
        </div>

        <div className="bg-white block-border mt-4">
          <h1 className="font-bold text-2xl">Mặt hàng cung cấp</h1>
          <div className="flex flex-col gap-4 mt-4">
            <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
              <SearchInput
                placeholder="Tìm kiếm bằng tên sản phẩm"
                onChange={(e) => setSearchParam(e.target.value)}
                className="w-full col-span-3"
              />
            </div>
            {/* Table */}
            <div className="mt-4 table-style">
              {/* {data && ( */}
              <Table
                pageSizePagination={10}
                columns={columns}
                data={listProductSupplier?.data}
              />
              {/* )} */}
            </div>
            <Pagination
              //   pageSize={pageSize}
              //   setPageSize={setPageSize}
              //   currentPage={currentPage}
              //   setCurrentPage={setCurrentPage}
              //   totalItems={listProduct?.total}
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listProductSupplier?.total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateImportReport

function SupplierInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray ">{title}</div>
      <div className="text-black col-span-2">{data}</div>
    </>
  )
}
function SupplierStatus({ status = false }) {
  if (status) {
    return (
      <div className="bg-green-500 text-white font-bold mt-4 w-36 rounded-md">
        <h1 className="m-2 ml-3">Đang giao dịch</h1>
      </div>
    )
  } else {
    return (
      <div className="bg-gray text-white font-bold mt-4 w-36 rounded-md">
        <h1 className=" ml-3">Dừng giao dịch</h1>
      </div>
    )
  }
}
