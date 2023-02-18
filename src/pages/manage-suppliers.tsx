import React from "react"
import Layout from "../components/Layout"
import ManageSuppliers from "../components/ManageGoods/ManageSuppliers/ManageSuppliers"

function manageSuppliers(props) {
  return (
    <Layout headTitle="Danh sách nhà cung cấp">
      <ManageSuppliers />
    </Layout>
  )
}

export default manageSuppliers
