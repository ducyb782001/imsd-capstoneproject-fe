import React from "react"
import Layout from "../../components/Nav/Layout"
import InventoryCheckingOrderDetail from "../../components/ManageInventoryChecking/InventoryCheckingOrderDetail"
import { useTranslation } from "react-i18next"

function checkGoodDetail() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("detail_inventory_checking")}>
      <InventoryCheckingOrderDetail />
    </Layout>
  )
}

export default checkGoodDetail
