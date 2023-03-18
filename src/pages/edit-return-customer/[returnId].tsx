import React from "react"
import { useTranslation } from "react-i18next"
import Layout from "../../components/Layout"
import ReturnCustomerEdit from "../../components/ReturnGood/ReturnCustomerEdit"

function returnId(props) {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_customer_edit")}>
      <ReturnCustomerEdit />
    </Layout>
  )
}

export default returnId
