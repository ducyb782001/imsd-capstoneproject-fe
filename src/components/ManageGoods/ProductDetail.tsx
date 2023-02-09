import React, { useState } from "react"
import InfoIcon from "../icons/InfoIcon"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SmallTitle from "../SmallTitle"
import Switch from "react-switch"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import Tooltip from "../ToolTip"
import DemoDropDown from "../DemoDropDown"
import PrimaryBtn from "../PrimaryBtn"
import ChooseSupplierDropdown from "./ChooseSupplierDropdown"
import ChooseTypeDropdown from "./ChooseTypeDropdown"
import SecondaryBtn from "../SecondaryBtn"
import AddPlusIcon from "../icons/AddPlusIcon"
import GarbageIcon from "../icons/GarbageIcon"
import AddUnitIcon from "../icons/AddUnitIcon"
import ReadOnlyField from "../ReadOnlyField"
import { IKImage, IKUpload } from "imagekitio-react"
import AddImage from "../AddImage"
import Loading from "../Loading"
import { useRouter } from "next/router"
import Link from "next/link"
import BigNumber from "bignumber.js"
import format from "date-fns/format"

function ProductDetail(props) {
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(false)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(false)
  const [listUnits, setListUnits] = useState([])
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  const [detailProduct, setDetailProduct] = useState<any>()

  const handleAddNewUnit = () => {
    if (newType && newDetail) {
      setListUnits([
        ...listUnits,
        {
          type: newType,
          detail: newDetail,
        },
      ])
      setNewType("")
      setNewDetail("")
    }
  }
  const dateNow = new Date()
  return (
    <div>
      <h1 className="text-3xl font-medium">Quà tết con mèo</h1>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Thông tin sản phẩm</SmallTitle>
        <div className="grid mt-4 md:grid-cols-433">
          <div className="grid grid-cols-2 gap-y-1">
            <ProductInfo title="Mã sản phẩm" data={"SP01"} />
            <ProductInfo title="Nhà cung cấp" data={"Hạ Long"} />
            <ProductInfo title="Loại sản phẩm" data={"Bánh"} />
            <ProductInfo title="Tồn kho" data={new BigNumber(200).toFormat()} />
            <ProductInfo title="Đơn vị tính" data={"Hộp"} />
            <ProductInfo
              title="Giá nhập"
              data={new BigNumber(1000).toFormat()}
            />
            <ProductInfo
              title="Giá bán"
              data={new BigNumber(2000).toFormat()}
            />
            <ProductInfo
              title="Ngày tạo"
              data={format(dateNow, "MMM dd, yyyy")}
            />
          </div>
          <div>
            <div className="text-gray">Mô tả sản phẩm</div>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Architecto obcaecati provident rem! Accusantium dolores enim
              ducimus magni dolor error, minus iure placeat soluta dolore, nam
              odit sequi. Possimus, similique illo.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            {/* <img
                className="object-cover w-[200] h-[200px] rounded-md"
                alt="product-image"
                src="/images/image-product-demo.jpeg"
              /> */}
            <img
              className="object-cover w-[100px] h-[100px] rounded-md"
              alt="product-image"
              src="/images/no-image.svg"
            />
            <p>Sản phẩm chưa có ảnh</p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Lịch sử</SmallTitle>
      </div>
    </div>
  )
}

export default ProductDetail

function ProductInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray">{title}</div>
      <div className="text-black">{data}</div>
    </>
  )
}
