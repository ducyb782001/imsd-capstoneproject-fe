import React from "react"
import Layout from "../components/Nav/Layout"
import ManageImportGoods from "../components/ManageImportOrders/ManageImportOrders"

function manageImportGoods() {
  return (
    <Layout headTitle="Danh sách phiếu nhập hàng">
      <ManageImportGoods />
    </Layout>
  )
}

export default manageImportGoods
