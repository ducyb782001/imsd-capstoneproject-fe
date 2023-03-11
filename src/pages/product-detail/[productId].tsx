import React from "react"
import Layout from "../../components/Layout"
import ProductDetail from "../../components/ManageGoods/ProductDetail"
import { useTranslation } from "react-i18next"

function detailProduct() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("product_detail")}>
      <ProductDetail />
    </Layout>
  )
}

export default detailProduct
