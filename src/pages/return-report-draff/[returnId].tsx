import React from "react"
import Layout from "../../components/Layout"
import DraffReturnReport from "../../components/ReturnGood/ReturnGoodDraff"
import { useTranslation } from "react-i18next"

function returnGoodDetail() {
  const { t } = useTranslation()

  return (
    <Layout>
      <DraffReturnReport />
    </Layout>
  )
}

export default returnGoodDetail
