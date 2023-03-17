import React from "react"
import Layout from "../../components/Layout"
import ReturnGoodPending from "../../components/ReturnGood/ReturnGoodPending"
import { useTranslation } from "react-i18next"

function returnGoodPending() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_detail")}>
      <ReturnGoodPending />
    </Layout>
  )
}

export default returnGoodPending
