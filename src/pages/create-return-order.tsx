import React from "react"
import Layout from "../components/Nav/Layout"
import CreateReturnExportGood from "../components/ReturnGood/CreateReturnExportGood"
import { useTranslation } from "react-i18next"

function createReturnReport() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_to_ware")}>
      <CreateReturnExportGood />
    </Layout>
  )
}

export default createReturnReport
