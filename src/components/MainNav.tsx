import Link from "next/link"
import { useRouter } from "next/router"
import MobileNav from "./MobileNav"
import React, { useEffect, useState } from "react"
import cookie from "cookie"
import Line from "./Line"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../lib/constants"
import DashboardIcon from "./icons/DashboardIcon"
import ArrowRightIcon from "./icons/ArrowRightIcon"
import ManageGoodsIcon from "./icons/ManageGoodsIcon"
import ImportGoodsIcon from "./icons/ImportGoodsIcon"
import ExportGoodsIcon from "./icons/ExportGoodsIcon"
import ReturnGoodsIcon from "./icons/ReturnGoodsIcon"
import CheckGoodsIcon from "./icons/CheckGoodsIcon"
import UserIcon from "./icons/UserIcon"

function MainNav() {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
  // useEffect(() => {
  //   const cookies = cookie.parse(window.document.cookie)
  //   if (cookies.token) {
  //     setIsLogin(true)
  //   } else {
  //     setIsLogin(false)
  //     router.push("/login")
  //   }
  // }, [cookie])
  const subMenuManageGoods = [
    {
      id: 1,
      name: "Sản phẩm",
      href: "/manage-goods",
      isActive: router.asPath.includes("/manage-goods"),
    },
    {
      id: 2,
      name: "Nhà cung cấp",
      href: "/manage-suppliers",
      isActive: router.asPath.includes("/manage-suppliers"),
    },
    {
      id: 3,
      name: "Loại sản phẩm",
      // Chua tao page
      href: "/manage-type-goods",
      isActive: router.asPath.includes("/manage-type-goods"),
    },
  ]
  const subMenuImportGoods = [
    {
      id: 1,
      name: "Danh sách nhập hàng",
      href: "/manage-import-goods",
      isActive: router.asPath.includes("/manage-import-goods"),
    },
    {
      id: 2,
      name: "Tạo đơn nhập hàng",
      href: "/create-import-report",
      isActive: router.asPath.includes("/create-import-report"),
    },
  ]
  const subMenuExportGoods = [
    {
      id: 1,
      name: "Danh sách xuất hàng",
      href: "/manage-export-goods",
      isActive: router.asPath.includes("/manage-export-goods"),
    },
    {
      id: 2,
      name: "Tạo đơn xuất hàng",
      href: "/create-export-report",
      isActive: router.asPath.includes("/create-export-report"),
    },
  ]
  //indev
  const subMenuReturnGoods = [
    {
      id: 1,
      name: "Danh sách trả hàng",
      href: "/return-goods-list",
      isActive: router.asPath.includes("/return-goods-list"),
    },
  ]
  //indev
  const subMenuCheckGoods = [
    {
      id: 1,
      name: "Lịch sử kiểm hàng",
      href: "/check-goods-list",
      isActive: router.asPath.includes("/check-goods-list"),
    },
  ]
  //indev
  const subMenuUser = [
    {
      id: 1,
      name: "Quản lý nhân viên",
      href: "/check-goods-list",
      isActive: router.asPath.includes("/check-goods-list"),
    },
  ]

  const mainMenu = [
    {
      id: 1,
      name: "Thống kê",
      href: "/dashboard",
      icon: <DashboardIcon />,
      isActive: router.asPath.includes("/dashboard"),
    },
    {
      id: 2,
      name: "Quản lý hàng hóa",
      subMenu: subMenuManageGoods,
      icon: <ManageGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-goods") ||
        router.asPath.includes("/manage-suppliers") ||
        router.asPath.includes("/manage-type-goods") ||
        router.asPath.includes("/add-suppliers") ||
        router.asPath.includes("/product-detail") ||
        router.asPath.includes("/supplier-detail") ||
        router.asPath.includes("/edit-product") ||
        router.asPath.includes("/add-supplier") ||
        router.asPath.includes("/edit-supplier") ||
        router.asPath.includes("/add-product"),
    },
    {
      id: 3,
      name: "Nhập hàng",
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-import-goods") ||
        router.asPath.includes("/create-import-report"),
    },
    {
      id: 4,
      name: "Xuất hàng",
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-export-goods") ||
        router.asPath.includes("/create-export-report"),
    },
    // indev
    {
      id: 5,
      name: "Trả hàng",
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive: router.asPath.includes("/return-goods-list"),
    },
    // indev
    {
      id: 6,
      name: "Kiểm hàng",
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive: router.asPath.includes("/xyz"),
    },
    // indev
    {
      id: 7,
      name: "Nhân viên",
      subMenu: subMenuUser,
      icon: <UserIcon />,
      isActive: router.asPath.includes("/abcd"),
    },
  ]

  return (
    <div className="flex flex-col z-50 w-full md:w-[276px] h-min-content md:h-screen overflow-y-auto bg-white px-4 py-[6px] md:pt-7 md:pb-10 shadow-lg fixed top-0 bottom-0 left-0">
      <div className="items-center justify-between hidden h-full md:flex-col md:flex">
        <div className="w-full">
          <div className="flex justify-center">
            <Link href="/">
              <a className="text-base">
                {/* <img src="/images/menu-logo.svg" alt="menu-logo" /> */}
                <div className="w-10 h-10">Logo</div>
                Warehouse Management System
              </a>
            </Link>
          </div>

          <Line className="mt-2" />
          <div className="flex flex-col gap-1 mt-2">
            {mainMenu &&
              mainMenu.map((i) => (
                <MenuItem
                  key={i?.id}
                  icon={i?.icon}
                  name={i?.name}
                  subMenuItem={i?.subMenu}
                  href={i?.href}
                  isActive={i?.isActive}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}

export default MainNav

function MenuItem({
  href = "",
  subMenuItem = undefined,
  icon,
  name = "",
  isActive = false,
  ...props
}) {
  const [isShowItem, setIsShowItem] = useState(isActive)
  const [isOpenMenu, setIsOpenMenu] = useState(isActive)
  const router = useRouter()

  const handleClickMenuItem = (e) => {
    e.stopPropagation()
    setIsShowItem(!isShowItem)
    setIsOpenMenu(!isOpenMenu)
    if (href) {
      router.push(`${href}`)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer menu-item hover:bg-[#F6F5FA] ${
          isActive
            ? "bg-[#F6F5FA] text-primary icon-active"
            : "bg-transparent text-[#4F4F4F]"
        }
        `}
        onClick={handleClickMenuItem}
      >
        <div className="flex items-center gap-2">
          {icon}
          <p>{name}</p>
        </div>
        {subMenuItem && (
          <div className={`${isOpenMenu && "rotate-90"} smooth-transform`}>
            <ArrowRightIcon />
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isShowItem && (
          <motion.div
            className="flex flex-col gap-2"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={variants}
            transition={{
              duration: 0.2,
            }}
          >
            {subMenuItem &&
              subMenuItem.map((i) => (
                <Item key={i?.id} href={i?.href} isActive={i?.isActive}>
                  {i?.name}
                </Item>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Item({ children, href = "", isActive = false }) {
  return (
    <Link href={href}>
      <a>
        <div
          className={`flex items-center gap-2 menu-item py-3 smooth-transform pr-8 pl-12 ${
            isActive
              ? "bg-[#F6F5FA] text-primary icon-active"
              : "bg-transparent text-[#4F4F4F]"
          } hover:bg-[#F6F5FA]`}
        >
          {/* <div>{icon}</div> */}
          <p className="">{children}</p>
        </div>
      </a>
    </Link>
  )
}
