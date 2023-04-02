import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"

import {
  approveStockTakeProduct,
  denyStockTakeProduct,
  getDetailStockTakeProduct,
} from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"
import { useTranslation } from "react-i18next"
import GeneralIcon from "../icons/GeneralIcon"
import CheckGoodIcon from "../icons/CheckGoodIcon"
import BigNumber from "bignumber.js"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function DraffCheckGood() {
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
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productCode}
            </p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {data?.product?.productName}
            </p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <div>
              {data?.measuredUnitId
                ? data?.measuredUnit?.measuredUnitName
                : data?.defaultMeasuredUnit}
            </div>
          ),
        },
        {
          Header: t("current_stock"),
          accessor: (data: any) => (
            <div className="text-center">
              {data?.currentStock ? data?.currentStock : "0"}
            </div>
          ),
        },
        {
          Header: t("actual_stock"),
          accessor: (data: any) => (
            <div className="text-center">
              {data?.actualStock ? data?.actualStock : "---"}
            </div>
          ),
        },
        {
          Header: t("deviated"),
          accessor: (data: any) => (
            <div className="text-center">
              {new BigNumber(data?.currentStock || 0).isGreaterThan(
                data?.actualStock || 0,
              )
                ? "-"
                : "+"}
              {data?.amountDifferential ? data?.amountDifferential : "---"}
            </div>
          ),
        },
        {
          Header: t("reason"),
          accessor: (data: any) => <div>{data?.note ? data?.note : "---"}</div>,
        },
      ],
    },
  ]

  const [userData, setUserData] = useState<any>()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

  const [productCheckObject, setProductCheckObject] = useState<any>()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const router = useRouter()
  const { checkId } = router.query

  useQueries([
    {
      queryKey: ["getDetailCheckGood"],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(checkId)
        setProductCheckObject(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!checkId,
    },
  ])

  const approveExportMutation = useMutation(
    async (exportProduct) => {
      return await approveStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("approve_check"))
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

  const denyExportMutation = useMutation(
    async (exportProduct) => {
      return await denyStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success(t("deny_check"))
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

  const handleClickApproveBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    approveExportMutation.mutate(productCheckObject?.stocktakeId)
  }

  const handleClickCancelBtn = (event) => {
    event?.preventDefault()
    toast.loading(t("operation_process"), {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    denyExportMutation.mutate(productCheckObject?.stocktakeId)
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div>
        <div className="flex flex-col justify-between w-full gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{t("edit_check")}</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[100px] !bg-transparent text-dangerous !border-dangerous hover:!bg-[#E9283730]"
              title={t("deny_alert")}
              handleClickSaveBtn={handleClickCancelBtn}
            >
              Hủy đơn
            </ConfirmPopup>
            <SecondaryBtn
              className="w-[100px]"
              onClick={() => {
                router.push(
                  "/edit-check-good/" + productCheckObject?.stocktakeId,
                )
              }}
            >
              {t("edit_import")}
            </SecondaryBtn>
            {(userData?.roleId === 1 || userData?.roleId === 2) && (
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("approve_alert")}
                handleClickSaveBtn={handleClickApproveBtn}
              >
                {t("approve")}
              </ConfirmPopup>
            )}
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <GeneralIcon />
            <h1 className="text-xl font-semibold">{t("report_infor")}</h1>
          </div>
          <div className="mb-2 text-sm font-bold text-gray">
            {t("check_date")}: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <div className="w-64">
            <div className="mb-2 text-sm font-bold text-gray">{t("staff")}</div>
            <div
              className="px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
              aria-readonly
            >
              {productCheckObject?.createdBy?.userName}
            </div>
          </div>

          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title={t("note_report")}
            value={productCheckObject?.note}
            readOnly={true}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <div className="flex items-center gap-3">
          <CheckGoodIcon />
          <h1 className="text-xl font-semibold">{t("check_good_infor")}</h1>
        </div>
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={productCheckObject?.stocktakeNoteDetails}
          />
        </div>
      </div>
    </div>
  )
}

export default DraffCheckGood
