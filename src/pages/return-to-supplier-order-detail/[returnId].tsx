import React from "react"
import Layout from "../../components/Nav/Layout"
import { useTranslation } from "react-i18next"
import ReturnImportDetail from "../../components/ReturnGood/ReturnImportDetail"

function returnImportDetail() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_detail")}>
      <ReturnImportDetail />
    </Layout>
  )
}

export default returnImportDetail
