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

const listSubMenu = [
  { id: "sale", label: "Doanh thu bán hàng" },
  { id: "inventoryEachYear", label: "Tồn kho theo năm" },
]

function Dashboard() {
  const router = useRouter()
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

  // useEffect(() => {
  //   if (userData && userData?.roleId !== 1) {
  //     router.push("/manage-goods")
  //   }
  // }, [userData])

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
          title="Nhân viên hiện tại"
          value={data?.staff}
          icon={<UserDasboardIcon />}
        />
        <InfoDashboardCard
          title="Số mặt hàng trong kho"
          value={data?.product}
          icon={<ProductDashboardIcon />}
        />
        <InfoDashboardCard
          title="Tổng tiền thu"
          value={data?.gain}
          token={true}
          icon={<GainDashboardIcon />}
        />
        <InfoDashboardCard
          title="Tổng tiền chi"
          value={data?.spent}
          token={true}
          icon={<SpentDashboardIcon />}
        />
        <InfoDashboardCard
          title="Tổng số đơn nhập hàng"
          value={data?.import}
          icon={<ImportDashboardIcon />}
        />
        <InfoDashboardCard
          title="Số đơn trả nhà cung cấp"
          value={data?.importReturn}
          icon={<ImportReturnDashboardIcon />}
        />
        <InfoDashboardCard
          title="Tổng số đơn xuất hàng"
          value={data?.export}
          icon={<ExportDashboardIcon />}
        />
        <InfoDashboardCard
          title="Số đơn khách trả"
          value={data?.exportReturn}
          icon={<ExportReturnDashboardIcon />}
        />
      </div>
    </div>
  )
}

export default Dashboard
