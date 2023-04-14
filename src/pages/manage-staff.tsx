import React from "react"
import ManageStaff from "../components/ManageStaff/ManageStaff"
import Layout from "../components/Nav/Layout"
import { useTranslation } from "react-i18next"

function manageStaff() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("list_staff")}>
      <ManageStaff />
    </Layout>
  )
}

export default manageStaff
