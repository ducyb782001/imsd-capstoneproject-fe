import React, { useEffect, useState } from "react"
import SmallTitle from "../SmallTitle"
import DemoDropDown from "../DemoDropDown"
import PrimaryBtn from "../PrimaryBtn"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { addNewProduct } from "../../apis/product-module"
import SearchInput from "../SearchInput"
import Table from "../Table"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import BigNumber from "bignumber.js"
interface Product {
  productId: number
  productName: string
  productCode: string
  categoryId: number
  description: string
  supplierId: number
  costPrice: number
  sellingPrice: number
  defaultMeasuredUnit: string
  inStock: number
  stockPrice: number
  image: string
  measuredUnits: any
  status: boolean
}
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
        accessor: (data: any) => (
          <p>{format(parseISO(data?.created), "dd/MM/yyyy HH:mm")}</p>
        ),
      },
      {
        Header: " ",
        accessor: (data: any) => {
          return (
            <div className="flex items-center gap-2">
              <Link href={`/edit-product/${data?.productId}`}></Link>
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
function SupplierDetail(props) {
  const [product, setProduct] = useState<Product>()
  const [listUnits, setListUnits] = useState([])
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  const [imageUploaded, setImageUploaded] = useState("")
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)

  const listNhaCungCapDemo = [
    { id: "1", name: "Chinh Bac" },
    { id: "2", name: "ABCD" },
  ]

  useEffect(() => {
    if (imageUploaded) {
      setProduct({
        ...product,
        image: imageUploaded,
      })
    }
  }, [imageUploaded])

  useEffect(() => {
    if (listUnits) {
      setProduct({
        ...product,
        measuredUnits: listUnits,
      })
    }
  }, [listUnits])

  useEffect(() => {
    if (nhaCungCapSelected) {
      setProduct({
        ...product,
        supplierId: nhaCungCapSelected.id,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (typeProduct) {
      setProduct({
        ...product,
        categoryId: typeProduct.id,
      })
    }
  }, [typeProduct])

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

  useEffect(() => {
    setProduct({
      ...product,
      status: true,
    })
  }, [isEnabled])

  const handleAddNewProduct = (event) => {
    event.preventDefault()
    // @ts-ignore
    addNewProductMutation.mutate({
      ...product,
    })
  }

  console.log(
    "Product: ",
    product,
    "Image url: ",
    imageUploaded,
    "Nha cung cap: ",
    product?.supplierId,
    "Loai: ",
    product?.measuredUnits,
  )
  return (
    <div className="">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <div className="grid grid-cols-3 gap-y-1">
            <SupplierInfo
              title="Tên nhà cung cấp: "
              //   data={detailProduct?.productCode}
              data={"Công ty trách nhiệm ABC"}
            />
            <SupplierInfo
              title="Số điện thoại"
              //   data={detailProduct?.supplier?.supplierName}
              data={"0942346666"}
            />
            <SupplierInfo
              title="Email"
              //   data={detailProduct?.category?.categoryName}
              data={"abc@gmail.com"}
            />
            <SupplierInfo
              title="Địa chỉ"
              //   data={new BigNumber(detailProduct?.inStock).toFormat()}
              data={"Sn 9, Giồng Riềng, thành phố Rạch Giá, Kiên Giang"}
            />
            <SupplierInfo
              title="Ghi chú"
              //   data={new BigNumber(detailProduct?.inStock).toFormat()}
            />
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
              <DemoDropDown
                listDropdown={listNhaCungCapDemo}
                textDefault={"Nhà cung cấp"}
                showing={nhaCungCapSelected}
                setShowing={setNhaCungCapSelected}
              />
            </div>
            {/* Table */}
            <div className="mt-4 table-style">
              {/* {data && ( */}
              <Table
                // pageSizePagination={pageSize}
                // columns={columns}
                // data={listProduct?.data}
                pageSizePagination={1}
                columns={columns}
                // data={listProduct?.data}
              />
              {/* )} */}
            </div>
            {/* <Pagination
              //   pageSize={pageSize}
              //   setPageSize={setPageSize}
              //   currentPage={currentPage}
              //   setCurrentPage={setCurrentPage}
              //   totalItems={listProduct?.total}
              pageSize={5}
              setPageSize={5}
              currentPage={1}
              setCurrentPage={}
              totalItems={5}
            /> */}
          </div>
        </div>

        <div className="mt-4 h-24 bg-white block-border ">
          <div className="flex items-center float-right">
            <div className="flex flex-col gap-4">
              <div className="grid items-center justify-between fle w-full gap-4 md:grid-cols-2 ">
                <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
                  Chỉnh sửa nhà cung cấp
                </PrimaryBtn>
              </div>
            </div>
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
