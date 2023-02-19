import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useQueries } from "react-query"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import InfoIcon from "../icons/InfoIcon"
import XIcons from "../icons/XIcons"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import Tooltip from "../ToolTip"
import AddProductPopup from "./AddProductPopup"
import ChooseStaffDropdown from "./ChooseStaffDropdown"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"
import { format } from "date-fns"
import { useRouter } from "next/router"

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

function CreateImportReport() {
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
              autoUpdatePrice={autoUpdatePrice}
              setAutoUpdatePrice={setAutoUpdatePrice}
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
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
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
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
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
              autoUpdatePrice={autoUpdatePrice}
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
                // let listProduct = listProductImport?.filter(
                //   (i, ind) => ind !== index,
                // )
                // setListProductImport(listProduct)
              }}
            >
              <XIcons />
            </div>
          ),
        },
      ],
    },
  ]
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [listSupplier, setListSupplier] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()

  useQueries([
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        const response = await getListExportSupplier({})
        setListSupplier(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const response = await getListStaff({})
        setListStaff(response?.data)
        return response?.data
      },
    },
  ])

  useEffect(() => {
    if (staffSelected) {
      setProductImportObject({
        ...productImportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])
  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductImportObject({
        ...productImportObject,
        supplierId: nhaCungCapSelected?.supplierId,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (productChosen) {
      if (listChosenProduct.includes(productChosen)) {
        return
      }
      setListChosenProduct([...listChosenProduct, productChosen])
    }
  }, [productChosen])

  useEffect(() => {
    if (listChosenProduct.length > 0) {
      const list = listChosenProduct.map((item) => {
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.costPrice
        const price = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.price
        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
          price: price,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      setProductImportObject({
        ...productImportObject,
        importDetailDTOs: listProductImport,
      })
    }
  }, [listProductImport])

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
  const router = useRouter()
  console.log("List product import: ", listProductImport)

  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-semibold">Tạo hóa đơn nhập hàng</h1>
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[120px]"
              title="Dữ liệu bạn vừa nhập sẽ không được lưu, bạn muốn thoát không?"
              handleClickSaveBtn={() => {
                router.push("/manage-import-goods")
              }}
            >
              Thoát
            </ConfirmPopup>
            {/* <SecondaryBtn onClick={} className="max-w-[120px]">Thoát</SecondaryBtn> */}
          </div>
          <div className="flex justify-center mt-6">
            <StepBar createdDate={format(Date.now(), "dd/MM/yyyy HH:mm")} />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Chọn nhà cung cấp</h1>
              <Tooltip content="Chọn nhà cung cấp để hiển thị mặt hàng tương ứng">
                <InfoIcon />
              </Tooltip>
            </div>
            <ChooseSupplierDropdown
              listDropdown={listSupplier}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày tạo đơn: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <ChooseStaffDropdown
            listDropdown={listStaff?.data}
            textDefault={"Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
          />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            onChange={(e) => {
              setProductImportObject({
                ...productImportObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <SearchProductImportDropdown
          listDropdown={LIST_PRODUCT_DEMO?.data}
          textDefault={"Nhà cung cấp"}
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
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title="Bạn có chắc chắn muốn tạo phiếu nhập hàng không?"
          // handleClickSaveBtn={handleClickSaveBtn}
        >
          Tạo hóa đơn nhập hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateImportReport

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
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
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function ListPriceImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
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
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function ListDiscountImport({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
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
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function CountTotalPrice({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
}) {
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
