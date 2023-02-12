import React from "react"
import Layout from "../components/Layout"
import AddSupplier from "../components/ManageSuppliers/AddSupplier"

function addSupplier(props) {
  return (
    <Layout headTitle="Thêm mới nhà cung cấp">
      <AddSupplier />
    </Layout>
  )
}

export default addSupplier
