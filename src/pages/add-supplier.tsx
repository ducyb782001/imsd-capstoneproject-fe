import React from "react"
import Layout from "../components/Nav/Layout"
import AddSupplier from "../components/ManageGoods/ManageSuppliers/AddSupplier"
import { useTranslation } from "react-i18next"

function addSupplier() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("add_new_supplier")}>
      <AddSupplier />
    </Layout>
  )
}

export default addSupplier
