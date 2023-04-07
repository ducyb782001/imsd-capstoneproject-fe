import React from "react"
import Layout from "../components/Nav/Layout"
import AddProduct from "../components/ManageGoods/AddProduct"
import { useTranslation } from "react-i18next"

function addProduct() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("add_new_product")}>
      <AddProduct />
    </Layout>
  )
}

export default addProduct
