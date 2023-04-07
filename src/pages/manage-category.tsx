import React from "react"
import Layout from "../components/Nav/Layout"
import ManageTypeGoods from "../components/ManageGoods/ManageTypeGoods/ManageTypeGoods"

function manageTypeGoods(props) {
  return (
    <Layout headTitle="Danh sách loại sản phẩm">
      <ManageTypeGoods />
    </Layout>
  )
}

export default manageTypeGoods
