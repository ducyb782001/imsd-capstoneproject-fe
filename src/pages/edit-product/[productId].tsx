import React from "react"
import Layout from "../../components/Nav/Layout"
import EditProduct from "../../components/ManageGoods/EditProduct"
import { useTranslation } from "react-i18next"

function editProduct() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("edit_product")}>
      <EditProduct />
    </Layout>
  )
}

export default editProduct
