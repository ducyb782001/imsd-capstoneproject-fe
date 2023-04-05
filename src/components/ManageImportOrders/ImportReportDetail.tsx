import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import {
  getDetailImportProduct,
  importImportProduct,
} from "../../apis/import-product-module"
import ConfirmPopup from "../ConfirmPopup"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import { useRouter } from "next/router"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { useTranslation } from "react-i18next"
import ImportGoodIcon from "../icons/ImportGoodIcon"
import ImportReportDraff from "./ZeroImportReportStatus"
import FirstImportReportStatus from "./FirstImportReportStatus"
import ZeroImportReportStatus from "./ZeroImportReportStatus"
import SecondImportReportStatus from "./SecondImportReportStatus"
import ThirdImportReportStatus from "./ThirdImportReportStatus"

function ImportReportDetail() {
  const [productImport, setProductImport] = useState<any>()
  const router = useRouter()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const { importId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductImport", importId],
      queryFn: async () => {
        setIsLoadingReport(true)
        const response = await getDetailImportProduct(importId)
        setProductImport(response?.data)
        setIsLoadingReport(false)
        return response?.data
      },
      enabled: !!importId,
    },
  ])

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      {productImport?.state === 0 && (
        <ZeroImportReportStatus
          isLoadingReport={isLoadingReport}
          productImport={productImport}
        />
      )}
      {productImport?.state === 1 && (
        <FirstImportReportStatus productImport={productImport} />
      )}
      {productImport?.state === 2 && (
        <SecondImportReportStatus productImport={productImport} />
      )}
      {productImport?.state === 3 && (
        <ThirdImportReportStatus productImport={productImport} />
      )}
    </div>
  )
}

export default ImportReportDetail
