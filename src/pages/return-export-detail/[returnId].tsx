import React from "react"
import { useTranslation } from "react-i18next"
import Layout from "../../components/Layout"
import ReturnExportDetail from "../../components/ReturnGood/ReturnExportDetail"

function returnExportDetail() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_customer_detail")}>
      <ReturnExportDetail />
    </Layout>
  )
}

export default returnExportDetail
