import React from "react"
import Layout from "../components/Layout"
import ManageSuppliers from "../components/ManageGoods/ManageSuppliers/ManageSuppliers"
import { useTranslation } from "react-i18next"

function manageSuppliers() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("list_supplier")}>
      <ManageSuppliers />
    </Layout>
  )
}

export default manageSuppliers
