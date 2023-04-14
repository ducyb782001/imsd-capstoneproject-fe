import React from "react"
import Layout from "../components/Nav/Layout"
import Profile from "../components/Profile/Profile"
import { useTranslation } from "react-i18next"

function profile() {
  const { t } = useTranslation()
  return (
    <Layout headTitle={t("edit_profile")}>
      <Profile />
    </Layout>
  )
}

export default profile
