import React from "react"
import Layout from "../../components/Layout"
import InventoryCheckingOrderDetail from "../../components/ManageInventoryChecking/InventoryCheckingOrderDetail"

function checkGoodDetail(props) {
  return (
    <Layout headTitle="Chi tiết đơn kiểm hàng">
      <InventoryCheckingOrderDetail />
    </Layout>
  )
}

export default checkGoodDetail
