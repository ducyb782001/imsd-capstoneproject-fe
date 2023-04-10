import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries, useQueryClient } from "react-query"
import CloseDialogIcon from "../../icons/CloseDialogIcon"
import MotionDialogContent from "../../MotionDialogContent"
import PrimaryBtn from "../../PrimaryBtn"
import PrimaryInput from "../../PrimaryInput"
import SecondaryBtn from "../../SecondaryBtn"
import SmallTitle from "../../SmallTitle"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import EditIcon from "../../icons/EditIcon"
import {
  getTypeGoodDetail,
  updateTypeGood,
} from "../../../apis/type-good-module"
import { checkStringLength } from "../../../lib"
import { useTranslation } from "react-i18next"
const TOAST_CREATED_TYPE_ID = "toast-created-type-id"

function EditTypePopup({ className = "", id }) {
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const { t } = useTranslation()
  const [typeName, setTypeName] = useState("")
  const [description, setDescription] = useState("")
  const handleSaveBtn = () => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_TYPE_ID,
    })
    // @ts-ignore
    editTypeMutation.mutate({
      categoryId: id,
      categoryName: typeName,
      description: description,
    })
    close()
  }

  useQueries([
    {
      queryKey: ["getTypeGoodDetail", id],
      queryFn: async () => {
        const response = await getTypeGoodDetail(id)
        setTypeName(response?.data?.categoryName)
        setDescription(response?.data?.description)
        return response?.data
      },
    },
  ])

  const editTypeMutation = useMutation(
    async (type) => {
      return await updateTypeGood(type)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.dismiss(TOAST_CREATED_TYPE_ID)
        toast.success(t("edit_category_success"))
        queryClient.refetchQueries("getListTypeGood")
      },
      onError: (data: any) => {
        toast.dismiss(TOAST_CREATED_TYPE_ID)
        toast.error(t("error_occur"))
      },
    },
  )

  return (
    <div className={`${className}`}>
      <div onClick={open}>
        <EditIcon className="cursor-pointer" />
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
                  <SmallTitle>{t("edit_category")}</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <div>
                    <PrimaryInput
                      title={
                        <div>
                          {t("name_type")}{" "}
                          <span className="text-red-500">*</span>
                        </div>
                      }
                      value={typeName ? typeName : ""}
                      onChange={(event) => setTypeName(event.target.value)}
                    />
                    {checkStringLength(typeName, 100) && (
                      <div className="text-sm text-red-500">
                        {t("max_length_category")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <div>
                    <PrimaryInput
                      title={t("description_type")}
                      value={description ? description : ""}
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
                  <SecondaryBtn className="w-[70px]">{t("exit")}</SecondaryBtn>
                </div>
              </motion.div>
            </MotionDialogContent>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditTypePopup
