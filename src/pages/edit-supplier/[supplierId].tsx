import React from "react"
import Layout from "../../components/Layout"
import EditSupplier from "../../components/ManageSuppliers/EditSupplier"

function editSupplier(props) {
  return (
    <Layout headTitle="Chỉnh sửa nhà cung cấp">
      <EditSupplier />
    </Layout>
  )
}

export default editSupplier
