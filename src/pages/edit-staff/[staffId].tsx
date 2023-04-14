import React from "react"
import Layout from "../../components/Nav/Layout"
import DetailStaff from "../../components/ManageStaff/DetailStaff"
import { useTranslation } from "react-i18next"

function staffId() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("edit_staff_title")}>
      <DetailStaff />
    </Layout>
  )
}

export default staffId
