import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import IconHamberger from "./icons/IconHamberger"
import IconCloseDialog from "./icons/IconCloseDialog"
import Line from "./Line"
import UserDropdownMobile from "./UserDropdownMobile"
import ManageGoodsIcon from "./icons/ManageGoodsIcon"
import ImportGoodsIcon from "./icons/ImportGoodsIcon"
import ExportGoodsIcon from "./icons/ExportGoodsIcon"
import ReturnGoodsIcon from "./icons/ReturnGoodsIcon"
import CheckGoodsIcon from "./icons/CheckGoodsIcon"
import { useTranslation } from "react-i18next"
import DashboardIcon from "./icons/DashboardIcon"
import { getRoleId } from "../lib/getRoleId"
import UserIcon from "./icons/UserIcon"

function MobileNav({ roleId = "" }) {
  const { t } = useTranslation()
  const router = useRouter()

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
        router.asPath === "/add-product" ||
        router.asPath === "/add-suppliers" ||
        router.pathname === "/product-detail/[productId]" ||
        router.pathname === "/supplier-detail/[supplierid]" ||
        router.pathname === "/edit-product/[productId]" ||
        router.asPath === "/add-supplier" ||
        router.pathname === "/edit-supplier/[supplierId]" ||
        router.asPath === "/export-product-detail" ||
        router.asPath === "/check-product-detail" ||
        router.asPath === "/import-product-detail",
    },
    {
      id: 3,
      name: t("import good"),
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      isActive:
        router.asPath === "/manage-import-orders" ||
        router.pathname === "/import-order-detail/[importId]" ||
        router.pathname === "/import-order-edit/[importId]" ||
        router.asPath.includes("/import-product-detail/") ||
        router.asPath === "/create-import-order",
    },

    {
      id: 4,
      name: t("export good"),
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      isActive:
        router.asPath === "/manage-export-orders" ||
        router.pathname === "/export-order-detail/[exportId]" ||
        router.asPath === "/create-export-order" ||
        router.asPath.includes("/export-product-detail/") ||
        router.pathname === "/export-order-edit/[exportId]",
    },
    {
      id: 5,
      name: t("return good"),
      subMenu: subMenuReturnGoods,
      icon: <ReturnGoodsIcon />,
      isActive:
        router.asPath === "/manage-return-products" ||
        router.asPath.includes("/create-return-to-supplier-order") ||
        router.asPath.includes("/create-return-order") ||
        router.asPath.includes("/return-product-detail") ||
        router.asPath === "/manage-return-product-to-supplier" ||
        router.pathname === "/return-order-detail/[returnId]" ||
        router.pathname === "/return-to-supplier-order-detail/[returnId]",
    },
    {
      id: 6,
      name: t("check good"),
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      isActive:
        router.asPath === "/manage-inventory-checking" ||
        router.asPath === "/create-inventory-checking-order" ||
        router.asPath.includes("/check-product-detail/") ||
        router.pathname === "/inventory-checking-order-detail/[checkId]" ||
        router.pathname === "/edit-inventory-checking-order/[checkId]",
      href: null,
    },
  ]

  const node = useRef()
  const [isHover, toggleHover] = useState(false)

  const toggleHoverMenu = () => {
    toggleHover(!isHover)
  }

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (node.current?.contains(e.target)) {
      return
    }
    toggleHover(false)
  }

  useEffect(() => {
    if (isHover) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isHover])

  const sidebar = {
    open: (height = 1200) => ({
      pointerEvents: "all",
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      zIndex: 99,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      pointerEvents: "none",
      clipPath: "circle(0px at 0px 0px)",
      transition: {
        // delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }
  // const roleId = getRoleId()

  return (
    <div ref={node} className="relative">
      <motion.div className="w-full">
        <div className={`flex items-center justify-between h-full w-full`}>
          <IconHamberger onClick={toggleHoverMenu} />
          <UserDropdownMobile />
        </div>
        <motion.div
          initial={false}
          animate={isHover ? "open" : "closed"}
          // @ts-ignore
          variants={sidebar}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            // backgroundColor: "#111",
            transformOrigin: "50% -30px",
            // height: "calc(100vh - 66px)",
            height: "100vh",
            width: "100vw",
            overflowY: "auto",
          }}
          className="bg-white"
        >
          <motion.div variants={variants} className="h-full mt-0">
            <div className="flex flex-col justify-between w-full h-full pt-4 pb-8 px-7">
              <div>
                <div className="flex items-center justify-between">
                  <Link href="/">
                    <a>
                      <img
                        className="object-cover w-10 h-10"
                        src="/images/mobile-logo.png"
                        alt="menu-logo"
                      />
                    </a>
                  </Link>
                  <IconCloseDialog onClick={toggleHoverMenu} />
                </div>

                <Line className="mt-5 mb-3" />

                <div className="flex flex-col gap-[6px]">
                  {(roleId == "1" || roleId == "2") && (
                    <MenuItem
                      key={1}
                      // icon={<DashboardIcon />}
                      name={t("dashboard")}
                      href="/dashboard"
                      isActive={router.asPath.includes("/dashboard")}
                    />
                  )}
                  {mainMenu &&
                    mainMenu.map((i) => (
                      <MobileMenuItem
                        key={i?.id}
                        icon={i?.icon}
                        name={i?.name}
                        subMenuItem={i?.subMenu}
                        href={i?.href}
                        isActive={i?.isActive}
                      />
                    ))}
                  {roleId == "1" && (
                    <MenuItem
                      key={7}
                      icon={<UserIcon />}
                      name={t("staff")}
                      href="/manage-staff"
                      isActive={
                        router.asPath.includes("/manage-staff") ||
                        router.asPath.includes("/create-staff") ||
                        router.asPath.includes("/edit-staff")
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MobileNav

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}

function MobileMenuItem({
  subMenuItem = undefined,
  href,
  isActive,
  icon = null,
  name,
  ...props
}) {
  return (
    <motion.div
      variants={variants}
      // whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Link href={href || ""}>
        <a
          className={`items-center px-3 rounded py-[14px] gap-2 flex cursor-pointer ${
            isActive ? " bg-[#F6F5FA]" : "bg-transparent"
          }`}
          {...props}
        >
          <div className={`${isActive ? "menu-icon-active" : ""}`}>{icon}</div>
          <p
            className={`text-sm text-center ${
              isActive ? "text-primary" : "text-gray"
            }`}
          >
            {name}
          </p>
        </a>
      </Link>
      {subMenuItem &&
        subMenuItem.map((i) => (
          <MenuItem
            key={i?.id}
            href={i?.href}
            isActive={i?.isActive}
            name={i?.name}
          />
        ))}
    </motion.div>
  )
}

function MenuItem({ href, isActive, icon = null, name, ...props }) {
  return (
    <motion.div
      variants={variants}
      // whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Link href={href || "/"}>
        <a
          className={`items-center px-3 rounded py-[14px] gap-2 flex cursor-pointer pl-11 ${
            isActive ? " bg-[#F6F5FA]" : "bg-transparent"
          }`}
          {...props}
        >
          {/* <div className={`${isActive ? "menu-icon-active" : ""}`}>{icon}</div> */}
          <p
            className={`text-sm text-center ${
              isActive ? "text-primary" : "text-gray"
            }`}
          >
            {name}
          </p>
        </a>
      </Link>
    </motion.div>
  )
}
