import React from "react"

function SubMenu({ setActiveTab, activeTab, listMenu, className = "" }) {
  return (
    <div className={`flex mt-6 items-baseline ${className}`}>
      {listMenu?.map((i) => (
        <TabItem
          setActiveTab={setActiveTab}
          key={i?.id}
          activeTab={activeTab}
          subMenuItem={i}
        />
      ))}
    </div>
  )
}

export default SubMenu

function TabItem({ setActiveTab, activeTab, subMenuItem }) {
  const handleClickItem = () => {
    setActiveTab(subMenuItem?.id)
  }
  return (
    <div
      onClick={handleClickItem}
      className={`min-w-[200px] font-medium text-center cursor-pointer text-xl smooth-transform hover:text-primary hover:border-primary hover:border-b hover:bg-grayBorder px-5 py-2 ${
        subMenuItem?.id === activeTab
          ? "text-primary bg-grayBorder border-b border-primary"
          : "text-gray"
      }`}
    >
      {subMenuItem.label}
    </div>
  )
}
