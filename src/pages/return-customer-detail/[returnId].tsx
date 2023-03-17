import React from "react"
import { useTranslation } from "react-i18next"
import Layout from "../../components/Layout"
import DetailReturnCustomer from "../../components/ReturnGood/ReturnCustomerDetail"

function returnCustomerDetail() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_customer_detail")}>
      <DetailReturnCustomer />
    </Layout>
  )
}

export default returnCustomerDetail
