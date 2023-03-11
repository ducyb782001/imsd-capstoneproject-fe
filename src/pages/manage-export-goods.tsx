import React from "react"
import ManageExportGoods from "../components/ExportGoods/ManageExportGood"
import Layout from "../components/Layout"

function manageExportGoods(props) {
  return (
    <Layout headTitle="Danh sách đơn xuất hàng">
      <ManageExportGoods />
    </Layout>
  )
}

export default manageExportGoods
