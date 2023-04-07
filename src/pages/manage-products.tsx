import React from "react"
import Layout from "../components/Nav/Layout"
import ManageGoods from "../components/ManageGoods/ManageGoods"
import { useTranslation } from "react-i18next"

function manageGoods() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("list_good")}>
      <ManageGoods />
    </Layout>
  )
}

export default manageGoods
