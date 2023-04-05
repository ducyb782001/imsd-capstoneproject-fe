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
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import ZeroCheckingReportStatus from "./ZeroCheckingReportStatus"
import FirstCheckingReportStatus from "./FirstCheckingReportStatus"

function InventoryCheckingOrderDetail() {
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

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      {/* State 0 is new, can edit */}
      {productCheckObject?.state === 0 && (
        <ZeroCheckingReportStatus productCheckObject={productCheckObject} />
      )}
      {/* State 1 is approved succeed */}
      {(productCheckObject?.state === 1 || productCheckObject?.state === 2) && (
        <FirstCheckingReportStatus productCheckObject={productCheckObject} />
      )}
    </div>
  )
}

export default InventoryCheckingOrderDetail
