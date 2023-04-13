import React from "react"
import Layout from "../components/Nav/Layout"
import CreateReturnGood from "../components/ReturnGood/CreateReturnGood"

function createReturnExportGood() {
  return (
    <Layout headTitle="Trả hàng về nhà cung cấp">
      <CreateReturnGood />
    </Layout>
  )
}

export default createReturnExportGood
