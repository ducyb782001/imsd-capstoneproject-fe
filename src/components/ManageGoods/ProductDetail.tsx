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

function ProductDetail(props) {
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(false)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(false)
  return (
    <div className="grid gap-4 md:grid-cols-7525">
      <div>
        <div className="bg-white block-border">
          <SmallTitle>Thông tin chung</SmallTitle>
          <PrimaryInput
            className="mt-6"
            title="Tên sản phẩm"
            value="Quà tết con mèo"
          />
          <div className="grid grid-cols-2 mt-4 gap-7">
            <PrimaryInput title="Mã sản phẩm" value="SP01" />
            <PrimaryInput title="Đơn vị tính" value="Hộp" />
            <PrimaryInput title="Giá nhập" type="number" value={10000} />
            <PrimaryInput title="Giá bán" type="number" value={10000} />
          </div>
          <PrimaryTextArea
            title="Ghi chú sản phẩm"
            value="Sản phẩm này rất tốt"
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
                  />
                  <PrimaryInput title="Giá vốn" type="number" value={10000} />
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
                  className="grid grid-cols-2 mt-4 gap-7"
                >
                  <PrimaryInput
                    title="Tồn kho ban đầu"
                    type="number"
                    value={10000}
                  />
                  <PrimaryInput title="Giá vốn" type="number" value={10000} />
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

function RightSideProductDetail(props) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [isEnabled, setIsEnabled] = useState(true)
  return (
    <div className="">
      <div className="bg-white block-border h-[365px]">
        Ảnh sản phẩm sẽ Xử lý ảnh sau
      </div>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Thông tin bổ sung</SmallTitle>

        <p className="mt-4">Nhà cung cấp</p>
        <DemoDropDown
          listDropdown={listNhaCungCapDemo}
          textDefault={"Nhà cung cấp"}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
        />
        <p className="mt-4">Loại sản phẩm</p>
        <DemoDropDown
          listDropdown={listNhaCungCapDemo}
          textDefault={"Loại sản phẩm"}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
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
        <PrimaryBtn className="bg-successBtn border-successBtn active:bg-greenDark">
          Chỉnh sửa sản phẩm
        </PrimaryBtn>
      </div>
    </div>
  )
}
