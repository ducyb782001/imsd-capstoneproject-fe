import React, { useEffect, useState } from "react"
import SmallTitle from "../SmallTitle"
import PrimaryBtn from "../PrimaryBtn"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { getListProduct } from "../../apis/product-module"
import SearchInput from "../SearchInput"
import Table from "../Table"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
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
        Header: "Nhà cung cấp",
        accessor: (data: any) => <p>{data?.categoryName}</p>,
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "SL nhập",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Đơn giá",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Chiết khấu",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Thành tiền",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
      },
      {
        Header: "Loại",
        accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
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
function SupplierDetail(props) {
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
        <div className="bg-white block-border">
          <div>
            <div className="float-left">
              <SmallTitle>Thông tin chung</SmallTitle>
            </div>
            <div className="float-right">
              <PrimaryBtn
                href={`/edit-supplier/${supplier?.supplierId}`}
                onClick={handleEditSupplier}
                className="bg-F5F5F5 border-F5F5F5 active:bg-purple-800 w-32"
              >
                Thoát
              </PrimaryBtn>
            </div>
          </div>

          <div className=" grid-cols-3 gap-y-1 mt-10">
            <div className="text-gray ">
              <SupplierStatus status={supplier?.status} />
            </div>
            <div className="text-black col-span-2"></div>
            <SupplierInfo title="Mã đơn nhập: " data={supplier?.supplierName} />
            <SupplierInfo title="Ngày nhập: " data={supplier?.supplierPhone} />
            <SupplierInfo
              title="Tên nhà cung cấp: "
              data={supplier?.supplierEmail}
            />
            <SupplierInfo title="Số điện thoại: " data={supplier?.address} />
            <SupplierInfo title="Email: " data={supplier?.note} />
            <SupplierInfo title="Trạng thái nhập: " data={supplier?.note} />
            <SupplierInfo title="Ghi chú: " data={supplier?.note} />
          </div>
        </div>

        <div className="bg-white block-border mt-4">
          <h1 className="font-bold text-2xl">Tên những sản phẩm nhập</h1>
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

export default SupplierDetail

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
        <h1 className="m-2 ml-3">Hoàn thành</h1>
      </div>
    )
  } else {
    return (
      <div className="bg-D69555 text-black font-bold mt-4 w-36 rounded-md">
        <h1 className=" ml-3">Chờ duyệt đơn</h1>
      </div>
    )
  }
}
