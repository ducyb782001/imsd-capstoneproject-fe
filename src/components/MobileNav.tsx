import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import IconHamberger from "./icons/IconHamberger"
import IconCloseDialog from "./icons/IconCloseDialog"
import Line from "./Line"
import UserDropdownMobile from "./UserDropdownMobile"
import DashboardIcon from "./icons/DashboardIcon"
import ManageGoodsIcon from "./icons/ManageGoodsIcon"
import ImportGoodsIcon from "./icons/ImportGoodsIcon"
import ExportGoodsIcon from "./icons/ExportGoodsIcon"
import ReturnGoodsIcon from "./icons/ReturnGoodsIcon"
import CheckGoodsIcon from "./icons/CheckGoodsIcon"
import UserIcon from "./icons/UserIcon"

function MobileNav() {
  const router = useRouter()
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
      name: "Tạo phiếu nhập hàng",
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
      name: "Tạo phiếu xuất hàng",
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
      href: "/manage-goods",
      isActive:
        router.asPath.includes("/manage-goods") ||
        router.asPath.includes("/suppliers"),
    },
    {
      id: 3,
      name: "Nhập hàng",
      subMenu: subMenuImportGoods,
      icon: <ImportGoodsIcon />,
      href: "/manage-import-goods",
      isActive:
        router.asPath.includes("/manage-import-goods") ||
        router.asPath.includes("/create-import-report"),
    },
    {
      id: 4,
      name: "Xuất hàng",
      subMenu: subMenuExportGoods,
      icon: <ExportGoodsIcon />,
      href: "/manage-export-goods",
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
      href: "/return-goods-list",
      isActive: router.asPath.includes("/return-goods-list"),
    },
    // indev
    {
      id: 6,
      name: "Kiểm hàng",
      subMenu: subMenuCheckGoods,
      icon: <CheckGoodsIcon />,
      href: "/return-goods-list",
      isActive: router.asPath.includes("/xyz"),
    },
    // indev
    {
      id: 7,
      name: "Nhân viên",
      subMenu: subMenuUser,
      icon: <UserIcon />,
      href: "/return-goods-list",
      isActive: router.asPath.includes("/abcd"),
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
                      Logo
                      {/* <img src="/logo-mobile.svg" className="min-w-[131px]" /> */}
                    </a>
                  </Link>
                  <IconCloseDialog onClick={toggleHoverMenu} />
                </div>

                <Line className="mt-5 mb-3" />

                <div className="flex flex-col gap-[6px]">
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
                </div>
              </div>
              {/* <div>
                <Line className="mb-3" />
                <MobileMenuItem
                  href="/integration"
                  label="Integration"
                  isActive={router.asPath.includes("/integration")}
                />
                <MobileMenuItem
                  href="/help-center"
                  label="Help Center"
                  isActive={router.asPath.includes("/help-center")}
                />
              </div> */}
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
