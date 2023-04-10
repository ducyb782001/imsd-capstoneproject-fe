import React, { useState } from "react"
import ArrowRightIcon from "../icons/ArrowRightIcon"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../../lib/constants"
import Link from "next/link"
import DashboardIcon from "../icons/DashboardIcon"
import UserIcon from "../icons/UserIcon"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"

function NavMenuItem({ roleId123 = "", mainMenu }) {
  const { t } = useTranslation()
  const router = useRouter()
  const roleId = localStorage.getItem("roleId")

  return (
    <div className="flex flex-col gap-1 mt-2">
      {(roleId == "1" || roleId == "2") && (
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
  )
}

export default NavMenuItem

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
