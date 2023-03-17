import React from "react"
import ManageReturnCustomer from "../components/ReturnGood/ManageReturnCustomer"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"

function managReturnGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_customer_title")}>
      <ManageReturnCustomer />
    </Layout>
  )
}

export default managReturnGoods
