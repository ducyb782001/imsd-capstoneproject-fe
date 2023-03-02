import { DialogOverlay } from "@reach/dialog"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { addTypeGoodUrl } from "../../../constants/APIConfig"
import AddPlusIcon from "../../icons/AddPlusIcon"
import CloseDialogIcon from "../../icons/CloseDialogIcon"
import PlusIcon from "../../icons/PlusIcon"
import MotionDialogContent from "../../MotionDialogContent"
import PrimaryBtn from "../../PrimaryBtn"
import PrimaryInput from "../../PrimaryInput"
import SecondaryBtn from "../../SecondaryBtn"
import SmallTitle from "../../SmallTitle"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

const TOAST_CREATED_TYPE_ID = "toast-created-type-id"

function AddTypePopup({ className = "" }) {
  const router = useRouter()

  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const [disabled, setDisabled] = useState(true)

  const [typeName, setTypeName] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()

  const handleSaveBtn = () => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_TYPE_ID,
    })
    // @ts-ignore
    addTypeMutation.mutate({
      categoryName: typeName,
      description: description,
    })
    close()
  }

  useEffect(() => {
    if (typeName.trim() !== "" && description.trim() !== "") {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  })

  const addTypeMutation = useMutation(
    (type) => {
      return axios.post(addTypeGoodUrl, type)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.dismiss(TOAST_CREATED_TYPE_ID)
        toast.success("Thêm loại sản phẩm mới thành công!")
        queryClient.refetchQueries("getListTypeGood")
      },
      onError: (data: any) => {
        console.log("login error", data)
        toast.error("Có lỗi xảy ra! Xin kiểm tra lại!")
      },
    },
  )

  return (
    <div className={`${className}`}>
      <PrimaryBtn onClick={open}>
        <PlusIcon /> Thêm loại sản phẩm
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
                  <SmallTitle>Thêm loại sản phẩm</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6  text-base text-[#4F4F4F] pt-5">
                  <PrimaryInput
                    title="Tên loại sản phẩm"
                    onChange={(event) => setTypeName(event.target.value)}
                  />
                </div>
                <div className="px-6 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    title="Mô tả loại sản phẩm"
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn
                    className="w-[200px]"
                    onClick={handleSaveBtn}
                    disabled={disabled}
                  >
                    Lưu
                  </PrimaryBtn>
                  <SecondaryBtn className="w-[70px]">Thoát</SecondaryBtn>
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
