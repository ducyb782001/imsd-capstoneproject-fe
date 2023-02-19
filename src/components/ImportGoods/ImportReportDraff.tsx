import BigNumber from "bignumber.js"
import { format } from "date-fns"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import AddProductPopup from "./AddProductPopup"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"

const LIST_PRODUCT_DEMO = {
  data: [
    {
      productId: 24,
      productName: "Bánh bơ trứng chảy Richy",
      productCode: "BBT123",
      categoryId: 1004,
      description:
        "Bánh bơ trứng Richy là thương hiệu được ưa thích hàng đầu hiện nay. Bánh có hương vị bơ trứng thơm ngon, béo ngậy, mang đến cảm giác hấp dẫn cho người tiêu dùng. Đặc biệt, bánh Richy đảm bảo an toàn sức khỏe khách hàng với các nguyên liệu tự nhiên, không chứa chất bảo quản và độc hại. Hiện nay, bánh được đóng thành nhiều gói nhỏ tiện lợi, phù hợp để mang đi học, đi chơi, cắm trại,…",
      supplierId: 1,
      costPrice: 150000,
      sellingPrice: 200000,
      defaultMeasuredUnit: "Thùng",
      inStock: 10,
      stockPrice: 2400000,
      image:
        "https://dailyhcm.congtytanhuevien.vn/wp-content/uploads/2022/11/banh-keo-ngon-ngay-tet-2.jpg",
      created: "0001-01-01T00:00:00",
      status: true,
      measuredUnits: [
        {
          measuredUnitId: 0,
          measuredUnitName: "Lốc",
          measuredUnitValue: 8,
        },
        {
          measuredUnitId: 1,
          measuredUnitName: "Gói",
          measuredUnitValue: 8,
        },
      ],
      category: {
        categoryId: 1004,
        categoryName: "Bánh hộp giấy",
        description: "",
      },
      supplier: {
        supplierId: 1,
        supplierName: "Hải Hà Bakery",
        supplierPhone: "0912345678",
        status: true,
        city: "Thành phố Hà Nội",
        district: "Quận Ba Đình",
        ward: "Phường Phúc Xá",
        address: "Đại lộ Thăng Long",
        note: null,
        supplierEmail: "Hacom@gmail.com",
      },
      barcode: "123456",
    },
    {
      productId: 29,
      productName: "Bánh sữa chocolate",
      productCode: "chocolate",
      categoryId: 1,
      description: "string",
      supplierId: 1,
      costPrice: 0,
      sellingPrice: 0,
      defaultMeasuredUnit: "string",
      inStock: 0,
      stockPrice: 0,
      image: null,
      created: "2023-02-12T03:44:02.8710209",
      status: true,
      measuredUnits: null,
      category: {
        categoryId: 1,
        categoryName: "Kẹo dẻo",
        description: "Kẹo dẻo có đường bao xung quanh",
      },
      supplier: {
        supplierId: 1,
        supplierName: "Hải Hà Bakery",
        supplierPhone: "0912345678",
        status: true,
        city: "Thành phố Hà Nội",
        district: "Quận Ba Đình",
        ward: "Phường Phúc Xá",
        address: "Đại lộ Thăng Long",
        note: null,
        supplierEmail: "Hacom@gmail.com",
      },
      barcode: "",
    },
    {
      productId: 31,
      productName: "Sản phẩm mới",
      productCode: "SP8",
      categoryId: 1004,
      description: null,
      supplierId: 1,
      costPrice: null,
      sellingPrice: null,
      defaultMeasuredUnit: null,
      inStock: null,
      stockPrice: null,
      image: "https://ik.imagekit.io/imsd/cat-2083492__340_KNEo0hQ_U.jpg",
      created: "2023-02-14T05:35:51.9784545",
      status: true,
      measuredUnits: null,
      category: {
        categoryId: 1004,
        categoryName: "Bánh hộp giấy",
        description: "",
      },
      supplier: {
        supplierId: 1,
        supplierName: "Hải Hà Bakery",
        supplierPhone: "0912345678",
        status: true,
        city: "Thành phố Hà Nội",
        district: "Quận Ba Đình",
        ward: "Phường Phúc Xá",
        address: "Đại lộ Thăng Long",
        note: null,
        supplierEmail: "Hacom@gmail.com",
      },
      barcode: "abcxyz",
    },
  ],
  offset: 0,
  limit: 100000,
  total: 13,
}

