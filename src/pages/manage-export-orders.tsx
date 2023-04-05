import React from "react"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"
import ManageExportOrders from "../components/ManageExportOrders/ManageExportOrders"

function manageExportGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("export_manage_title")}>
      <ManageExportOrders />
    </Layout>
  )
}

export default manageExportGoods
