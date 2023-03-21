import React from "react"
import ManageExportGoods from "../components/ExportGoods/ManageExportGood"
import Layout from "../components/Layout"
import { useTranslation } from "react-i18next"

function manageExportGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("export_manage_title")}>
      <ManageExportGoods />
    </Layout>
  )
}

export default manageExportGoods
