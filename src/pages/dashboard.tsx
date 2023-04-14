import React from "react"
import Dashboard from "../components/Dashboard/Dashboard"
import Layout from "../components/Nav/Layout"
import { useTranslation } from "react-i18next"

function dashboard() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("dashboard_tong")}>
      <Dashboard />
    </Layout>
  )
}

export default dashboard
