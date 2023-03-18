import React from "react"
import { useTranslation } from "react-i18next"
import Layout from "../../components/Layout"
import EditReturnReport from "../../components/ReturnGood/ReturnGoodEdit"

function returnId(props) {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("return_report_edit")}>
      <EditReturnReport />
    </Layout>
  )
}

export default returnId
