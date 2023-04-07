import React from "react"
import Layout from "../components/Nav/Layout"
import CreateReturnExportGood from "../components/ReturnGood/CreateReturnExportGood"

function createReturnReport() {
  return (
    // <Layout headTitle="Trả hàng về nhà cung cấp">
    //   <CreateReturnExportGood />
    // </Layout>
    <Layout headTitle="Trả hàng về kho">
      <CreateReturnExportGood />
    </Layout>
  )
}

export default createReturnReport
