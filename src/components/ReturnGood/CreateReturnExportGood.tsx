import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getAllStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import { useRouter } from "next/router"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import PrimaryBtn from "../PrimaryBtn"
import ChooseFileReason from "../ChooseFileReason"
import Loading from "../Loading"
import { IKImage } from "imagekitio-react"
import {
  createReturnGoods,
  getListProductAvailable,
} from "../../apis/return-product-module"
import {
  getAllExportProduct,
  getDetailExportProduct,
} from "../../apis/export-product-module"
import ChooseExportReportDropdown from "./ChooseExportReportDropdown"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import ReturnGoodIcon from "../icons/ReturnGoodIcon"
import ReturnGoodsIcon from "../icons/ReturnGoodsIcon"
import { checkStringLength } from "../../lib"
import UploadImage from "../UploadImage"
import useUploadImage from "../../hooks/useUploadImage"
import UnitToolTip from "../UnitToolTip"

const TOAST_CREATED_RETURN_GOODS_ID = "toast-created-return-goods-id"
const TOAST_UPLOAD_IMAGE = "toast-upload-image"

function CreateReturnExportGood() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("no"),
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <img
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || "---"}
            </p>
          ),
        },
        {
          Header: t("product code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode || "---"}
            </p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => <RenderUnit data={data} />,
        },
        {
          Header: t("return_amount"),
          accessor: (data: any) => (
            <ListQuantitiveImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: t("selling_price"),
          accessor: (data: any) => (
            <p className="text-center text-blue">
              {new BigNumber(data?.price).toFormat(0)} {t("vnd")}
            </p>
          ),
        },
        {
          Header: t("return_price"),
          accessor: (data: any) => (
            <div className="items-center ">
              <ListPriceImport
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
            </div>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <CountTotalPrice
              data={data}
              listProductImport={listProductImport}
            />
          ),
        },
      ],
    },
  ]
  const [userData, setUserData] = useState<any>()
  const [reportChosen, setReportChosen] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listExportReport, setListExportReport] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [listProductImport, setListProductImport] = useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

  const [productImport, setProductImport] = useState<any>()

  useEffect(() => {
    if (typeof window !== undefined) {
      const userData = localStorage.getItem("userData")
      setUserData(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (staffSelected) {
      setProductImportObject({
        ...productImportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])

  useEffect(() => {
    if (listChosenProduct?.length > 0) {
      const list = listChosenProduct.map((item) => {
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          price: costPrice,
          measuredUnitId: item?.measuredUnitId ? item?.measuredUnitId : 0,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      const price = listProductImport.reduce((accumulator, currentProduct) => {
        const cost = new BigNumber(currentProduct.price || 0).times(
          currentProduct.amount || 0,
        )
        if (currentProduct.discount) {
          const discountPrice = new BigNumber(currentProduct.amount || 0)
            .multipliedBy(currentProduct.price || 0)
            .multipliedBy(currentProduct.discount || 0)
            .dividedBy(100)
          return accumulator.plus(cost).minus(discountPrice)
        } else {
          return accumulator.plus(cost)
        }
      }, new BigNumber(0))
      setTotalPriceSend(price)
      setProductImportObject({
        ...productImportObject,
        returnsOrderDetails: listProductImport,
      })
    }
  }, [listProductImport])

  const createReturnMutation = useMutation(
    async (importProduct) => {
      return await createReturnGoods(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_RETURN_GOODS_ID)
          toast.success(t("return_product_succeed"))
          router.push("/manage-return-products")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()

    const count = countUndefinedOrEmptyAmount(listProductImport)

    if (!totalPriceSend || count === listProductImport.length) {
      toast.error(t("return_product_warning"))
      return
    }

    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_RETURN_GOODS_ID,
    })
    const submittedData = {
      ...productImportObject,
    }
    if (!staffSelected) {
      submittedData["userId"] = userData.userId
    }
    createReturnMutation.mutate(submittedData)
  }

  const router = useRouter()
  const { exportId } = router.query

  const result = useQueries([
    {
      queryKey: ["getDetailProductExport", exportId, reportChosen?.exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(
          exportId || reportChosen?.exportId,
        )
        setProductImport(response?.data)
        return response?.data
      },
      enabled: !!exportId || !!reportChosen?.exportId,
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const response = await getAllStaff({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListStaff(response?.data?.data)
        setIsLoadingStaff(false)

        return response?.data?.data
      },
    },
    {
      queryKey: ["getListExportReport"],
      queryFn: async () => {
        const response = await getAllExportProduct({
          offset: 0,
          limit: 100,
          state: 2,
        })
        setListExportReport(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListProductAvailable", exportId, reportChosen?.exportId],
      queryFn: async () => {
        const response = await getListProductAvailable({
          exportId: exportId || reportChosen?.exportId,
        })

        setListChosenProduct(response?.data)
        setListProductImport(response?.data)

        return response?.data
      },
      enabled: !!exportId || !!reportChosen?.exportId,
    },
  ])

  const isLoadingListProduct = result[3].isLoading

  useEffect(() => {
    if (productImport) {
      setProductImportObject({
        ...productImportObject,
        exportId: exportId || reportChosen?.exportId,
      })
    }
  }, [productImport])

  const { imageUrlResponse, handleUploadImage } = useUploadImage()

  useEffect(() => {
    if (imageUrlResponse) {
      setProductImportObject({
        ...productImportObject,
        media: imageUrlResponse,
      })
    }
  }, [imageUrlResponse])

  return (
    <div>
      <div className="flex items-center justify-end w-full">
        <PrimaryBtn
          className="w-[120px]"
          onClick={() => router.push("/manage-return-products")}
        >
          {t("exit")}
        </PrimaryBtn>
      </div>
      <div className="w-full mt-6 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ReturnGoodsIcon />
          <SmallTitle>{t("info_return_product")}</SmallTitle>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-4 md:grid-cols-2">
          <ChooseExportReportDropdown
            title={
              <p>
                {t("return_order_good")} <span className="text-red-500">*</span>
              </p>
            }
            listDropdown={exportId ? [] : listExportReport?.data}
            textDefault={
              productImport?.exportCode || t("choose_return_order_good")
            }
            showing={reportChosen}
            setShowing={setReportChosen}
          />
          <ChooseStaffDropdown
            title={t("staff_created")}
            listDropdown={listStaff}
            textDefault={userData?.userName || t("choose_staff")}
            showing={staffSelected}
            setShowing={setStaffSelected}
            isLoadingStaff={isLoadingStaff}
          />
        </div>
        <div className="grid gap-5 mt-4 md:grid-cols-73">
          <div>
            <PrimaryTextArea
              rows={4}
              title={t("return_reason")}
              onChange={(e) => {
                setProductImportObject({
                  ...productImportObject,
                  note: e.target.value,
                })
              }}
              className="w-full"
            />
            {checkStringLength(productImportObject?.note, 250) && (
              <div className="text-sm text-red-500">
                {t("return_reason_warning")}
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-gray">
              {t("reasone_img")}
            </p>
            <UploadImage
              imageUrlResponse={imageUrlResponse}
              onChange={(e) => handleUploadImage(e)}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ReturnGoodIcon />
          <h1 className="text-xl font-semibold">
            {t("return_product_detail")}
          </h1>
        </div>
        {isLoadingListProduct ? (
          <div>
            <div className="h-[60px] w-full skeleton-loading" />
            <div className="h-[60px] w-full skeleton-loading mt-2" />
            <div className="h-[60px] w-full skeleton-loading mt-2" />
            <div className="h-[60px] w-full skeleton-loading mt-2" />
          </div>
        ) : (
          <div className="mt-4 table-style">
            <Table
              pageSizePagination={10}
              columns={columns}
              data={listChosenProduct}
            />
          </div>
        )}
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">
            {t("value_return")}: {new BigNumber(totalPriceSend).toFormat(0)}{" "}
            {t("vnd")}
          </div>
        </div>
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title={t("re_confirm_return")}
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={
            !productImportObject?.exportId ||
            productImportObject?.note?.length > 250
          }
        >
          {t("return good")}
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateReturnExportGood

function ListQuantitiveImport({
  data,
  listProductImport,
  setListProductImport,
}) {
  const [quantity, setQuantity] = useState()
  const handleOnChangeAmount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, amount: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <div className="flex items-center gap-1">
      <PrimaryInput
        className="w-[60px] "
        type="number"
        min="0"
        classNameInput="!px-2"
        placeholder="0"
        value={BigNumber(quantity).isGreaterThanOrEqualTo(0) ? quantity : ""}
        onChange={(e) => {
          e.stopPropagation()
          const value = e.target.value < 0 ? 0 : e.target.value
          if (value > data?.available) {
            setQuantity(data?.available)
            handleOnChangeAmount(data?.available, data)
          } else {
            setQuantity(value)
            handleOnChangeAmount(value, data)
          }
        }}
      />
      <div>/ {data?.available}</div>
    </div>
  )
}

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()

  useEffect(() => {
    if (data) {
      setCostPrice(data?.price)
    }
  }, [data])

  useEffect(() => {
    if (costPrice) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, price: costPrice }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [costPrice])

  return (
    <PrimaryInput
      className="w-[100px]"
      type="number"
      min="0"
      placeholder="---"
      value={BigNumber(costPrice).isGreaterThanOrEqualTo(0) ? costPrice : ""}
      accessoriesRight="đ"
      onChange={(e) => {
        e.stopPropagation()
        const value = e.target.value < 0 ? 0 : e.target.value
        setCostPrice(value)
      }}
    />
  )
}

function CountTotalPrice({ data, listProductImport }) {
  const [price, setPrice] = useState<any>()
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const totalPrice = new BigNumber(item.amount || 0).multipliedBy(
          item.price || 0,
        )
        const discountPrice = new BigNumber(item.amount || 0)
          .multipliedBy(item.price || 0)
          .multipliedBy(item.discount || 0)
          .dividedBy(100)
        if (item.discount) {
          const afterPrice = totalPrice.minus(discountPrice)
          setPrice(afterPrice)
        } else {
          setPrice(totalPrice)
        }
      }
      return item
    })
  }

  useEffect(() => {
    handleSetPrice()
  }, [listProductImport])

  return (
    <div className="py-2 text-center text-white rounded-md bg-successBtn">
      {new BigNumber(price).toFormat(0)} đ
    </div>
  )
}

function RenderUnit({ data }) {
  return (
    <UnitToolTip
      content={
        data?.measuredUnitId &&
        `1 ${data?.measuredUnit?.measuredUnitName} = ${
          data?.measuredUnit?.measuredUnitValue
        } ${data?.defaultMeasuredUnit || "-"}`
      }
    >
      <p className="truncate-2-line max-w-[100px]">
        {data?.measuredUnitId
          ? data?.product?.measuredUnits.filter(
              (i) => i.measuredUnitId === data?.measuredUnitId,
            )[0].measuredUnitName
          : data?.defaultMeasuredUnit || "---"}
      </p>
    </UnitToolTip>
  )
}
