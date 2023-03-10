import React from "react"
import Layout from "../../components/Layout"
import EditStaff from "../../components/ManageStaff/DetailStaff"

function staffId(props) {
  return (
    <Layout headTitle="Chỉnh sửa nhân viên">
      <EditStaff />
    </Layout>
  )
}

export default staffId
