import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import MotionDialogContent from "../MotionDialogContent"
import SecondaryBtn from "../SecondaryBtn"
import PrimaryBtn from "../PrimaryBtn"
import SmallTitle from "../SmallTitle"
import CloseDialogIcon from "../icons/CloseDialogIcon"

function ModalExportExcel({ className = "", children, handleExportFile }) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div className={`${className}`}>
      <div className="w-full" onClick={open}>
        {children}
      </div>
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
              className="z-50 min-w-[343px] md:min-w-[536px] !bg-transparent"
              style={{ width: 350 }}
            >
              <motion.div
                className="flex flex-col bg-white rounded-lg"
                initial={{ y: +30 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-center justify-between p-4 md:p-6 bg-[#F6F5FA] rounded-t-lg">
                  <SmallTitle>Xác nhận hành động</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  Bạn có chắc chắc muốn hủy sản phẩm vừa nhập không
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <SecondaryBtn onClick={close} className="w-[70px]">
                    Thoát
                  </SecondaryBtn>
                  <PrimaryBtn onClick={handleExportFile} className="w-[164px]">
                    Xuất file
                  </PrimaryBtn>
                </div>
              </motion.div>
            </MotionDialogContent>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModalExportExcel
