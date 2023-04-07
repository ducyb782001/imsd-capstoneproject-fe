import React from "react"
import Dashboard from "../components/Dashboard/Dashboard"
import Layout from "../components/Nav/Layout"

function dashboard() {
  return (
    <Layout headTitle="Tổng quan">
      <Dashboard />
    </Layout>
  )
}

export default dashboard
