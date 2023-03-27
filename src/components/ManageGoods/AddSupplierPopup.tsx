import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import AddPlusIcon from "../icons/AddPlusIcon"
import CloseDialogIcon from "../icons/CloseDialogIcon"
import MotionDialogContent from "../MotionDialogContent"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import SecondaryBtn from "../SecondaryBtn"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import { isValidPhoneNumber } from "../../hooks/useValidator"
import { toast } from "react-toastify"
import { addNewSupplier } from "../../apis/supplier-module"
import { useMutation, useQueryClient } from "react-query"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created- product-type-id"

function AddSupplierPopup({ className = "" }) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const { t } = useTranslation()

  const [supplier, setSupplier] = useState<any>()

  const handleAddNewSupplier = () => {
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewSupplierMutation.mutate({
      ...supplier,
    })
  }

  const queryClient = useQueryClient()

  const addNewSupplierMutation = useMutation(
    async (newProduct) => {
      return await addNewSupplier(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("add_supplier_success"))
          queryClient.refetchQueries("getListStaff")
          queryClient.refetchQueries("getListSupplier")
          close()
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                t("error_occur"),
            )
          }
        }
      },
    },
  )

  return (
    <div className={`${className}`}>
      <button
        className="flex items-center gap-1 bg-[#fff] w-full px-4 py-3 active:bg-[#EFEFEF] hover:bg-[#EFEAFA]"
        onClick={open}
      >
        <AddPlusIcon />
        <p className="text-[#4794F8] text-base">{t("add_new_supplier")}</p>
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
              className="z-50 min-w-[343px] md:min-w-[536px] !bg-transparent"
              style={{ width: 350 }}
            >
              <motion.div
                className="flex flex-col bg-white rounded-lg"
                initial={{ y: +30 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-center justify-between p-4 md:p-6 bg-[#F6F5FA] rounded-t-lg">
                  <SmallTitle>Thêm nhanh nhà cung cấp</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F]">
                  <PrimaryInput
                    title={
                      <div>
                        {t("supplier_name")}{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    }
                    placeholder={t("fill_supplier_name")}
                    onChange={(e) => {
                      setSupplier({ ...supplier, supplierName: e.target.value })
                    }}
                  />
                </div>
                <div className="px-6 mt-6 text-base text-[#4F4F4F]">
                  <PrimaryInput
                    title={
                      <div>
                        Số điện thoại <span className="text-red-500">*</span>
                      </div>
                    }
                    onChange={(e) => {
                      setSupplier({
                        ...supplier,
                        supplierPhone: e.target.value,
                      })
                    }}
                    placeholder={t("enter_number")}
                  />
                  {supplier?.supplierPhone &&
                    !!!isValidPhoneNumber(supplier?.supplierPhone) && (
                      <p className="text-red-500">Sai định dạng</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-8 mb-4">
                  <PrimaryBtn
                    className="w-[200px]"
                    disabled={
                      (supplier?.supplierPhone &&
                        !!!isValidPhoneNumber(supplier?.supplierPhone)) ||
                      !!!supplier?.supplierPhone ||
                      !!!supplier?.supplierName
                    }
                    onClick={handleAddNewSupplier}
                  >
                    {t("add_new_supplier")}
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

export default AddSupplierPopup
