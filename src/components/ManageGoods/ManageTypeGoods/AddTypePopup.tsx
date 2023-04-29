import { DialogOverlay } from "@reach/dialog"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import CloseDialogIcon from "../../icons/CloseDialogIcon"
import MotionDialogContent from "../../MotionDialogContent"
import PrimaryBtn from "../../PrimaryBtn"
import PrimaryInput from "../../PrimaryInput"
import SecondaryBtn from "../../SecondaryBtn"
import SmallTitle from "../../SmallTitle"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { addNewType } from "../../../apis/type-good-module"
import { checkStringLength } from "../../../lib"

const TOAST_CREATED_TYPE_ID = "toast-created-type-id"

function AddTypePopup({ className = "", children }) {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const [typeName, setTypeName] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()

  const handleSaveBtn = () => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_TYPE_ID,
    })
    // @ts-ignore
    addTypeMutation.mutate({
      categoryName: typeName,
      description: description,
    })
    close()
  }

  const addTypeMutation = useMutation(
    async (newType) => {
      return await addNewType(newType)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.dismiss(TOAST_CREATED_TYPE_ID)
        toast.success(t("add_type_success"))
        setTypeName("")
        setDescription("")
        queryClient.invalidateQueries("getListTypeGood")
      },
      onError: (data: any) => {
        console.log("login error", data)
        toast.dismiss(TOAST_CREATED_TYPE_ID)
        toast.error(t("error_occur"))
        setTypeName("")
        setDescription("")
      },
    },
  )

  return (
    <div className={`${className}`}>
      <div onClick={open}>{children}</div>

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
                  <SmallTitle>{t("add_type")}</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 text-base text-[#4F4F4F] pt-5">
                  <div>
                    <PrimaryInput
                      title={
                        <div>
                          {t("name_type")}{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      }
                      onChange={(event) => setTypeName(event.target.value)}
                    />
                    {checkStringLength(typeName, 100) && (
                      <div className="text-sm text-red-500">
                        {t("max_length_category")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 text-base text-[#4F4F4F] py-5">
                  <div>
                    <PrimaryInput
                      title={t("description_type")}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                    {checkStringLength(description, 250) && (
                      <div className="text-sm text-red-500">
                        {t("note_category_length")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn
                    className="w-[200px]"
                    onClick={handleSaveBtn}
                    disabled={
                      !typeName ||
                      typeName?.length > 100 ||
                      description?.length > 250
                    }
                  >
                    {t("save")}
                  </PrimaryBtn>
                  <SecondaryBtn onClick={close} className="w-[70px]">
                    {t("exit")}
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

export default AddTypePopup
