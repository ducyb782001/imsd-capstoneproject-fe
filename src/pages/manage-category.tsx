import React from "react"
import Layout from "../components/Nav/Layout"
import ManageTypeGoods from "../components/ManageGoods/ManageTypeGoods/ManageTypeGoods"
import { useTranslation } from "react-i18next"

function manageTypeGoods(props) {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("list_category")}>
      <ManageTypeGoods />
    </Layout>
  )
}

export default manageTypeGoods
