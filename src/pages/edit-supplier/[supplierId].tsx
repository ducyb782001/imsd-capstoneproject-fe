import React from "react"
import Layout from "../../components/Layout"
import EditSupplier from "../../components/ManageGoods/ManageSuppliers/EditSupplier"
import { useTranslation } from "react-i18next"

function editSupplier() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("edit_supplier")}>
      <EditSupplier />
    </Layout>
  )
}

export default editSupplier
