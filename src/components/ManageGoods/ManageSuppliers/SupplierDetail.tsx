import React, { useEffect, useState } from "react"
import SmallTitle from "../../SmallTitle"
import PrimaryBtn from "../../PrimaryBtn"
import { useQueries } from "react-query"
import { useRouter } from "next/router"
import { getListProduct } from "../../../apis/product-module"
import SearchInput from "../../SearchInput"
import Table from "../../Table"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import ShowDetailIcon from "../../icons/ShowDetailIcon"
import { getSupplierDetail } from "../../../apis/supplier-module"
import Pagination from "../../Pagination"
import useDebounce from "../../../hooks/useDebounce"
import SupplierDetailSkeleton from "../../Skeleton/SupplierDetailSkeleton"

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
              className="object-cover w-full h-full rounded-xl"
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
function SupplierDetail() {
  const [supplier, setSupplier] = useState<Supplier>()
  const [isEnabled, setIsEnabled] = useState(true)
  const [listProductSupplier, setListProductSupplier] = useState<any>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)

  const router = useRouter()
  const queryId = router.query.supplierid
  const [isLoadingSupplierDetail, setIsLoadingSupplierDetail] = useState(true)

  useQueries([
    {
      queryKey: ["getSupplierDetail", router.query.supplierid],
      queryFn: async () => {
        const response = await getSupplierDetail(router.query.supplierid)
        await setSupplier(response?.data)
        setIsLoadingSupplierDetail(response?.data?.isLoading)
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

  return isLoadingSupplierDetail ? (
    <SupplierDetailSkeleton />
  ) : (
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
              className="bg-successBtn border-successBtn active:bg-greenDark"
            >
              Chỉnh sửa nhà cung cấp
            </PrimaryBtn>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-10 gap-y-1">
          <div className="text-gray ">
            <SupplierStatus status={supplier?.status} />
          </div>
          <div className="col-span-2 text-black"></div>
          <SupplierInfo
            title="Tên nhà cung cấp: "
            data={supplier?.supplierName}
          />
          <SupplierInfo title="Số điện thoại" data={supplier?.supplierPhone} />
          <SupplierInfo title="Email" data={supplier?.supplierEmail} />
          <SupplierInfo
            title="Địa chỉ"
            data={
              supplier?.address +
              ", " +
              supplier?.ward +
              ", " +
              supplier?.district +
              ", " +
              supplier?.city
            }
          />
          <SupplierInfo title="Ghi chú" data={supplier?.note} />
        </div>
      </div>

      <div className="mt-4 bg-white block-border">
        <h1 className="text-2xl font-bold">Mặt hàng cung cấp</h1>
        <div className="flex flex-col gap-4 mt-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
            <SearchInput
              placeholder="Tìm kiếm bằng tên sản phẩm"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full col-span-3"
            />
          </div>
          <div className="mt-4 table-style">
            <Table
              pageSizePagination={10}
              columns={columns}
              data={listProductSupplier?.data}
            />
          </div>
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={listProductSupplier?.total}
          />
        </div>
      </div>
    </div>
  )
}

export default SupplierDetail

function SupplierInfo({ title = "", data = "" }) {
  return (
    <div>
      <div className="text-gray ">{title}</div>
      <div className="col-span-2 text-black">{data}</div>
    </div>
  )
}
function SupplierStatus({ status = false }) {
  if (status) {
    return (
      <div className="mt-4 font-bold text-white bg-green-500 rounded-md w-36">
        <h1 className="m-2 ml-3">Đang giao dịch</h1>
      </div>
    )
  } else {
    return (
      <div className="mt-4 font-bold text-white rounded-md bg-gray w-36">
        <h1 className="ml-3 ">Dừng giao dịch</h1>
      </div>
    )
  }
}
