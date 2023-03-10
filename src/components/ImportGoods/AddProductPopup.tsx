import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries, useQueryClient } from "react-query"
import AddPlusIcon from "../icons/AddPlusIcon"
import CloseDialogIcon from "../icons/CloseDialogIcon"
import InfoIcon from "../icons/InfoIcon"
import MotionDialogContent from "../MotionDialogContent"
import PrimaryBtn from "../PrimaryBtn"
import PrimaryInput from "../PrimaryInput"
import SecondaryBtn from "../SecondaryBtn"
import SmallTitle from "../SmallTitle"
import Tooltip from "../ToolTip"
import { getListExportTypeGood } from "../../apis/type-good-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { toast } from "react-toastify"
import { addNewProduct } from "../../apis/product-module"
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "../ManageGoods/AddChooseTypeDropdown"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"
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
  const [product, setProduct] = useState<Product>()
  const [showDialog, setShowDialog] = useState(false)
  const [listTypeProduct, setListTypeProduct] = useState([])
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()

  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const queryClient = useQueryClient()

  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Th??m m???i s???n ph???m th??nh c??ng!")
          queryClient.refetchQueries("getListProductBySupplier")
          close()
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "???? c?? l???i x???y ra! Xin h??y th??? l???i.",
            )
          }
        }
      },
    },
  )

  const handleSaveBtn = (event) => {
    event.preventDefault()
    toast.loading("Thao t??c ??ang ???????c x??? l?? ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewProductMutation.mutate({
      ...product,
    })
    close()
  }

  useEffect(() => {
    if (nhaCungCapSelected) {
      setProduct({
        ...product,
        supplierId: nhaCungCapSelected.supplierId,
      })
    }
  }, [nhaCungCapSelected])

  useEffect(() => {
    if (typeProduct) {
      setProduct({
        ...product,
        categoryId: typeProduct.categoryId,
      })
    }
  }, [typeProduct])

  useQueries([
    {
      queryKey: ["getListTypeGood"],
      queryFn: async () => {
        const response = await getListExportTypeGood({})
        await setListTypeProduct(response?.data?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        const response = await getListExportSupplier({})
        await setListNhaCungCap(response?.data?.data)
        return response?.data
      },
    },
  ])

  return (
    <div className={`${className}`}>
      <button
        className="flex items-center justify-center gap-1 bg-[#fff] w-full px-4 py-3 active:bg-[#EFEFEF] border rounded border-grayLight focus:border-primary hover:border-primary"
        onClick={open}
      >
        <AddPlusIcon />
        <p className="text-[#4794F8] text-base">Th??m nhanh s???n ph???m</p>
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
                  <SmallTitle>Th??m nhanh s???n ph???m</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    placeholder="Nh???p t??n s???n ph???m"
                    title={
                      <p>
                        T??n s???n ph???m <span className="text-red-500">*</span>
                      </p>
                    }
                    onChange={(e) => {
                      setProduct({ ...product, productName: e.target.value })
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>M?? s???n ph???m</p>
                          <Tooltip
                            content={
                              <div>
                                M?? kh??ng tr??ng l???p gi???a c??c s???n ph???m
                                <p>
                                  N???u ????? tr???ng, m?? s???n ph???m s??? c?? ti???n t??? SP
                                </p>
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      onChange={(e) => {
                        setProduct({ ...product, productCode: e.target.value })
                      }}
                      placeholder="Nh???p m?? s???n ph???m"
                    />
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>M?? v???ch/ Barcode</p>
                          <Tooltip
                            content={
                              <div>
                                N???u ????? tr???ng, m?? v???ch s??? tr??ng v???i m?? s???n ph???m
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      placeholder="Nh???p tay ho???c d??ng m??y qu??t"
                      onChange={(e) => {
                        setProduct({ ...product, productCode: e.target.value })
                      }}
                    />
                    <PrimaryInput
                      title="????n v??? t??nh"
                      placeholder="Nh???p ????n v??? t??nh"
                      onChange={(e) => {
                        setProduct({
                          ...product,
                          defaultMeasuredUnit: e.target.value,
                        })
                      }}
                    />
                    <PrimaryInput
                      title="Gi?? nh???p"
                      type="number"
                      onChange={(e) => {
                        setProduct({ ...product, costPrice: e.target.value })
                      }}
                    />
                    <PrimaryInput
                      title="Gi?? b??n"
                      type="number"
                      onChange={(e) => {
                        setProduct({ ...product, sellingPrice: e.target.value })
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Nh?? cung c???p
                      </p>
                      <AddChooseSupplierDropdown
                        listDropdown={listNhaCungCap}
                        textDefault={"Ch???n nh?? cung c???p"}
                        showing={nhaCungCapSelected}
                        setShowing={setNhaCungCapSelected}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Lo???i s???n ph???m
                      </p>
                      <AddChooseTypeDropdown
                        listDropdown={listTypeProduct}
                        textDefault={"Ch???n lo???i s???n ph???m"}
                        showing={typeProduct}
                        setShowing={setTypeProduct}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn className="w-[200px]" onClick={handleSaveBtn}>
                    Th??m s???n ph???m
                  </PrimaryBtn>
                  <SecondaryBtn className="w-[70px]" onClick={close}>
                    Tho??t
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
