import React from "react"
import Layout from "../components/Nav/Layout"
import { useTranslation } from "react-i18next"
import ManageReturnProductToSupplier from "../components/ReturnGood/ManageReturnProductToSupplier"

function managReturnGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_supplier_title")}>
      <ManageReturnProductToSupplier />
    </Layout>
  )
}

export default managReturnGoods
