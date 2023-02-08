import React from "react"
import Layout from "../../components/Layout"
import EditProduct from "../../components/ManageGoods/EditProduct"

function editProduct(props) {
  return (
    <Layout headTitle="Chỉnh sửa sản phẩm">
      <EditProduct />
    </Layout>
  )
}

export default editProduct
