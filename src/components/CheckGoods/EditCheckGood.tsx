import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { getListExportProduct } from "../../apis/product-module"
import { getListStaff } from "../../apis/user-module"
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
            <ListUnitImport
              data={data?.product}
              listProductCheck={listProductCheck}
              setListProductCheck={setListProductCheck}
            />
          ),
        },
        {
          Header: t("current_stock"),
          accessor: (data: any) => (
            <div className="flex items-center max-w-[80px]">
              <PrimaryInput
                value={data?.currentStock || data?.inStock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: t("actual_stock"),
          accessor: (data: any) => (
            <div className="flex items-center max-w-[80px]">
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
              className="cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i, ind) => ind !== index,
                )
                setListChosenProduct(result)
              }}
            >
              <XIcons />
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

  useEffect(() => {
    if (staffSelected) {
      setProductCheckObject({
        ...productCheckObject,
        userId: staffSelected?.userId,
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
    if (listChosenProduct?.length > 0) {
      const list = listChosenProduct.map((item) => {
        const currentStock = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.currentStock
        const measuredUnitId = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.measuredUnitId
        const stocktakeId = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.actualStock
        const note = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.note
        const actualStock = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.actualStock

        return {
          stocktakeId: stocktakeId,
          productId: item.productId,
          measuredUnitId: measuredUnitId,
          currentStock: currentStock,
          actualStock: actualStock,
          note: note,
        }
      })
      setListProductCheck(list)
    }
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

  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        setIsLoadingStaff(true)
        const staff = await getListStaff()
        setListStaff(staff?.data?.data)
        setIsLoadingStaff(false)

        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct()
        setListProduct(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getDetailStockTake"],
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
    async (exportProduct) => {
      return await updateStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("approve_check"))
          router.push("/draff-check-good/" + checkId)
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
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
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    updateStockTakeMutation.mutate(productCheckObject)
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{t("edit_check")}</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[180px]"
              title={t("save_report")}
              handleClickSaveBtn={handleClickSaveBtn}
            >
              {t("save")}
            </ConfirmPopup>
            <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
              {t("exit")}
            </SecondaryBtn>
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">{t("report_infor")}</h1>
          </div>
          <div className="mb-3 text-sm font-medium text-left text-gray">
            <p className="mb-3">{t("check_date")}: </p>
            <PrimaryInput
              value={format(Date.now(), "dd/MM/yyyy HH:mm")}
              className="w-[150px] text-sm font-normal text-gray"
              readOnly={true}
            />
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
        <h1 className="mb-4 text-xl font-semibold">{t("check_good_infor")}</h1>
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

function ListActualStock({ data, listProductCheck, setListProductCheck }) {
  const [actualStock, setActualStock] = useState(data?.actualStock)
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductCheck
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, actualStock: value }
      }
      return item
    })
    setListProductCheck(newList)
  }

  return (
    <PrimaryInput
      className="w-[70px]"
      type="number"
      placeholder="--"
      value={actualStock ? actualStock : ""}
      onChange={(e) => {
        e.stopPropagation()
        setActualStock(e.target.value)
        handleOnChangeDiscount(e.target.value, data)
      }}
    />
  )
}

function CountDeviated({ data, listProductCheck }) {
  const [deviated, setDeviated] = useState<any>()
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
    <div className="h-12 py-2 text-center text-white rounded-md cursor-pointer bg-successBtn">
      {deviated}
    </div>
  )
}

function ListUnitImport({ data, listProductCheck, setListProductCheck }) {
  const [listDropdown, setListDropdown] = useState([])
  const [unitChosen, setUnitChosen] = useState<any>()
  const [defaultMeasuredUnit, setDefaultMeasuredUnit] = useState("")

  useEffect(() => {
    if (data) {
      const list = listProductCheck
      setListDropdown([
        {
          measuredUnitId: 0,
          measuredUnitName: data?.defaultMeasuredUnit,
        },
        ...data?.measuredUnits,
      ])
      const test = list.filter((i) => i?.productId === data?.productId)
      if (test[0].measuredUnitId) {
        setDefaultMeasuredUnit(test[0]?.measuredUnit?.measuredUnitName)
      } else {
        setDefaultMeasuredUnit(test[0]?.defaultMeasuredUnit)
      }
    }
  }, [data])

  useEffect(() => {
    if (unitChosen) {
      const list = listProductCheck
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, measuredUnitId: unitChosen?.measuredUnitId }
        }
        return item
      })
      setListProductCheck(newList)
    }
  }, [unitChosen])

  return (
    <ChooseUnitImport
      listDropdown={listDropdown}
      showing={unitChosen}
      setShowing={setUnitChosen}
      textDefault={defaultMeasuredUnit}
    />
  )
}
function ListNote({ data, listProductCheck, setListProductCheck }) {
  const [note, setNote] = useState<any>()

  useEffect(() => {
    if (note) {
      const list = listProductCheck
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, note: note?.value }
        }
        return item
      })
      setListProductCheck(newList)
    }
  }, [note])

  return <ReasonDropdown showing={note} setShowing={setNote} />
}
