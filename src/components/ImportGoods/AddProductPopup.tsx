import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import AddPlusIcon from "../icons/AddPlusIcon"
import CloseDialogIcon from "../icons/CloseDialogIcon"
import InfoIcon from "../icons/InfoIcon"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"
import ChooseTypeDropdown from "../ManageGoods/ChooseTypeDropdown"
import MotionDialogContent from "../MotionDialogContent"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import SecondaryBtn from "../SecondaryBtn"
import SmallTitle from "../SmallTitle"
import Tooltip from "../ToolTip"

interface Product {
  productName: string
  productCode: string
  barcode: string
  categoryId: number
  supplierId: number
  costPrice: number
  sellingPrice: number
  defaultMeasuredUnit: string
}

function AddProductPopup({ className = "" }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [typeProduct, setTypeProduct] = useState<any>()
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const handleSaveBtn = () => {
    close()
  }

  return (
    <div className={`${className}`}>
      <button
        className="flex items-center justify-center gap-1 bg-[#fff] w-full px-4 py-3 active:bg-[#EFEFEF] border rounded border-grayLight focus:border-primary hover:border-primary"
        onClick={open}
      >
        <AddPlusIcon />
        <p className="text-[#4794F8] text-base">Thêm nhanh sản phẩm</p>
      </button>
      <AnimatePresence>
        {showDialog && (
          <DialogOverlay
            onDismiss={close}
            className="z-50 flex items-center justify-center"
          >
            {/* @ts-ignore */}
            <MotionDialogContent
              aria-label="Deposit popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-50 min-w-[343px] md:min-w-[700px] !bg-transparent"
              style={{ width: 350 }}
            >
              <motion.div
                className="flex flex-col bg-white rounded-lg"
                initial={{ y: +30 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-center justify-between p-4 md:p-6 bg-[#F6F5FA] rounded-t-lg">
                  <SmallTitle>Thêm nhanh sản phẩm</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    placeholder="Nhập tên sản phẩm"
                    title={
                      <p>
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </p>
                    }
                    // onChange={(e) => {
                    //   setProduct({ ...product, productName: e.target.value })
                    // }}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>Mã sản phẩm</p>
                          <Tooltip
                            content={
                              <div>
                                Mã không trùng lặp giữa các sản phẩm
                                <p>
                                  Nếu để trống, mã sản phẩm sẽ có tiền tố SP
                                </p>
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      // onChange={(e) => {
                      //   setProduct({ ...product, productCode: e.target.value })
                      // }}
                      placeholder="Nhập mã sản phẩm"
                    />
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>Mã vạch/ Barcode</p>
                          <Tooltip
                            content={
                              <div>
                                Nếu để trống, mã vạch sẽ trùng với mã sản phẩm
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      placeholder="Nhập tay hoặc dùng máy quét"
                      // onChange={(e) => {
                      //   setProduct({ ...product, productCode: e.target.value })
                      // }}
                    />
                    <PrimaryInput
                      title="Đơn vị tính"
                      placeholder="Nhập đơn vị tính"
                      // onChange={(e) => {
                      //   setProduct({ ...product, defaultMeasuredUnit: e.target.value })
                      // }}
                    />
                    <PrimaryInput
                      title="Giá nhập"
                      type="number"
                      value={0}
                      onChange={() => {}}
                      // onChange={(e) => {
                      //   setProduct({ ...product, costPrice: e.target.value })
                      // }}
                    />
                    <PrimaryInput
                      title="Giá bán"
                      type="number"
                      value={0}
                      onChange={() => {}}
                      // onChange={(e) => {
                      //   setProduct({ ...product, sellingPrice: e.target.value })
                      // }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Nhà cung cấp
                      </p>
                      <ChooseSupplierDropdown
                        listDropdown={[]}
                        textDefault={"Chọn nhà cung cấp"}
                        showing={nhaCungCapSelected}
                        setShowing={setNhaCungCapSelected}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Loại sản phẩm
                      </p>
                      <ChooseTypeDropdown
                        listDropdown={[]}
                        textDefault={"Chọn loại sản phẩm"}
                        showing={typeProduct}
                        setShowing={setTypeProduct}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn className="w-[200px]" onClick={handleSaveBtn}>
                    Thêm sản phẩm
                  </PrimaryBtn>
                  <SecondaryBtn className="w-[70px]" onClick={close}>
                    Thoát
                  </SecondaryBtn>
                </div>
              </motion.div>
            </MotionDialogContent>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddProductPopup
