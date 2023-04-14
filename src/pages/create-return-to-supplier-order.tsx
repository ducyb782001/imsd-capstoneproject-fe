import React from "react"
import Layout from "../components/Nav/Layout"
import CreateReturnGood from "../components/ReturnGood/CreateReturnGood"
import { useTranslation } from "react-i18next"

function createReturnExportGood() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("return_to_supp")}>
      <CreateReturnGood />
    </Layout>
  )
}

export default createReturnExportGood
