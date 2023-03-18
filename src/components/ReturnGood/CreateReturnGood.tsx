import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  getListImportProduct,
} from "../../apis/import-product-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import { useRouter } from "next/router"
import ChooseImportReportDropdown from "./ChooseImportReportDropdown"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import PrimaryBtn from "../PrimaryBtn"
import ChooseFileReason from "../ChooseFileReason"
import Loading from "../Loading"
import { IKImage } from "imagekitio-react"
import { createReturnGoods } from "../../apis/return-product-module"

const TOAST_CREATED_RETURN_GOODS_ID = "toast-created-return-goods-id"
const TOAST_UPLOAD_IMAGE = "toast-upload-image"

function CreateReturnReport() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: "STT",
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: "Ảnh",
          accessor: (data: any) => (
            <img
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || "---"}
            </p>
          ),
        },
        {
          Header: "Mã sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode || "---"}
            </p>
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => <RenderUnit data={data} />,
        },
        {
          Header: "SL trả",
          accessor: (data: any) => (
            <ListQuantitiveImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: "Đơn giá gốc",
          accessor: (data: any) => (
            <p className="text-center text-blue">{data?.costPrice}</p>
          ),
        },
        {
          Header: "Đơn giá trả",
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
          Header: "Thành tiền",
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
  const [reportChosen, setReportChosen] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listImportReport, setListImportReport] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [listProductImport, setListProductImport] = useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const [loadingImage, setLoadingImage] = useState(false)
  const [imageUploaded, setImageUploaded] = useState("")

  const [productImport, setProductImport] = useState<any>()

  const onErrorUpload = (error: any) => {
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    toast.error("Upload image false")
    setLoadingImage(false)
  }

  const onSuccessUpload = (res: any) => {
    toast.dismiss(TOAST_UPLOAD_IMAGE)
    toast.success("Upload image success")
    setImageUploaded(res?.url)
    setProductImportObject({
      ...productImportObject,
      media: res.url,
    })
    setLoadingImage(false)
  }

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
        )?.costPrice

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
        const cost = new BigNumber(currentProduct.costPrice || 0).times(
          currentProduct.amount || 0,
        )
        if (currentProduct.discount) {
          const discountPrice = new BigNumber(currentProduct.amount || 0)
            .multipliedBy(currentProduct.costPrice || 0)
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
        totalCost: new BigNumber(price).toFixed(),
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
          toast.success("Trả hàng thành công")
          router.push("/manage-return-good")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_RETURN_GOODS_ID,
    })
    createReturnMutation.mutate(productImportObject)
  }
  console.log(productImportObject)

  const router = useRouter()
  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId, reportChosen?.importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(
          importId || reportChosen?.importId,
        )
        setProductImport(response?.data)
        setListChosenProduct(response?.data?.importOrderDetails)
        return response?.data
      },
      enabled: !!importId || !!reportChosen?.importId,
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const response = await getListStaff()
        setListStaff(response?.data?.data)
        return response?.data?.data
      },
    },
    {
      queryKey: ["getListImportReport"],
      queryFn: async () => {
        const response = await getListImportProduct({
          offset: 0,
          limit: 100,
        })
        setListImportReport(response?.data)
        return response?.data
      },
    },
  ])

  useEffect(() => {
    if (productImport) {
      setProductImportObject({
        ...productImportObject,
        importId: importId || reportChosen?.importId,
        supplierId: productImport.supplierId,
      })
    }
  }, [productImport])

  return (
    <div>
      <div className="flex items-center justify-end w-full">
        <PrimaryBtn
          className="w-[120px]"
          onClick={() => router.push("/manage-return-customer")}
        >
          {t("exit")}
        </PrimaryBtn>
      </div>
      <div className="w-full mt-6 bg-white block-border">
        <SmallTitle>Thông tin đơn trả</SmallTitle>
        <div className="grid grid-cols-1 gap-5 mt-4 md:grid-cols-2">
          <ChooseImportReportDropdown
            title={
              <p>
                Đơn trả <span className="text-red-500">*</span>
              </p>
            }
            listDropdown={importId ? [] : listImportReport?.data}
            textDefault={productImport?.importCode || "Chọn đơn trả"}
            showing={reportChosen}
            setShowing={setReportChosen}
          />
          <div>
            <p className="mb-2 text-sm font-bold text-gray">Nhà cung cấp</p>
            <div className="mt-2">
              {productImport?.supplier?.supplierName} -{" "}
              {productImport?.supplier?.supplierPhone}
            </div>
          </div>
          <ChooseStaffDropdown
            title="Nhân viên tạo đơn"
            listDropdown={listStaff}
            textDefault={"Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
          />
        </div>
        <div className="grid gap-5 mt-4 md:grid-cols-73">
          <PrimaryTextArea
            rows={4}
            title="Lý do trả hàng"
            onChange={(e) => {
              setProductImportObject({
                ...productImportObject,
                note: e.target.value,
              })
            }}
            className="w-full"
          />
          <div>
            <p className="mb-2 text-sm font-bold text-gray">Chọn lý do (ảnh)</p>
            <ChooseFileReason
              onError={onErrorUpload}
              onSuccess={onSuccessUpload}
              imageUploaded={imageUploaded}
              loadingImage={loadingImage}
              setLoadingImage={setLoadingImage}
              toastLoadingId={TOAST_UPLOAD_IMAGE}
            >
              {loadingImage ? (
                <div className="w-full h-[176px] flex items-center justify-center">
                  <Loading />
                </div>
              ) : imageUploaded ? (
                <IKImage src={imageUploaded} />
              ) : (
                ""
              )}
              {/* <SecondaryBtn className="w-[150px]">Chọn file</SecondaryBtn> */}
            </ChooseFileReason>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm trả</h1>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">
            Tổng giá trị hàng trả: {new BigNumber(totalPriceSend).toFormat(0)} đ
          </div>
        </div>
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title="Bạn có chắc chắn muốn trả không?"
          handleClickSaveBtn={handleClickSaveBtn}
        >
          Trả hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateReturnReport

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
        placeholder="0"
        value={quantity ? quantity : ""}
        onChange={(e) => {
          e.stopPropagation()
          if (e.target.value > data?.amount) {
            setQuantity(data?.amount)
            handleOnChangeAmount(data?.amount, data)
          } else {
            setQuantity(e.target.value)
            handleOnChangeAmount(e.target.value, data)
          }
        }}
      />
      <div>/ {data?.amount}</div>
    </div>
  )
}

function ListPriceImport({ data, listProductImport, setListProductImport }) {
  const [costPrice, setCostPrice] = useState()

  useEffect(() => {
    if (data) {
      setCostPrice(data?.costPrice)
    }
  }, [data])

  useEffect(() => {
    if (costPrice) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, costPrice: costPrice }
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
      placeholder="---"
      value={costPrice ? costPrice : ""}
      onChange={(e) => {
        setCostPrice(e.target.value)
        e.stopPropagation()
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
          item.costPrice || 0,
        )
        const discountPrice = new BigNumber(item.amount || 0)
          .multipliedBy(item.costPrice || 0)
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
    <div className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
      {new BigNumber(price).toFormat(0)} đ
    </div>
  )
}

function RenderUnit({ data }) {
  return (
    <p className="truncate-2-line max-w-[100px]">
      {data?.measuredUnitId
        ? data?.product?.measuredUnits.filter(
            (i) => i.measuredUnitId === data?.measuredUnitId,
          )[0].measuredUnitName
        : data?.defaultMeasuredUnit}
    </p>
  )
}
