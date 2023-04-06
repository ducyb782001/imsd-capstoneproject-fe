import React from "react"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"
import ManageReturnProducts from "../components/ReturnGood/ManageReturnProduct"

function managReturnGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_customer_title")}>
      <ManageReturnProducts />
    </Layout>
  )
}

export default managReturnGoods
