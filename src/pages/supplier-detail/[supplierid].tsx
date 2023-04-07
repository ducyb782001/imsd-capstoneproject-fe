import React from "react"
import Layout from "../../components/Nav/Layout"
import SupplierDetail from "../../components/ManageGoods/ManageSuppliers/SupplierDetail"
import { useTranslation } from "react-i18next"

function detailSupplier() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("detail_supplier")}>
      <SupplierDetail />
    </Layout>
  )
}

export default detailSupplier
