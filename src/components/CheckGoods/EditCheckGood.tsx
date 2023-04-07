import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getListExportProduct } from "../../apis/product-module"
import { getAllStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import {
  getDetailStockTakeProduct,
  updateStockTakeProduct,
} from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import { useTranslation } from "react-i18next"
import ReasonDropdown from "./ReasonDropdown"
import GeneralIcon from "../icons/GeneralIcon"
import CheckGoodIcon from "../icons/CheckGoodIcon"
import DeleteDetail from "../DeleteDetail"
import BigNumber from "bignumber.js"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function EditCheckGood() {
  const { t } = useTranslation()

  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("numerical_order"),
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <img
              src={data?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode || data?.productCode}
            </p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName || data?.productName}
            </p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <p>
              {data?.defaultMeasuredUnit ? data?.defaultMeasuredUnit : "---"}
            </p>
          ),
        },
        {
          Header: t("current_stock"),
          accessor: (data: any) => <RenderCurrentStock data={data} />,
        },
        {
          Header: t("actual_stock"),
          accessor: (data: any) => (
            <div className="flex items-center justify-center">
              <ListActualStock
                data={data}
                listProductCheck={listProductCheck}
                setListProductCheck={setListProductCheck}
              />
            </div>
          ),
        },
        {
          Header: t("deviated"),
          accessor: (data: any) => (
            <CountDeviated data={data} listProductCheck={listProductCheck} />
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => (
            <div className="flex items-center w-[150px]">
              <ListNote
                data={data}
                listProductCheck={listProductCheck}
                setListProductCheck={setListProductCheck}
              />
            </div>
          ),
        },
        {
          Header: " ",
          accessor: (data: any, index) => (
            <div
              className="w-full cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i, ind) => ind !== index,
                )
                setListChosenProduct(result)
              }}
            >
              <DeleteDetail />
            </div>
          ),
        },
      ],
    },
  ]

  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductCheck, setListProductCheck] = useState<any>([])
  const [listProduct, setListProduct] = useState<any>([])
  const [productCheckObject, setProductCheckObject] = useState<any>()
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

  useEffect(() => {
    if (staffSelected) {
      setProductCheckObject({
        ...productCheckObject,
        createdId: staffSelected?.userId,
      })
    }
  }, [staffSelected])

  useEffect(() => {
    if (productChosen) {
      if (listChosenProduct.includes(productChosen)) {
        return
      }
      setListChosenProduct([...listChosenProduct, productChosen])
    }
  }, [productChosen])

  useEffect(() => {
    if (listChosenProduct) {
      const list = listChosenProduct.map((item) => {
        const currentStock = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.currentStock
        const measuredUnitId = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.measuredUnitId
        const note = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.note
        const actualStock = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.actualStock

        return {
          productId: item.productId,
          measuredUnitId: measuredUnitId,
          currentStock: currentStock,
          actualStock: actualStock,
          note: note,
        }
      })
      setListProductCheck(list)
    }
    setProductChosen(null)
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductCheck) {
      setProductCheckObject({
        ...productCheckObject,
        stocktakeNoteDetails: listProductCheck,
      })
    }
  }, [listProductCheck])

  const router = useRouter()
  const { checkId } = router.query
  const [isLoadingReport, setIsLoadingReport] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const staff = await getAllStaff({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListStaff(staff?.data?.data)
        setIsLoadingStaff(false)

        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct({
          offset: 0,
          limit: 1000,
        })
        setListProduct(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getDetailStockTake", checkId],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(checkId)
        setProductCheckObject(response?.data)
        const list = response?.data?.stocktakeNoteDetails.map((item) => {
          return item.product
        })
        setListChosenProduct(response?.data?.stocktakeNoteDetails)
        setListProductCheck(response?.data?.stocktakeNoteDetails)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!checkId,
    },
  ])

  const updateStockTakeMutation = useMutation(
    async (exportProduct: any) => {
      return await updateStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("approve_check"))
          router.push("/inventory-checking-order-detail/" + checkId)
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data || t("error_occur"))
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

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    const submittedData = {
      stocktakeId: productCheckObject?.stocktakeId,
      stocktakeCode: productCheckObject?.stocktakeCode,
      note: productCheckObject?.note,
      stocktakeNoteDetails: productCheckObject?.stocktakeNoteDetails,
      state: 0,
    }
    if (!staffSelected) {
      submittedData["createdId"] = userData.userId
    }
    updateStockTakeMutation.mutate(submittedData)
  }
  const handleClickOutBtn = (event) => {
    router.back()
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div>
        <div className="flex flex-col justify-between w-full gap-4 md:items-center md:flex-row">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{t("edit_check")}</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <SecondaryBtn onClick={handleClickOutBtn}>{t("exit")}</SecondaryBtn>
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[180px]"
              title={t("save_report")}
              handleClickSaveBtn={handleClickSaveBtn}
              disabled={listChosenProduct?.length === 0 || submitted}
            >
              {t("save")}
            </ConfirmPopup>
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-3 mb-4">
            <GeneralIcon />
            <h1 className="text-xl font-semibold">{t("report_infor")}</h1>
          </div>
          <div className="mb-3 text-sm font-medium text-left text-gray">
            {t("check_date")}: {format(Date.now(), "dd/MM/yyyy HH:MM")}
          </div>
          <p className="mb-3 text-sm font-medium text-left text-gray">
            {t("staff")}
          </p>
          <div className="w-64">
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={productCheckObject?.createdBy?.userName}
              showing={staffSelected}
              setShowing={setStaffSelected}
              isLoadingStaff={isLoadingStaff}
            />
          </div>

          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note")}
            value={productCheckObject?.note}
            onChange={(e) => {
              setProductCheckObject({
                ...productCheckObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <CheckGoodIcon />
          <h1 className="text-xl font-semibold">{t("check_good_infor")}</h1>
        </div>
        <SearchProductImportDropdown
          placeholder={t("search.searchInGoods")}
          listDropdown={listProduct?.data}
          textDefault={t("supplier")}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
      </div>
    </div>
  )
}

export default EditCheckGood

function RenderCurrentStock({ data }) {
  const renderCurrentStock = () => {
    if (data?.currentStock) {
      return <div className="text-center">{data?.currentStock}</div>
    }
    if (data?.inStock) {
      return <div className="text-center">{data?.inStock}</div>
    }
    return <div className="text-center">0</div>
  }
  return <div>{renderCurrentStock()}</div>
}

function ListActualStock({ data, listProductCheck, setListProductCheck }) {
  const [actualStock, setActualStock] = useState()
  useEffect(() => {
    if (data && data?.product) {
      setActualStock(data?.actualStock)
    } else if (data && data?.productName) {
      setActualStock(data?.inStock)
    }
  }, [data])

  useEffect(() => {
    if (actualStock && data?.product) {
      const list = listProductCheck
      const newList = list.map((item) => {
        if (item.productId === data.productId) {
          return {
            ...item,
            actualStock: actualStock,
            currentStock: data?.currentStock,
          }
        }
        return item
      })
      setListProductCheck(newList)
    } else if (actualStock && data?.productName) {
      const list = listProductCheck
      const newList = list.map((item) => {
        if (item.productId === data.productId) {
          return {
            ...item,
            actualStock: actualStock,
            currentStock: data?.inStock,
          }
        }
        return item
      })
      setListProductCheck(newList)
    }
  }, [actualStock])

  return (
    <PrimaryInput
      className="w-[70px]"
      type="number"
      min="0"
      placeholder="--"
      value={
        BigNumber(actualStock).isGreaterThanOrEqualTo(0) ? actualStock : ""
      }
      onChange={(e) => {
        e.stopPropagation()
        const value = e.target.value < 0 ? 0 : e.target.value
        setActualStock(value)
      }}
    />
  )
}

function CountDeviated({ data, listProductCheck }) {
  const [deviated, setDeviated] = useState<any>(0)

  const handleCountDeviated = () => {
    const list = listProductCheck

    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const deviatedAmount = item.actualStock - item.currentStock

        setDeviated(deviatedAmount)
        return { ...item, amountDifferential: deviatedAmount }
      }
      return item
    })
  }

  useEffect(() => {
    handleCountDeviated()
  }, [listProductCheck])

  return (
    <div className="px-4 py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
      {deviated ? deviated : 0}
    </div>
  )
}

function ListNote({ data, listProductCheck, setListProductCheck }) {
  const [note, setNote] = useState<any>({ id: 0, value: data?.note })

  useEffect(() => {
    if (note?.value) {
      const list = listProductCheck
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, note: note?.value }
        }
        return item
      })
      setListProductCheck(newList)
    }
  }, [note?.value])

  return <ReasonDropdown showing={note} setShowing={setNote} />
}
