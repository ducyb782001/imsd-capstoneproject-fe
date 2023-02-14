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

// const columns = [
//   {
//     Header: " ",
//     columns: [
//       {
//         Header: "Mã SP",
//         accessor: (data: any) => <p>{data?.productCode}</p>,
//       },
//       {
//         Header: "Ảnh",
//         accessor: (data: any) => (
//           <div className="w-[35px] h-[35px] rounded-xl">
//             <img
//               className="object-cover rounded-xl"
//               src={data?.image}
//               alt="image-product"
//             />
//           </div>
//         ),
//       },
//       {
//         Header: "Tên sản phẩm",
//         accessor: (data: any) => <p>{data?.productName}</p>,
//       },
//       {
//         Header: "Loại",
//         // accessor: (data: any) => <p>{data?.category?.categoryName}</p>,
//         accessor: (data: any) => <p>{data?.categoryName}</p>,
//       },
//       {
//         Header: "Đơn vị",
//         accessor: (data: any) => <p>{data?.defaultMeasuredUnit}</p>,
//       },
//       {
//         Header: "Ngày khởi tạo",
//         accessor: (data: any) => (
//           <p>{data?.created}</p>
//           // <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
//         ),
//       },
//       {
//         Header: " ",
//         accessor: (data: any) => {
//           return (
//             <div className="flex items-center gap-2">
//               <Link href={`/edit-product/${data?.productId}`}></Link>
//               <Link href={`/product-detail/${data?.productId}`}>
//                 <a className="w-full">
//                   <ShowDetailIcon />
//                 </a>
//               </Link>
//             </div>
//           )
//         },
//       },
//     ],
//   },
// ]
const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã SP",
        accessor: (data: any) => <p>SP01</p>,
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
        accessor: (data: any) => <p>Giỏ quà Tết 2023 TET200</p>,
      },
      {
        Header: "Nhà cung cấp",
        accessor: (data: any) => <p>Chính Bắc</p>,
      },
      {
        Header: "Loại",
        accessor: (data: any) => <p>Giỏ quà</p>,
      },
      {
        Header: "Tồn kho",
        accessor: (data: any) => <p>{new BigNumber(100).toFormat()}</p>,
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <p>Giỏ</p>,
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

  const dataTest = [
    { id: 1, firstName: "Test 1", lastName: "Test last2" },
    { id: 2, firstName: "Test 1", lastName: "Test last2" },
    { id: 3, name: "Chinh Bac" },
    { id: 4, name: "Chinh Bac" },
    { id: 5, name: "ABCD" },
    { id: 6, name: "Chinh Bac" },
    { id: 7, name: "Chinh Bac" },
  ]

  const router = useRouter()

  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.success("Add new product success")
          router.push("/coupon")
        } else {
          console.log(data)
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  useQueries([
    {
      queryKey: ["getSupplierDetail", router.query.supplierid],
      queryFn: async () => {
        const response = await getSupplierDetail(router.query.supplierid)
        setSupplier(response?.data)
        console.log("supplier" + supplier)

        const listProduct = await getListProduct({
          offset: 0,
          limit: 1000,
          supId: router.query.supplierid,
        })
        setListProductSupplier(listProduct)

        return response?.data
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

  // console.log("Supplier: ", supplier)
  const listNhaCungCapDemo = [
    { id: "1", name: "Chinh Bac" },
    { id: "2", name: "ABCD" },
  ]
  return (
    <div className="">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <div className="flex items-center float-right">
            <div className="flex flex-col gap-4">
              <div className="grid items-center justify-between fle w-full gap-4 md:grid-cols-2 ">
                <PrimaryBtn
                  href={`/edit-supplier/${supplier?.supplierId}`}
                  onClick={handleEditSupplier}
                  className="bg-successBtn border-successBtn active:bg-greenDark"
                >
                  Chỉnh sửa nhà cung cấp
                </PrimaryBtn>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-y-1 mt-5">
            <SupplierInfo
              title="Tên nhà cung cấp: "
              data={supplier?.supplierName}
            />
            <SupplierInfo
              title="Số điện thoại"
              data={supplier?.supplierPhone}
            />
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

        <div className="bg-white block-border mt-4">
          <h1 className="font-bold text-2xl">Mặt hàng cung cấp</h1>
          <div className="flex flex-col gap-4 mt-4">
            <div className="grid items-center justify-between w-full gap-4 md:grid-cols-3">
              <SearchInput
                placeholder="Tìm kiếm bằng tên nhà cung cấp"
                // onChange={(e) => setSearchParam(e.target.value)}
                className="w-full col-span-2"
              />
              {/* <DemoDropDown
                listDropdown={listProductSupplier}
                textDefault={"Nhà cung cấp"}
                showing={nhaCungCapSelected}
                setShowing={setNhaCungCapSelected}
              /> */}
            </div>
            {/* Table */}
            <div className="mt-4 table-style">
              {/* {data && ( */}
              {/* <Table
                pageSizePagination={1}
                columns={columns}
                data={listProductSupplier}
                // data={listProduct?.data}
              /> */}
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
