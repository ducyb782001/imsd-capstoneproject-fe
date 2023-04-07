import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  getListImportProduct,
} from "../../apis/import-product-module"
import { getAllStaff } from "../../apis/user-module"
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
import {
  createReturnGoods,
  getListProductAvailable,
} from "../../apis/return-product-module"
import { countUndefinedOrEmptyAmount } from "../../hooks/useCountUndefinedAmount"
import ReturnGoodIcon from "../icons/ReturnGoodIcon"
import ReturnGoodsIcon from "../icons/ReturnGoodsIcon"

const TOAST_CREATED_RETURN_GOODS_ID = "toast-created-return-goods-id"
const TOAST_UPLOAD_IMAGE = "toast-upload-image"

function CreateReturnGood() {
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
          accessor: (data: any) => <p className="text-blue">{data?.price} đ</p>,
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
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

  const [productImport, setProductImport] = useState<any>()

  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    if (typeof window !== undefined) {
      const userData = localStorage.getItem("userData")
      setUserData(JSON.parse(userData))
    }
  }, [])

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
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          price: 0,
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
          toast.success("Trả hàng thành công")
          router.push("/manage-return-product-to-supplier")
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
    const count = countUndefinedOrEmptyAmount(listProductImport)

    if (!totalPriceSend || count === listProductImport.length) {
      toast.error("Phải trả sản phẩm hoặc trả tiền")
      return
    }

    toast.loading("Thao tác đang được xử lý ... ", {
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
  const { importId } = router.query

  const result = useQueries([
    {
      queryKey: ["getDetailProductImport", importId, reportChosen?.importId],
      queryFn: async () => {
        const response = await getDetailImportProduct(
          importId || reportChosen?.importId,
        )
        setProductImport(response?.data)
        // setListChosenProduct(response?.data?.importOrderDetails)
        return response?.data
      },
      enabled: !!importId || !!reportChosen?.importId,
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const response = await await getAllStaff({
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
      queryKey: ["getListImportReport"],
      queryFn: async () => {
        const response = await getListImportProduct({
          offset: 0,
          limit: 100,
          state: 2,
        })
        setListImportReport(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListProductAvailable", importId, reportChosen?.importId],
      queryFn: async () => {
        const response = await getListProductAvailable({
          importid: importId || reportChosen?.importId,
        })

        setListChosenProduct(response?.data)
        setListProductImport(response?.data)

        return response?.data
      },
      enabled: !!importId || !!reportChosen?.importId,
    },
  ])

  const isLoadingListProduct = result[3].isLoading

  useEffect(() => {
    if (productImport) {
      setProductImportObject({
        ...productImportObject,
        importId: importId || reportChosen?.importId,
        supplierId: productImport?.supplier?.supplierId,
      })
    }
  }, [productImport])

  return (
    <div>
      <div className="flex items-center justify-end w-full">
        <PrimaryBtn
          className="w-[120px]"
          onClick={() => router.push("/manage-return-product-to-supplier")}
        >
          {t("exit")}
        </PrimaryBtn>
      </div>
      <div className="w-full mt-6 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ReturnGoodsIcon />
          <SmallTitle>Thông tin đơn trả</SmallTitle>
        </div>
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
            textDefault={userData?.userName || "Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
            isLoadingStaff={isLoadingStaff}
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
            </ChooseFileReason>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <ReturnGoodIcon />
          <h1 className="text-xl font-semibold">Thông tin sản phẩm trả</h1>
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
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title="Bạn có chắc chắn muốn trả không?"
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={!productImportObject?.importId}
        >
          Trả hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateReturnGood

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
