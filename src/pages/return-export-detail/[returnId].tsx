import React from "react"
import Layout from "../../components/Layout"
import { useTranslation } from "react-i18next"
import ReturnExportDetail from "../../components/ReturnGood/ReturnExportDetail"

function returnImportDetail() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_detail")}>
      <ReturnExportDetail />
    </Layout>
  )
}

export default returnImportDetail
