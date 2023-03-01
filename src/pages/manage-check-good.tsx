import React from "react"
import ManageCheckGoods from "../components/CheckGoods/ManageCheckGoods"
import Layout from "../components/Layout"

function manageCheckGood() {
  return (
    <Layout headTitle="Danh sách đơn kiểm hàng">
      <ManageCheckGoods />
    </Layout>
  )
}

export default manageCheckGood
