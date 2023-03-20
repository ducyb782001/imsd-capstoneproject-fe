import React from "react"
import { useTranslation } from "react-i18next"
import ManageCheckGoods from "../components/CheckGoods/ManageCheckGoods"
import Layout from "../components/Layout"

function manageCheckGood() {
  const { t } = useTranslation()

  return (
    <Layout headTitle={t("list_check")}>
      <ManageCheckGoods />
    </Layout>
  )
}

export default manageCheckGood
