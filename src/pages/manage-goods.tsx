import React from "react"
import Layout from "../components/Layout"
import ManageGoods from "../components/ManageGoods/ManageGoods"

function manageGoods(props) {
  return (
    <Layout headTitle="Danh sách sản phẩm">
      <ManageGoods />
    </Layout>
  )
}

export default manageGoods
