import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import CloseDialogIcon from "./icons/CloseDialogIcon"
import MotionDialogContent from "./MotionDialogContent"
import PrimaryBtn from "./PrimaryBtn"
import SecondaryBtn from "./SecondaryBtn"
import SmallTitle from "./SmallTitle"
import { useTranslation } from "react-i18next"

function ConfirmPopup({
  disabled = false,
  children,
  handleClickSaveBtn = null,
  className = "",
  classNameBtn = "",
  title = "",
}) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const handleSaveBtn = () => {
    close()
    handleClickSaveBtn()
  }

  const { t } = useTranslation()
  const handleCloseBtn = () => {
    close()
  }

  return (
    <div className={`${className} w-full`}>
      <PrimaryBtn className={classNameBtn} onClick={open} disabled={disabled}>
        {children}
      </PrimaryBtn>
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
                  <SmallTitle>{t("confirm_action")}</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  {title}
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn className="w-[164px]" onClick={handleSaveBtn}>
                    {t("confirm")}
                  </PrimaryBtn>
                  <SecondaryBtn className="w-[70px]" onClick={handleCloseBtn}>
                    {t("cancel")}
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

export default ConfirmPopup
