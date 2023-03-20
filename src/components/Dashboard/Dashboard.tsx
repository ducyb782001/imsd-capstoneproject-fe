import BigNumber from "bignumber.js"
import React, { useState } from "react"
import UserIcon from "../icons/UserIcon"
import InventoryChart from "./InventoryChart"
import SaleChart from "./SaleChart"
import SubMenu from "./SubMenu"

const listSubMenu = [
  { id: "sale", label: "Doanh thu bán hàng" },
  { id: "inventoryEachYear", label: "Tồn kho theo năm" },
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("sale")

  return (
    <div>
      <div className="grid items-center grid-cols-1 gap-3 bg-white block-border md:grid-cols-37">
        <div className="flex items-center gap-3">
          <img
            className="object-cover w-16 h-16 rounded-full"
            alt="avatar-user"
            src="/images/image-default.png"
          />
          <div>
            <p className="text-xl font-semibold text-black">Thùy Dung</p>
            <p className="mt-2 text-sm font-medium text-[#343434]">Thủ kho</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UserInfoIcon />
          <UserInfoIcon />
          <UserInfoIcon />
          <UserInfoIcon />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6 md:grid-cols-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>
      <SubMenu
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        listMenu={listSubMenu}
      />
      {activeTab === "sale" && <SaleChart />}
      {activeTab === "inventoryEachYear" && <InventoryChart />}
      <div className="grid grid-cols-2 gap-6 mt-6 md:grid-cols-4">
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>
    </div>
  )
}

export default Dashboard

function InfoCard() {
  return (
    <div className="p-3 font-semibold bg-white border rounded-xl border-grayLight drop-shadow-md">
      <p className="text-lg">Nhân viên hiện tại</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[#28A745] text-2xl">
          {new BigNumber(10).toFormat()}
        </p>
        <UserIcon />
      </div>
    </div>
  )
}

function UserInfoIcon() {
  return (
    <div className="flex items-center">
      <p className="text-sm font-normal text-gray">Giới tính:</p>
      <p className="text-sm font-medium text-[#343434] ml-3">Nữ</p>
    </div>
  )
}
