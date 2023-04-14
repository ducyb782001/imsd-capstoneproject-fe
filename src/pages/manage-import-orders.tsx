import React from "react"
import Layout from "../components/Nav/Layout"
import ManageImportGoods from "../components/ManageImportOrders/ManageImportOrders"
import { useTranslation } from "react-i18next"

function manageImportGoods() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("list_manage_import")}>
      <ManageImportGoods />
    </Layout>
  )
}

export default manageImportGoods
