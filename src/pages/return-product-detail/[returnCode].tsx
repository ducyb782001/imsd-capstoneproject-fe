import React from "react"
import { useTranslation } from "react-i18next"
import Layout from "../../components/Nav/Layout"
import ReturnProductDetail from "../../components/ManageGoods/ReturnProductDetail"

function returnProductDetail() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_detail")}>
      <ReturnProductDetail />
    </Layout>
  )
}

export default returnProductDetail
