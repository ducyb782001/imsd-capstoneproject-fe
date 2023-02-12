import React from "react"
import Layout from "../components/Layout"
import ManageGoods from "../components/ManageSuppliers/ManageSuppliers"

function manageSuppliers(props) {
  return (
    <Layout headTitle="Danh sách nhà cung cấp">
      <ManageGoods />
    </Layout>
  )
}

export default manageSuppliers
