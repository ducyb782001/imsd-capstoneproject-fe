import React from "react"
import ManageReturnGood from "../components/ReturnGood/ManageReturnGood"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"

function managReturnGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_supplier_title")}>
      <ManageReturnGood />
    </Layout>
  )
}

export default managReturnGoods
