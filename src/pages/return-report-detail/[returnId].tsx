import React from "react"
import Layout from "../../components/Layout"
import DetailReturnReport from "../../components/ReturnGood/ReturnGoodDetail"
import { useTranslation } from "react-i18next"

function returnGoodDetail() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_detail")}>
      <DetailReturnReport />
    </Layout>
  )
}

export default returnGoodDetail
