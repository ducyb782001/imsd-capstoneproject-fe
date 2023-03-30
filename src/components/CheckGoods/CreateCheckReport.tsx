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
import { createStockTakeProduct } from "../../apis/stocktake-product-module"
import ReasonDropdown from "./ReasonDropdown"
import { useTranslation } from "react-i18next"
import CheckGoodIcon from "../icons/CheckGoodIcon"
import BigNumber from "bignumber.js"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateCheckReport() {
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
            <p className="truncate-2-line max-w-[100px]">{data?.productCode}</p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
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
            <div className="flex items-center max-w-[100px]">
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
            <div className="w-[70px]">
              <CountDeviated data={data} listProductCheck={listProductCheck} />
            </div>
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
  const [listProductSearch, setListProductSearch] = useState<any>([])
  const [productCheckObject, setProductCheckObject] = useState<any>()
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)

  const [submitted, setSubmitted] = useState(false)

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
    if (listChosenProduct?.length > 0) {
      const list = listChosenProduct.map((item) => {
        const currentStock = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.inStock
        const measuredUnitId = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.measuredUnitId
        const note = listProductCheck.find(
          (i) => i.productId == item.productId,
        )?.note

        return {
          stocktakeId: 0,
          productId: item.productId,
          measuredUnitId: measuredUnitId,
          currentStock: currentStock,
          actualStock: 0,
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

    for (let index = 0; index < listProductCheck.length; index++) {
      const product = listProductCheck[index]
      if (product.actualStock === "" || product.actualStock === "undefined") {
        setSubmitted(true)
        return
      }
    }
    setSubmitted(false)
  }, [listProductCheck])

  const router = useRouter()
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
        const response = await getListExportProduct({
          offset: 0,
          limit: 1000,
          status: true,
        })
        setListProductSearch(response?.data)
        return response?.data
      },
    },
  ])

  const createStockTakeMutation = useMutation(
    async (exportProduct) => {
      return await createStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("add_check_success"))
          router.push("/manage-check-good")
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
    const submittedData = {
      ...productCheckObject,
      stocktakeId: 0,
      stocktakeCode: "string",
    }

    if (!staffSelected) {
      submittedData["createdId"] = userData.userId
    }

    createStockTakeMutation.mutate(submittedData)
  }
  const handleClickOutBtn = () => {
    router.push("/manage-check-good")
  }

  return (
    <div>
      <div>
        <div className="flex flex-col justify-between w-full gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              {t("create_check_title")}
            </h1>
          </div>
          {/* <div className="flex items-center justify-between gap-4">
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[190px]"
              title={t("confirm_import")}
              handleClickSaveBtn={handleClickSaveBtn}
              disabled={submitted}
            >
              {t("create_check_title")}
            </ConfirmPopup>
            <SecondaryBtn className="" onClick={handleClickOutBtn}>
              {t("exit")}
            </SecondaryBtn>
          </div> */}
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">{t("report_infor")}</h1>
          </div>
          <div className="mb-3 text-sm font-medium text-left text-gray">
            {t("check_date")}: {format(Date.now(), "dd/MM/yyyy HH:MM")}
          </div>
          <div className="w-64">
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={userData?.userName || t("choose_staff")}
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
      <div className="mt-4 mb-10 bg-white block-border">
        <div className="flex items-center gap-3 mb-4">
          <CheckGoodIcon />
          <h1 className="text-xl font-semibold">{t("check_good_infor")}</h1>
        </div>
        <SearchProductImportDropdown
          listDropdown={listProductSearch?.data}
          placeholder={t("search.searchInGoods")}
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
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-10"
          title={t("confirm_import")}
          handleClickSaveBtn={handleClickSaveBtn}
          disabled={submitted || listChosenProduct?.length === 0}
        >
          {t("create_check_title")}
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateCheckReport

function RenderCurrentStock({ data }) {
  return <div className="text-center">{data?.inStock ? data?.inStock : 0}</div>
}

function ListActualStock({ data, listProductCheck, setListProductCheck }) {
  const [actualStock, setActualStock] = useState(data?.actualStock)
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductCheck
    const newList = list.map((item) => {
      if (item.productId === data.productId) {
        return { ...item, actualStock: value, currentStock: data?.inStock }
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
  const [deviated, setDeviated] = useState<any>(0)

  useEffect(() => {
    if (listProductCheck) {
      handleSetPrice()
    }
  }, [listProductCheck])

  const handleSetPrice = () => {
    const list = listProductCheck
    let inStockData = 0
    const product = listProductCheck.filter(
      (i) => i.productId === data?.productId,
    )

    if (!product[0]?.measuredUnitId) {
      inStockData = data?.inStock
    } else {
      const currentStockUnit = data?.measuredUnits?.filter(
        (i) => i.measuredUnitId === product[0].measuredUnitId,
      )
      inStockData = currentStockUnit[0].inStock
    }

    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const deviatedAmount = item.actualStock - inStockData
        setDeviated(deviatedAmount)
        return { ...item, amountDifferential: deviatedAmount }
      }
      return item
    })
  }

  return (
    <div className="px-2 py-2 text-center text-white rounded-md bg-successBtn">
      {deviated}
    </div>
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
