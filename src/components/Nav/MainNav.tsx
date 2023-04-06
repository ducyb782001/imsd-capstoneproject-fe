import Link from "next/link"
import { useRouter } from "next/router"
import MobileNav from "../MobileNav"
import React, { useEffect, useState } from "react"
import cookie from "cookie"
import Line from "../Line"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import DashboardIcon from "../icons/DashboardIcon"
import ArrowRightIcon from "../icons/ArrowRightIcon"
import ManageGoodsIcon from "../icons/ManageGoodsIcon"
import ImportGoodsIcon from "../icons/ImportGoodsIcon"
import ExportGoodsIcon from "../icons/ExportGoodsIcon"
import ReturnGoodsIcon from "../icons/ReturnGoodsIcon"
import CheckGoodsIcon from "../icons/CheckGoodsIcon"
import UserIcon from "../icons/UserIcon"
import { useTranslation } from "react-i18next"
import useGetMe from "../../hooks/useGetMe"

function MainNav({ userName = "", roleId = 3 }) {
  const router = useRouter()
  const { t } = useTranslation()

  const subMenuManageGoods = [
    {
      id: 1,
      name: t("product"),
      href: "/manage-products",
      isActive: router.asPath === "/manage-products",
    },
    {
      id: 2,
      name: t("supplier"),
      href: "/manage-suppliers",
      isActive: router.asPath === "/manage-suppliers",
    },
    {
      id: 3,
      name: t("type.typeGoods"),
      href: "/manage-category",
      isActive: router.asPath === "/manage-category",
    },
  ]

  const subMenuImportGoods = [
    {
      id: 1,
      name: t("list_import_report"),
      href: "/manage-import-orders",
      isActive: router.asPath === "/manage-import-orders",
    },
    {
      id: 2,
      name: t("create_import_report"),
      href: "/create-import-order",
      isActive: router.asPath === "/create-import-order",
    },
  ]

  const subMenuExportGoods = [
    {
      id: 1,
      name: t("list_export_report"),
      href: "/manage-export-orders",
      isActive: router.asPath === "/manage-export-orders",
    },
    {
      id: 2,
      name: t("create_export_report"),
      href: "/create-export-order",
      isActive: router.asPath === "/create-export-order",
    },
  ]

  const subMenuReturnGoods = [
    {
      id: 1,
      name: "Trả hàng về nhà cung cấp",
      href: "/manage-return-product-to-supplier",
      isActive: router.asPath === "/manage-return-product-to-supplier",
    },
    {
      id: 2,
      name: "Khách trả",
      href: "/manage-return-products",
      isActive: router.asPath === "/manage-return-products",
    },
  ]

  const subMenuCheckGoods = [
    {
      id: 1,
      name: t("check_history"),
      href: "/manage-inventory-checking",
      isActive: router.asPath === "/manage-inventory-checking",
    },
    {
      id: 2,
      name: t("create_check_good"),
      href: "/create-inventory-checking-order",
      isActive: router.asPath === "/create-inventory-checking-order",
    },
  ]

  const mainMenu = [
    // {
    //   id: 1,
    //   name: t("dashboard"),
    //   href: "/dashboard",
    //   icon: <DashboardIcon />,
    //   isActive: router.asPath === ("/dashboard"),
    // },
    {
      id: 2,
      name: t("manageGoods"),
      subMenu: subMenuManageGoods,
      icon: <ManageGoodsIcon />,
      isActive:
        router.asPath === "/manage-products" ||
        router.asPath === "/manage-suppliers" ||
        router.asPath === "/manage-category" ||
        router.asPath === "/add-suppliers" ||
        router.asPath === "/product-detail" ||
        router.asPath === "/supplier-detail" ||
        router.asPath === "/edit-product" ||
        router.asPath === "/add-supplier" ||
        router.asPath === "/edit-supplier" ||
        router.asPath === "/export-product-detail" ||
        router.asPath === "/check-product-detail" ||
        router.asPath === "/import-product-detail" ||
        router.asPath === "/add-product",
    },
    {
      id: 3,
      name: t("import good"),
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath === "/manage-import-orders" ||
        router.asPath === "/import-order-detail" ||
        router.asPath === "/import-order-edit" ||
        router.asPath === "/create-import-order",
    },
    {
      id: 4,
      name: t("export good"),
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath === "/manage-export-orders" ||
        router.asPath === "/export-order-detail" ||
        router.asPath === "/create-export-order" ||
        router.asPath === "/export-order-edit",
    },
    // indev
    {
      id: 5,
      name: t("return good"),
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive:
        router.asPath === "/manage-return-products" ||
        router.asPath === "/create-return-to-supplier-order" ||
        router.asPath.includes("/create-return-order") ||
        router.asPath === "/manage-return-product-to-supplier",
    },
    {
      id: 6,
      name: t("check good"),
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive:
        router.asPath === "/manage-inventory-checking" ||
        router.asPath === "/create-inventory-checking-order" ||
        router.asPath === "/inventory-checking-order-detail" ||
        router.asPath === "/edit-inventory-checking-order",
      href: null,
    },
  ]

  return (
    <div className="flex flex-col z-50 w-full md:w-[276px] h-min-content md:h-screen overflow-y-auto bg-white px-4 py-[6px] md:pt-7 md:pb-10 shadow-lg fixed top-0 bottom-0 left-0">
      <div className="items-center justify-between hidden h-full md:flex-col md:flex">
        <div className="w-full">
          <div className="flex justify-center">
            <Link href="/">
              <a className="text-base">
                <img
                  className="w-[150px] object-cover"
                  src="/images/big-logo-no-text.png"
                  alt="menu-logo"
                />
                <p className="text-[8px] text-center">
                  The best choice for your warehouse
                </p>
              </a>
            </Link>
          </div>
          <Line className="mt-2" />
          <div className="flex flex-col gap-1 mt-2">
            {(roleId === 1 || roleId === 2) && (
              <MenuItem
                key={1}
                icon={<DashboardIcon />}
                name={t("dashboard")}
                href="/dashboard"
                isActive={router.asPath.includes("/dashboard")}
              />
            )}
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
            {roleId === 1 && (
              <MenuItem
                key={7}
                icon={<UserIcon />}
                name={t("staff")}
                href="/manage-staff"
                isActive={
                  router.asPath.includes("/manage-staff") ||
                  router.asPath.includes("/create-staff")
                }
              />
            )}
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
