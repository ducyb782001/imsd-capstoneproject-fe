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

function ProductDetail(props) {
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(false)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(false)
  const [listUnits, setListUnits] = useState([])
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")

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

  return (
    <div className="grid gap-4 md:grid-cols-73">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <ReadOnlyField
            className="mt-6"
            readOnly={true}
            title="Tên sản phẩm"
            value="Quà tết con mèo"
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput title="Mã sản phẩm" value="SP01" readOnly={true} />
            <PrimaryInput title="Đơn vị tính" value="Hộp" readOnly={true} />
            <PrimaryInput
              title="Giá nhập"
              type="number"
              value={10000}
              readOnly={true}
            />
            <PrimaryInput
              title="Giá bán"
              type="number"
              value={10000}
              readOnly={true}
            />
          </div>
          <PrimaryTextArea
            title="Ghi chú sản phẩm"
            value="Sản phẩm này rất tốt"
            readOnly={true}
          />
        </div>
        <div className="mt-4 bg-white block-border">
          <div className="flex items-center gap-2">
            <SmallTitle>Khởi tạo kho hàng</SmallTitle>
            <Tooltip
              content={<div>Khởi tạo số lượng hàng sẵn có trong kho.</div>}
            >
              <InfoIcon />
            </Tooltip>
            <Switch
              onChange={() => {
                setIsCreateWarehouse(!isCreateWarehouse)
              }}
              checked={isCreateWarehouse}
              width={44}
              height={24}
              className="ml-2 !opacity-100"
              uncheckedIcon={null}
              checkedIcon={null}
              offColor="#CBCBCB"
              onColor="#6A44D2"
            />
          </div>
          {isCreateWarehouse && (
            <AnimatePresence initial={false}>
              {isCreateWarehouse && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className="grid grid-cols-2 mt-4 gap-7"
                >
                  <PrimaryInput
                    title="Tồn kho ban đầu"
                    type="number"
                    value={10000}
                    readOnly={true}
                  />
                  <PrimaryInput
                    title="Giá vốn"
                    type="number"
                    value={10000}
                    readOnly={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="mt-4 bg-white block-border">
          <div className="flex items-center gap-2">
            <SmallTitle>Thêm đơn vị quy đổi</SmallTitle>
            <Tooltip
              content={
                <div>
                  Tạo thêm các đơn vị để quản lí sản phẩm.
                  <p>Ví dụ: 1 thùng = 10 chai</p>
                </div>
              }
            >
              <InfoIcon />
            </Tooltip>
            <Switch
              onChange={() => {
                setIsAdditionalUnit(!isAdditionalUnit)
              }}
              checked={isAdditionalUnit}
              width={44}
              height={24}
              className="ml-2 !opacity-100"
              uncheckedIcon={null}
              checkedIcon={null}
              offColor="#CBCBCB"
              onColor="#6A44D2"
            />
          </div>
          {/* Su dung trong page detail */}
          {/* {isAdditionalUnit && (
            <AnimatePresence initial={false}>
              {isAdditionalUnit && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className="grid grid-cols-2 mt-4 gap-7"
                >
                  <PrimaryInput
                    title="Tồn kho ban đầu"
                    type="number"
                    value={10000}
                    readOnly={true}
                  />
                  <PrimaryInput
                    title="Giá vốn"
                    type="number"
                    value={10000}
                    readOnly={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )} */}

          {/* su dung trong cac page con lai */}
          {isAdditionalUnit && (
            <AnimatePresence initial={false}>
              {isAdditionalUnit && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className=""
                >
                  {listUnits.length > 0 && (
                    <div className="">
                      {listUnits.map((i, index) => (
                        <TableUnitRow
                          key={`unit-row-${i?.type}-${index}`}
                          data={i}
                          itemIndex={index}
                          listUnits={listUnits}
                          setListUnits={setListUnits}
                        />
                      ))}
                    </div>
                  )}

                  <AdditionUnitRow
                    newType={newType}
                    setNewType={setNewType}
                    newDetail={newDetail}
                    setNewDetail={setNewDetail}
                    handleAddNewUnit={handleAddNewUnit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      <RightSideProductDetail />
    </div>
  )
}

export default ProductDetail

const listNhaCungCapDemo = [
  { id: "1", name: "Chinh Bac" },
  { id: "2", name: "ABCD" },
]

const lisLoaiSanPhamDemo = [
  { id: "1", name: "Bánh" },
  { id: "2", name: "Trái" },
  { id: "2", name: "Hoa quả" },
]

function RightSideProductDetail(props) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)

  const [imageUploaded, setImageUploaded] = useState("")
  const [loadingImage, setLoadingImage] = useState(false)
  const router = useRouter()
  const onErrorUpload = (error: any) => {
    console.log("upload error", error)
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    console.log(res)
    // setImages([...images, res.filePath])
    setImageUploaded(res.url)
    setLoadingImage(false)
  }
  console.log("Router:", router)
  return (
    <div className="">
      <div className="bg-white block-border h-[365px] flex flex-col items-center justify-center gap-4">
        {/* Detail thi su dung img nay luon */}
        <img
          className="object-cover w-[200px] h-[200px] rounded-md"
          src="/images/image-product-demo.jpeg"
          alt="image-product"
        />

        {/* upload moi hoac edit thi phai su dung cai nay  */}
        {/* <div className="flex justify-center md:justify-start">
          <div className="flex items-center justify-center border rounded-full border-primary w-[150px] h-[150px] mt-5">
          <AddImage
            onError={onErrorUpload}
            onSuccess={onSuccessUpload}
            imageUploaded={imageUploaded}
            setLoadingImage={setLoadingImage}
          >
            {loadingImage ? (
              <div className="w-full h-[176px] flex items-center justify-center">
                <Loading />
              </div>
            ) : imageUploaded ? (
              <IKImage src={imageUploaded} />
            ) : (
              ""
            )}
          </AddImage>
          </div>
        </div> */}

        <p className="text-xl font-semibold">Ảnh sản phẩm</p>
      </div>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Thông tin bổ sung</SmallTitle>

        <p className="mt-4">Nhà cung cấp</p>
        <ChooseSupplierDropdown
          listDropdown={listNhaCungCapDemo}
          textDefault={"Chọn nhà cung cấp"}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
        />
        <p className="mt-4">Loại sản phẩm</p>
        <ChooseTypeDropdown
          listDropdown={lisLoaiSanPhamDemo}
          textDefault={"Chọn loại sản phẩm"}
          showing={typeProduct}
          setShowing={setTypeProduct}
        />
        <p className="mt-4">Trạng thái</p>
        <div className="flex items-center justify-between">
          <p className="text-gray">Cho phép bán</p>
          <Switch
            onChange={() => {
              setIsEnabled(!isEnabled)
            }}
            checked={isEnabled}
            width={44}
            height={24}
            className="ml-2 !opacity-100"
            uncheckedIcon={null}
            checkedIcon={null}
            offColor="#CBCBCB"
            onColor="#6A44D2"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4 bg-white block-border">
        {/* <PrimaryBtn className="bg-cancelBtn border-cancelBtn active:bg-cancelDark">
          Hủy
        </PrimaryBtn>
        <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
          Thêm sản phẩm
        </PrimaryBtn> */}
        <Link href={`/edit-product/${1}`}>
          <a className="w-full">
            <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
              Chỉnh sửa sản phẩm
            </PrimaryBtn>
          </a>
        </Link>
      </div>
    </div>
  )
}

function AdditionUnitRow({
  newType,
  setNewType,
  newDetail,
  setNewDetail,
  handleAddNewUnit,
}) {
  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="Thùng"
        title="Đơn vị quy đổi"
        onChange={(e) => setNewType(e.target.value)}
        value={newType}
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title="Số lượng trong đơn vị tương ứng"
        onChange={(e) => setNewDetail(e.target.value)}
        type="number"
        value={newDetail}
        onKeyPress={(e) => {
          // 13 is enter button
          console.log("E: ", e)

          if (e.key === "Enter") {
            handleAddNewUnit()
          }
        }}
      />
      <div className="h-[46px] flex items-center justify-center">
        <AddUnitIcon className="cursor-pointer" onClick={handleAddNewUnit} />
      </div>
    </div>
  )
}

function TableUnitRow({ data, listUnits, setListUnits, itemIndex }) {
  const handleRemoveProperty = () => {
    const listRemove = listUnits.filter((i, index) => index !== itemIndex)
    setListUnits(listRemove)
  }

  return (
    <div className="grid items-end gap-2 mt-3 text-white grid-cols-454510 md:gap-5">
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="Thùng"
        title="Đơn vị quy đổi"
        value={data?.type}
        readOnly
      />
      <PrimaryInput
        classNameInput="text-xs md:text-sm rounded-md"
        placeholder="10"
        title="Số lượng trong đơn vị tương ứng"
        value={data?.detail}
        type="number"
        readOnly
      />
      <div className="h-[46px] flex items-center justify-center cursor-pointer">
        <div onClick={handleRemoveProperty}>
          <GarbageIcon />
        </div>
      </div>
    </div>
  )
}
