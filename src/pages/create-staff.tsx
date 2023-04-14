import React from "react"
import Layout from "../components/Nav/Layout"
import CreateStaff from "../components/ManageStaff/CreateStaff"
import { useTranslation } from "react-i18next"

function createStaff() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("create_new_staff_good")}>
      <CreateStaff />
    </Layout>
  )
}

export default createStaff
