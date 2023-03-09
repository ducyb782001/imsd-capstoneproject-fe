import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
// import { approveOneCollection } from "../../apis/collection-module"
import ApproveIcon from "../icons/ApproveIcon"
import CloseDialogIcon from "../icons/CloseDialogIcon"
import WarningCircleIcon from "../icons/WarningCircleIcon"
import MotionDialogContent from "../MotionDialogContent"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInputCheckbox from "../PrimaryInputCheckbox"
import SecondaryBtn from "../SecondaryBtn"
import SmallTitle from "../SmallTitle"
import Switch from "react-switch"
import { activeStaffModule, deactiveStaffModule } from "../../apis/user-module"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function SetStatusPopup({ data, className = "" }) {
  const [checked, setChecked] = useState<boolean>(data?.status)
  console.log(data)
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const handleChangeStatus = () => {
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    if (checked == false) {
      activeStaff.mutate()
    } else if (checked == true) {
      deactiveStaff.mutate()
    }
    setChecked(!checked)
  }
  const queryClient = useQueryClient()

  const activeStaff = useMutation(
    async () => {
      return await activeStaffModule(data?.userId)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Kích hoạt tài khoản thành công")
          queryClient.refetchQueries("getListTypeGood")
          setShowDialog(false)
          // queryClient.invalidateQueries("getListCollections")
        } else {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          queryClient.refetchQueries("getListTypeGood")
          toast.error(
            data?.response?.data?.message ||
              data?.message ||
              "Opps! Something went wrong...",
          )
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message)
      },
    },
  )
  const deactiveStaff = useMutation(
    async () => {
      return await deactiveStaffModule(data?.userId)
    },
    {
      onSuccess: (data) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Vô hiệu hóa tài khoản thành công")
          queryClient.refetchQueries("getListTypeGood")
          setShowDialog(false)
          // queryClient.invalidateQueries("getListCollections")
        } else {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          queryClient.refetchQueries("getListTypeGood")
          toast.error(
            data?.response?.data?.message ||
              data?.message ||
              "Opps! Something went wrong...",
          )
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message)
      },
    },
  )

  const handleCloseBtn = () => {
    close()
  }

  return (
    <div className={`${className} flex justify-center`}>
      <Switch
        onChange={open}
        checked={checked}
        width={44}
        height={24}
        className="ml-2 !opacity-100"
        uncheckedIcon={null}
        checkedIcon={null}
        offColor="#CBCBCB"
        onColor="#6A44D2"
      />
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
                  <SmallTitle>Xác nhận</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="flex flex-col items-center px-6 py-5 mt-3">
                  {checked ? <WarningCircleIcon /> : <ApproveIcon />}
                  <p className="text-base text-[#4F4F4F] ">
                    {checked
                      ? "Bạn muốn vô hiệu hóa tài khoản này không?"
                      : "Bạn muốn kích hoạt tài khoản này không?"}
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-5 min-w-[340px] px-6 mt-3 mb-4">
                  <SecondaryBtn className="" onClick={handleCloseBtn}>
                    Hủy
                  </SecondaryBtn>
                  <PrimaryBtn className="" onClick={handleChangeStatus}>
                    Đồng ý
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

export default SetStatusPopup
