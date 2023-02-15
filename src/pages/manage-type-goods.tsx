import React from "react"
import Layout from "../components/Layout"
import ManageTypeGoods from "../components/ManageTypeGoods/ManageTypeGoods"

function manageTypeGoods(props) {
  return (
    <Layout headTitle="Danh sách loại sản phẩm">
      <ManageTypeGoods />
    </Layout>
  )
}

export default manageTypeGoods
