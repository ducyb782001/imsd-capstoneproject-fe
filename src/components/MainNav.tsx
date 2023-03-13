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
import { useTranslation } from "react-i18next"
import useGetMe from "../hooks/useGetMe"

function MainNav() {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()
  // useEffect(() => {
  //   const cookies = cookie.parse(window.document.cookie)
  //   if (cookies.token) {
  //     setIsLogin(true)
  //   } else {
  //     setIsLogin(false)
  //     router.push("/login")
  //   }
  // }, [cookie])

  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])
  // use data?.role of useGetMe to show/hide menubar
  const subMenuManageGoods = [
    {
      id: 1,
      name: t("product"),
      href: "/manage-goods",
      isActive: router.asPath.includes("/manage-goods"),
    },
    {
      id: 2,
      name: t("supplier"),
      href: "/manage-suppliers",
      isActive: router.asPath.includes("/manage-suppliers"),
    },
    {
      id: 3,
      name: t("type.typeGoods"),
      // Chua tao page
      href: "/manage-type-goods",
      isActive: router.asPath.includes("/manage-type-goods"),
    },
  ]
  const subMenuImportGoods = [
    {
      id: 1,
      name: t("list_import_report"),
      href: "/manage-import-goods",
      isActive: router.asPath.includes("/manage-import-goods"),
    },
    {
      id: 2,
      name: t("create_import_report"),
      href: "/create-import-report",
      isActive: router.asPath.includes("/create-import-report"),
    },
  ]
  const subMenuExportGoods = [
    {
      id: 1,
      name: t("list_export_report"),
      href: "/manage-export-goods",
      isActive: router.asPath.includes("/manage-export-goods"),
    },
    {
      id: 2,
      name: t("create_export_report"),
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
      name: t("check_history"),
      href: "/manage-check-good",
      isActive: router.asPath.includes("/manage-check-good"),
    },
    {
      id: 2,
      name: t("create_check_good"),
      href: "/create-check-report",
      isActive: router.asPath.includes("/create-check-report"),
    },
  ]

  const mainMenuOwner = [
    {
      id: 1,
      name: t("dashboard"),
      href: "/dashboard",
      icon: <DashboardIcon />,
      isActive: router.asPath.includes("/dashboard"),
    },
    {
      id: 2,
      name: t("manageGoods"),
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
        router.asPath.includes("/export-product-detail") ||
        router.asPath.includes("/check-product-detail") ||
        router.asPath.includes("/import-product-detail") ||
        router.asPath.includes("/add-product"),
    },
    {
      id: 3,
      name: t("import good"),
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-import-goods") ||
        router.asPath.includes("/import-report-detail") ||
        router.asPath.includes("/import-report-succeed") ||
        router.asPath.includes("/import-report-canceled") ||
        router.asPath.includes("/import-report-draff") ||
        router.asPath.includes("/import-report-edit") ||
        router.asPath.includes("/create-import-report"),
    },
    {
      id: 4,
      name: t("export good"),
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-export-goods") ||
        router.asPath.includes("/export-report-canceled") ||
        router.asPath.includes("/export-report-detail") ||
        router.asPath.includes("/export-report-draff") ||
        router.asPath.includes("/export-report-succeed") ||
        router.asPath.includes("/create-export-report"),
    },
    // indev
    {
      id: 5,
      name: t("return good"),
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive: router.asPath.includes("/return-goods-list"),
    },
    {
      id: 6,
      name: t("check good"),
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-check-good") ||
        router.asPath.includes("/edit-check-good") ||
        router.asPath.includes("/draff-check-good") ||
        router.asPath.includes("/check-good-detail") ||
        router.asPath.includes("/create-check-report"),
    },
    {
      id: 7,
      name: t("staff"),
      icon: <UserIcon />,
      isActive:
        router.asPath.includes("/manage-staff") ||
        router.asPath.includes("/create-staff"),
      href: "/manage-staff",
    },
  ]

  const mainMenuStoreKeeper = [
    {
      id: 1,
      name: t("dashboard"),
      href: "/dashboard",
      icon: <DashboardIcon />,
      isActive: router.asPath.includes("/dashboard"),
    },
    {
      id: 2,
      name: t("manageGoods"),
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
        router.asPath.includes("/export-product-detail") ||
        router.asPath.includes("/check-product-detail") ||
        router.asPath.includes("/import-product-detail") ||
        router.asPath.includes("/add-product"),
    },
    {
      id: 3,
      name: t("import good"),
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-import-goods") ||
        router.asPath.includes("/import-report-detail") ||
        router.asPath.includes("/import-report-succeed") ||
        router.asPath.includes("/import-report-canceled") ||
        router.asPath.includes("/import-report-draff") ||
        router.asPath.includes("/import-report-edit") ||
        router.asPath.includes("/create-import-report"),
    },
    {
      id: 4,
      name: t("export good"),
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-export-goods") ||
        router.asPath.includes("/export-report-canceled") ||
        router.asPath.includes("/export-report-detail") ||
        router.asPath.includes("/export-report-draff") ||
        router.asPath.includes("/export-report-succeed") ||
        router.asPath.includes("/create-export-report"),
    },
    // indev
    {
      id: 5,
      name: t("return good"),
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive: router.asPath.includes("/return-goods-list"),
    },
    {
      id: 6,
      name: t("check good"),
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-check-good") ||
        router.asPath.includes("/edit-check-good") ||
        router.asPath.includes("/draff-check-good") ||
        router.asPath.includes("/check-good-detail") ||
        router.asPath.includes("/create-check-report"),
    },
  ]

  const mainMenuSeller = [
    {
      id: 1,
      name: t("dashboard"),
      href: "/dashboard",
      icon: <DashboardIcon />,
      isActive: router.asPath.includes("/dashboard"),
    },
    {
      id: 2,
      name: t("manageGoods"),
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
        router.asPath.includes("/export-product-detail") ||
        router.asPath.includes("/check-product-detail") ||
        router.asPath.includes("/import-product-detail") ||
        router.asPath.includes("/add-product"),
    },
    {
      id: 3,
      name: t("import good"),
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-import-goods") ||
        router.asPath.includes("/import-report-detail") ||
        router.asPath.includes("/import-report-succeed") ||
        router.asPath.includes("/import-report-canceled") ||
        router.asPath.includes("/import-report-draff") ||
        router.asPath.includes("/import-report-edit") ||
        router.asPath.includes("/create-import-report"),
    },
    {
      id: 4,
      name: t("export good"),
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-export-goods") ||
        router.asPath.includes("/export-report-canceled") ||
        router.asPath.includes("/export-report-detail") ||
        router.asPath.includes("/export-report-draff") ||
        router.asPath.includes("/export-report-succeed") ||
        router.asPath.includes("/create-export-report"),
    },
    // indev
    {
      id: 5,
      name: t("return good"),
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive: router.asPath.includes("/return-goods-list"),
    },
    {
      id: 6,
      name: t("check good"),
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive:
        router.asPath.includes("/manage-check-good") ||
        router.asPath.includes("/edit-check-good") ||
        router.asPath.includes("/draff-check-good") ||
        router.asPath.includes("/check-good-detail") ||
        router.asPath.includes("/create-check-report"),
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
            {userData?.roleId === 1
              ? mainMenuOwner.map((i) => (
                  <MenuItem
                    key={i?.id}
                    icon={i?.icon}
                    name={i?.name}
                    subMenuItem={i?.subMenu}
                    href={i?.href}
                    isActive={i?.isActive}
                  />
                ))
              : userData?.roleId === 2
              ? mainMenuStoreKeeper.map((i) => (
                  <MenuItem
                    key={i?.id}
                    icon={i?.icon}
                    name={i?.name}
                    subMenuItem={i?.subMenu}
                    href={i?.href}
                    isActive={i?.isActive}
                  />
                ))
              : userData?.roleId === 3 &&
                mainMenuSeller.map((i) => (
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
