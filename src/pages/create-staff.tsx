import React from "react"
import Layout from "../components/Nav/Layout"
import CreateStaff from "../components/ManageStaff/CreateStaff"

function createStaff() {
  return (
    <Layout headTitle="Tạo nhân viên mới">
      <CreateStaff />
    </Layout>
  )
}

export default createStaff
