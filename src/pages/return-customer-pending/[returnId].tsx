import React from "react"
import Layout from "../../components/Layout"
import ReturnCustomerPending from "../../components/ReturnGood/ReturnCustomerPending"
import { useTranslation } from "react-i18next"

function returnCustomerPending() {
  const { t } = useTranslation()

  return (
    <Layout>
      <ReturnCustomerPending />
    </Layout>
  )
}

export default returnCustomerPending