function ImportReportDraff(props) {
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: "STT",
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: "Ảnh",
          accessor: (data: any) => (
            <img
              src={data?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: "SL nhập",
          accessor: (data: any) => (
            <ListQuantitiveImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => (
            <ListUnitImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: "Đơn giá",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <ListPriceImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
              <p>đ</p>
            </div>
          ),
        },
        {
          Header: "Chiết khấu",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <ListDiscountImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
              <p>%</p>
            </div>
          ),
        },
        {
          Header: "Thành tiền",
          accessor: (data: any) => (
            <CountTotalPrice
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: " ",
          accessor: (data: any, index) => (
            <div
              className="cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i, ind) => ind !== index,
                )
                setListChosenProduct(result)
              }}
            >
              <XIcons />
            </div>
          ),
        },
      ],
    },
  ]
  const router = useRouter()
  const [productChosen, setProductChosen] = useState([])
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listChosenProduct, setListChosenProduct] = useState([])

  const totalPrice = () => {
    if (listProductImport?.length > 0) {
      const price = listProductImport.reduce(
        (total, currentValue) =>
          new BigNumber(total).plus(currentValue.price || 0),
        0,
      )
      return <div>{price.toFormat()} đ</div>
    } else {
      return <div>0 đ</div>
    }
  }
  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">#NAHA123</h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-full">
                Chờ duyệt đơn
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              {/* <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px] "
                title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
                handleClickSaveBtn={() => {
                  router.push("/manage-import-goods")
                }}
              >
                Thoát
              </ConfirmPopup>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
                handleClickSaveBtn={() => {
                  // Action post to cancel import report
                }}
              >
                Hủy đơn
              </ConfirmPopup> */}
              <SecondaryBtn className="w-[120px]">Thoát</SecondaryBtn>
              <SecondaryBtn className="w-[120px]">Hủy đơn</SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
                handleClickSaveBtn={() => {
                  // Action post to accept import report
                }}
              >
                Duyệt đơn
              </ConfirmPopup>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar
              status="pending"
              createdDate={format(Date.now(), "dd/MM/yyyy HH:mm")}
            />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="mb-4">
              <h1 className="text-xl font-semibold">Nhà cung cấp</h1>
            </div>
            <div className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
              Điền tên nhà cung cấp vào đây nhé
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn: thêm ngày từ be vào nha
            {/* {format(Date.now(), "dd/MM/yyyy")} */}
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <div className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform">
            <div className="flex items-center gap-1">
              <p className="text-gray">Điền tên nhân viên vào đây</p>
            </div>
          </div>
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            // onChange={(e) => {
            //   setProductImportObject({
            //     ...productImportObject,
            //     note: e.target.value,
            //   })
            // }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <SearchProductImportDropdown
          listDropdown={LIST_PRODUCT_DEMO?.data}
          textDefault={""}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <AddProductPopup className="mt-4" />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">Tổng giá trị đơn hàng:</div>
          {totalPrice()}
        </div>
      </div>
    </div>
  )
}

export default ImportReportDraff

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
}) {
  const [quantity, setQuantity] = useState()
  const handleOnChangeAmount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, amount: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[60px]"
      type="number"
      placeholder="0"
      value={quantity ? quantity : ""}
      onChange={(e) => {
        e.stopPropagation()
        setQuantity(e.target.value)
        handleOnChangeAmount(e.target.value, data)
      }}
    />
  )
}

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()

  useEffect(() => {
    if (data) {
      // Bug chua su dung duoc gia co san de tinh toan
      setCostPrice(data?.costPrice)
    }
  }, [data])

  const handleOnChangePrice = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, costPrice: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[100px]"
      type="number"
      placeholder="---"
      value={costPrice ? costPrice : ""}
      onChange={(e) => {
        e.stopPropagation()
        setCostPrice(e.target.value)
        handleOnChangePrice(e.target.value, data)
      }}
    />
  )
}

function ListDiscountImport({ data, listProductImport, setListProductImport }) {
  const [discount, setDiscount] = useState()
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, discount: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[50px]"
      type="number"
      placeholder="0"
      value={discount ? discount : ""}
      onChange={(e) => {
        e.stopPropagation()
        setDiscount(e.target.value)
        handleOnChangeDiscount(e.target.value, data)
      }}
    />
  )
}

function CountTotalPrice({ data, listProductImport, setListProductImport }) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount).multipliedBy(
          item.costPrice,
        )
        const discountPrice = new BigNumber(item.amount)
          .multipliedBy(item.costPrice)
          .multipliedBy(item.discount)
          .dividedBy(100)
        if (item.discount) {
          const afterPrice = totalPrice.minus(discountPrice)
          setPrice(afterPrice.toFormat(0))
          return { ...item, price: afterPrice.toFixed() }
        } else {
          setPrice(totalPrice.toFormat(0))
          return { ...item, price: totalPrice.toFixed() }
        }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <div
      className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn"
      onClick={handleSetPrice}
    >
      {price} đ
    </div>
  )
}

function ListUnitImport({ data, listProductImport, setListProductImport }) {
  const [listDropdown, setListDropdown] = useState([])
  const [unitChosen, setUnitChosen] = useState<any>()

  useEffect(() => {
    if (data) {
      setListDropdown(data?.measuredUnits)
    }
  }, [data])

  useEffect(() => {
    if (unitChosen) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, measuredUnitId: unitChosen?.measuredUnitId }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [unitChosen])

  return (
    <ChooseUnitImport
      listDropdown={listDropdown}
      showing={unitChosen}
      setShowing={setUnitChosen}
      textDefault={""}
    />
  )
}
