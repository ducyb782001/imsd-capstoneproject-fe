import React, { useState } from "react"
import { useQueries } from "react-query"

import ImportReportSkeleton from "../Skeleton/ImportReportSkeleton"
import { getDetailExportProduct } from "../../apis/export-product-module"
import { useRouter } from "next/router"
import ZeroExportReportStatus from "./ZeroExportReportStatus"
import FirstExportReportStatus from "./FirstExportReportStatus"
import SecondExportReportStatus from "./SecondExportReportStatus"
import ThirdExportReportStatus from "./ThirdExportReportStatus"
function ExportOrderDetail() {
  const [productExport, setProductExport] = useState<any>()
  const router = useRouter()
  const [isLoadingReport, setIsLoadingReport] = useState(true)

  const { exportId } = router.query

  useQueries([
    {
      queryKey: ["getDetailProductExport", exportId],
      queryFn: async () => {
        const response = await getDetailExportProduct(exportId)
        setProductExport(response?.data)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!exportId,
    },
  ])

  return isLoadingReport ? (
    <ImportReportSkeleton />
  ) : (
    <div>
      {/* State 0 is new, can edit */}
      {productExport?.state === 0 && (
        <ZeroExportReportStatus productImportObject={productExport} />
      )}
      {/* State 1 is approved, ready to Export */}
      {productExport?.state === 1 && (
        <FirstExportReportStatus productImport={productExport} />
      )}
      {/* state 2 is improved succeed */}
      {productExport?.state === 2 && (
        <SecondExportReportStatus productImport={productExport} />
      )}
      {/* state 3 is cancel improve */}
      {productExport?.state === 3 && (
        <ThirdExportReportStatus productExport={productExport} />
      )}
    </div>
  )
}

export default ExportOrderDetail
