import React, { useState } from "react"
import { useQueries } from "react-query"
import { getDetailImportProduct } from "../../apis/import-product-module"
import { useRouter } from "next/router"
import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
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
      {/* State 0 is new, can edit */}
      {productImport?.state === 0 && (
        <ZeroImportReportStatus
          isLoadingReport={isLoadingReport}
          productImport={productImport}
        />
      )}
      {/* State 1 is approved, ready to import */}
      {productImport?.state === 1 && (
        <FirstImportReportStatus productImport={productImport} />
      )}
      {/* state 2 is improved succeed */}
      {productImport?.state === 2 && (
        <SecondImportReportStatus productImport={productImport} />
      )}
      {/* state 3 is cancel improve */}
      {productImport?.state === 3 && (
        <ThirdImportReportStatus productImport={productImport} />
      )}
    </div>
  )
}

export default ImportReportDetail
