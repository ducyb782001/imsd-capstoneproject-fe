import React from "react"
import ManageStaff from "../components/ManageStaff/ManageStaff"
import Layout from "../components/Layout"

function manageStaff(props) {
  return (
    <Layout headTitle="Danh sách nhân viên">
      <ManageStaff />
    </Layout>
  )
}

export default manageStaff
