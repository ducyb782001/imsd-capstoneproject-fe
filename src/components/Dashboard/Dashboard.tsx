import BigNumber from "bignumber.js"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useQueries, useQuery } from "react-query"
import {
  getDashboardByTime,
  getDashboardChartData,
  getDashBoardData,
} from "../../apis/dashboard-module"
import Page401 from "../401"
import ExportDashboardIcon from "../icons/ExportDashboardIcon"
import ExportReturnDashboardIcon from "../icons/ExportReturnDashboardIcon"
import GainDashboardIcon from "../icons/GainDashboardIcon"
import ImportDashboardIcon from "../icons/ImportDashboardIcon"
import ImportReturnDashboardIcon from "../icons/ImportReturnDashboardIcon"
import ProductDashboardIcon from "../icons/ProductDashboardIcon"
import SpentDashboardIcon from "../icons/SpentDashboardIcon"
import UserDasboardIcon from "../icons/UserDasboardIcon"
import UserIcon from "../icons/UserIcon"
import InfoDashboardCard from "./InfoDashboardCard"
import InventoryChart from "./InventoryChart"
import SaleChart from "./SaleChart"
import SubMenu from "./SubMenu"
import SummaryRevenue from "./SummaryRevenue"
import { useTranslation } from "react-i18next"
import DashboardCardSkeleton from "../Skeleton/DashboardCardSkeleton"

function Dashboard() {
  const { t } = useTranslation()

  const listSubMenu = [
    { id: "sale", label: t("sale_revenue") },
    { id: "inventoryEachYear", label: t("inventory_by_year") },
  ]

  const [userData, setUserData] = useState<any>()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        const user = JSON.parse(userData)
        setUserData(user)
      }
    }
  }, [])

  const [activeTab, setActiveTab] = useState<string>("sale")

  const { data, isLoading } = useQuery({
    queryKey: ["getDashBoardData"],
    queryFn: async () => {
      const response = await getDashBoardData()
      return response?.data
    },
  })

  return !!!userData || userData?.roleId === 3 ? (
    <Page401 />
  ) : (
    <div>
      <SummaryRevenue />
      <SubMenu
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        listMenu={listSubMenu}
      />
      {activeTab === "sale" && <SaleChart />}
      {activeTab === "inventoryEachYear" && <InventoryChart />}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4">
        <InfoDashboardCard
          title={t("current_user")}
          value={data?.staff}
          icon={<UserDasboardIcon />}
        />
        <InfoDashboardCard
          title={t("number_in_stock")}
          value={data?.product}
          icon={<ProductDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("total_revenue")}
          value={data?.gain}
          token={true}
          icon={<GainDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("total_amount_spent")}
          value={data?.spent}
          token={true}
          icon={<SpentDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("total_import_orders")}
          value={data?.import}
          icon={<ImportDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("order_return_supplier")}
          value={data?.importReturn}
          icon={<ImportReturnDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("total_export_orders")}
          value={data?.export}
          icon={<ExportDashboardIcon />}
        />
        <InfoDashboardCard
          title={t("order_return_customer")}
          value={data?.exportReturn}
          icon={<ExportReturnDashboardIcon />}
        />
      </div>
    </div>
  )
}

export default Dashboard
