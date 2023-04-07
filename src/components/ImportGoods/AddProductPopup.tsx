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
import {
  getListExportSupplier,
  getListSupplier,
} from "../../apis/supplier-module"
import { toast } from "react-toastify"
import { addNewProduct } from "../../apis/product-module"
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"
import AddChooseTypeDropdown from "../ManageGoods/AddChooseTypeDropdown"
import BigNumber from "bignumber.js"

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

  const [isLoadingSupplier, setIsLoadingSupplier] = useState(true)

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (
      nhaCungCapSelected == null ||
      typeProduct == null ||
      product.productName?.trim() == "" ||
      product.productName == null
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  })

  const addNewProductMutation = useMutation(
    async (newProduct) => {
      return await addNewProduct(newProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm mới sản phẩm thành công!")
          queryClient.refetchQueries("getListProductBySupplier")
          close()
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data || "Error")
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Đã có lỗi xảy ra! Xin hãy thử lại.",
            )
          }
        }
      },
    },
  )

  const handleSaveBtn = (event) => {
    event.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    // @ts-ignore
    addNewProductMutation.mutate({
      ...product,
      status: true,
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
        setIsLoadingSupplier(true)
        const queryObj = {
          offset: 0,
          limit: 1000,
          status: true,
        }
        const response = await getListSupplier(queryObj)
        await setListNhaCungCap(response?.data?.data)
        setIsLoadingSupplier(false)

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
        <p className="text-[#4794F8] text-base">Thêm nhanh sản phẩm</p>
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
                  <SmallTitle>Thêm nhanh sản phẩm</SmallTitle>
                  <CloseDialogIcon onClick={close} className="cursor-pointer" />
                </div>

                <div className="px-6 mt-3 text-base text-[#4F4F4F] py-5">
                  <PrimaryInput
                    placeholder="Nhập tên sản phẩm"
                    title={
                      <p>
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </p>
                    }
                    value={product?.productName || ""}
                    onChange={(e) => {
                      setProduct({ ...product, productName: e.target.value })
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Nhà cung cấp <span className="text-red-500">*</span>
                      </p>
                      <AddChooseSupplierDropdown
                        listDropdown={listNhaCungCap}
                        textDefault={"Chọn nhà cung cấp"}
                        showing={nhaCungCapSelected}
                        setShowing={setNhaCungCapSelected}
                        isLoadingSupplier={isLoadingSupplier}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold text-gray">
                        Loại sản phẩm <span className="text-red-500">*</span>
                      </p>
                      <AddChooseTypeDropdown
                        listDropdown={listTypeProduct}
                        textDefault={"Chọn loại sản phẩm"}
                        showing={typeProduct}
                        setShowing={setTypeProduct}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>Mã sản phẩm</p>
                          <Tooltip
                            content={
                              <div>
                                Mã không trùng lặp giữa các sản phẩm
                                <p>
                                  Nếu để trống, mã sản phẩm sẽ có tiền tố SP
                                </p>
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      value={product?.productCode ? product?.productCode : ""}
                      onChange={(e) => {
                        setProduct({ ...product, productCode: e.target.value })
                      }}
                      placeholder="Nhập mã sản phẩm"
                    />
                    <PrimaryInput
                      title={
                        <div className="flex gap-1">
                          <p>Mã vạch/ Barcode</p>
                          <Tooltip
                            content={
                              <div>
                                Nếu để trống, mã vạch sẽ trùng với mã sản phẩm
                              </div>
                            }
                          >
                            <InfoIcon />
                          </Tooltip>
                        </div>
                      }
                      placeholder="Nhập tay hoặc dùng máy quét"
                      value={product?.barcode ? product?.barcode : ""}
                      onChange={(e) => {
                        setProduct({ ...product, barcode: e.target.value })
                      }}
                    />
                    <PrimaryInput
                      title="Đơn vị tính"
                      placeholder="Nhập đơn vị tính"
                      value={
                        product?.defaultMeasuredUnit
                          ? product?.defaultMeasuredUnit
                          : ""
                      }
                      onChange={(e) => {
                        setProduct({
                          ...product,
                          defaultMeasuredUnit: e.target.value,
                        })
                      }}
                    />
                    <div className="hidden md:block" />
                    <PrimaryInput
                      title="Giá nhập"
                      type="number"
                      min="0"
                      value={
                        BigNumber(product?.costPrice).isGreaterThanOrEqualTo(0)
                          ? product?.costPrice
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value < 0 ? 0 : e.target.value
                        setProduct({ ...product, costPrice: value })
                      }}
                      accessoriesRight="đ"
                    />
                    <PrimaryInput
                      title="Giá bán"
                      type="number"
                      min="0"
                      value={
                        BigNumber(product?.sellingPrice).isGreaterThanOrEqualTo(
                          0,
                        )
                          ? product?.sellingPrice
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value < 0 ? 0 : e.target.value
                        setProduct({ ...product, sellingPrice: value })
                      }}
                      accessoriesRight="đ"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 px-6 mt-3 mb-4">
                  <PrimaryBtn
                    className="w-[200px]"
                    onClick={handleSaveBtn}
                    disabled={disabled}
                  >
                    Thêm sản phẩm
                  </PrimaryBtn>
                  <SecondaryBtn className="w-[70px]" onClick={close}>
                    Thoát
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
