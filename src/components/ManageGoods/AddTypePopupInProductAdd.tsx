import { DialogOverlay } from "@reach/dialog"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import { useMutation } from "react-query"
import { addTypeGoodUrl } from "../../constants/APIConfig"
import AddPlusIcon from "../icons/AddPlusIcon"
import CloseDialogIcon from "../icons/CloseDialogIcon"
import PlusIcon from "../icons/PlusIcon"
import MotionDialogContent from "../MotionDialogContent"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import SecondaryBtn from "../SecondaryBtn"
import SmallTitle from "../SmallTitle"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

function AddTypePopupInProductAdd({ className = "" }) {
  const router = useRouter()

  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const [typeName, setTypeName] = useState("")
  const [description, setDescription] = useState("")

  const handleSaveBtn = () => {
    // @ts-ignore
    addTypeMutation.mutate({
      categoryName: typeName,
      description: description,
    })
    router.reload()
    close()
  }

  const addTypeMutation = useMutation(
    (type) => {
      return axios.post(addTypeGoodUrl, type)
    },
    {
      onSuccess: (data, error, variables) => {
        toast.success("Thêm loại sản phẩm mới thành công!")
      },
      onError: (data: any) => {
        console.log("login error", data)
        toast.error("Có lỗi xảy ra! Xin kiểm tra lại!")
      },
    },
  )

  return (
    <div className={`${className}`}>
      <button
        className="flex items-center gap-1 bg-[#fff] w-full px-4 py-3 active:bg-[#EFEFEF]"
        onClick={open}
      >
        <AddPlusIcon />
        <p className="text-[#4794F8] text-base">Thêm mới loại sản phẩm</p>
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
                  <SmallTitle>Thêm loại sản phẩm</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    title={
                      <div>
                        Tên loại sản phẩm{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    }
                    onChange={(event) => setTypeName(event.target.value)}
                  />
                </div>
                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    title="Mô tả loại sản phẩm"
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn className="w-[200px]" onClick={handleSaveBtn}>
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

export default AddTypePopupInProductAdd
