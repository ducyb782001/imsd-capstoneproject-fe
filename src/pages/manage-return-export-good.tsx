import React from "react"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"
import ManageReturnExportGoods from "../components/ReturnGood/ManageReturnExportGoods"

function managReturnGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_customer_title")}>
      <ManageReturnExportGoods />
    </Layout>
  )
}

export default managReturnGoods
