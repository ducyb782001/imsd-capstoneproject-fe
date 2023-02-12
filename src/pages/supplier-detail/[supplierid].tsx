import React from "react"
import Layout from "../../components/Layout"
import SupplierDetail from "../../components/ManageSuppliers/SupplierDetail"

function detailSupplier(props) {
  return (
    <Layout headTitle="Chi tiết nhà cung cấp">
      <SupplierDetail />
    </Layout>
  )
}

export default detailSupplier
