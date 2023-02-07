import React from "react"
import Layout from "../components/Layout"
import AddProduct from "../components/ManageGoods/AddProduct"

function addProduct(props) {
  return (
    <Layout headTitle="Thêm mới sản phẩm">
      <AddProduct />
    </Layout>
  )
}

export default addProduct
