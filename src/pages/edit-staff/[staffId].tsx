import React from "react"
import Layout from "../../components/Layout"
import DetailStaff from "../../components/ManageStaff/DetailStaff"

function staffId(props) {
  return (
    <Layout headTitle="Chỉnh sửa nhân viên">
      <DetailStaff />
    </Layout>
  )
}

export default staffId
