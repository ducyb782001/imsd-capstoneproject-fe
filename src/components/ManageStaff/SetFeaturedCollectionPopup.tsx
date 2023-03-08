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

function SetFeaturedCollectionPopup({ collectionId, className = "" }) {
  const [isFeatured, setIsFeatured] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const handleSaveBtn = () => {
    // in dev
    setIsFeatured(!isFeatured)
    close()
    // setFeaturedCollection.mutate()
  }

  const queryClient = useQueryClient()

  // const setFeaturedCollection = useMutation(
  //   async () => {
  //     return await approveOneCollection(collectionId)
  //   },
  //   {
  //     onSuccess: (data) => {
  //       if (data?.status >= 200 && data?.status < 300) {
  //         toast.success("Set featured collection succeed")
  //         setIsFeatured(!isFeatured)
  //         setShowDialog(false)
  //         queryClient.invalidateQueries("getListCollections")
  //       } else {
  //         toast.error(
  //           data?.response?.data?.message ||
  //             data?.message ||
  //             "Opps! Something went wrong...",
  //         )
  //       }
  //     },
  //     onError: (err: any) => {
  //       console.log("Set featured collection error", err?.message)
  //       toast.error(err?.response?.data?.message || err?.message)
  //     },
  //   },
  // )

  const handleCloseBtn = () => {
    close()
  }

  return (
    <div className={`${className} flex justify-center`}>
      <PrimaryInputCheckbox onChange={open} checked={isFeatured} />
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
                  <SmallTitle>Approve confirm</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="flex flex-col items-center px-6 py-5 mt-3">
                  {isFeatured ? <WarningCircleIcon /> : <ApproveIcon />}
                  <p className="text-base text-[#4F4F4F] ">
                    {isFeatured
                      ? "Are you sure want to unfeatured this collection"
                      : "Are you sure want to set this collection as featured"}
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-5 min-w-[340px] px-6 mt-3 mb-4">
                  <SecondaryBtn className="" onClick={handleCloseBtn}>
                    Cancel
                  </SecondaryBtn>
                  <PrimaryBtn className="" onClick={handleSaveBtn}>
                    Approve
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

export default SetFeaturedCollectionPopup
