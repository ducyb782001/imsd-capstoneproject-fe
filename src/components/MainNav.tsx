import Link from "next/link"
import { useRouter } from "next/router"
import MobileNav from "./MobileNav"
import React, { useEffect, useState } from "react"
import cookie from "cookie"
import Line from "./Line"
import { AnimatePresence, motion } from "framer-motion"
import { variants } from "../lib/constants"

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

  return (
    <div className="flex flex-col z-50 w-full md:w-[276px] h-min-content md:h-screen overflow-y-auto bg-white px-4 py-[6px] md:px-6 md:pt-7 md:pb-10 shadow-lg fixed top-0 bottom-0 left-0">
      <div className="items-center justify-between hidden h-full md:flex-col md:flex">
        <div className="w-full">
          <div className="flex justify-center">
            <Link href="/">
              <a>
                {/* <img src="/images/menu-logo.svg" alt="menu-logo" /> */}
                logo
              </a>
            </Link>
          </div>

          <Line className="mt-2" />

          <div className="flex flex-col gap-1 mt-2">Menu</div>
        </div>
      </div>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}

export default MainNav

function Item({ icon, children, href = "", isActive = false }) {
  return (
    <Link href={href}>
      <a>
        <div
          className={`flex items-center gap-2 rounded-lg menu-item py-[12px] smooth-transform px-3 ${
            isActive
              ? "bg-[#F6F5FA] text-primary icon-active"
              : "bg-transparent text-[#999999]"
          }`}
        >
          <div>{icon}</div>
          <p className="">{children}</p>
        </div>
      </a>
    </Link>
  )
}

function MenuItem({ ...props }) {
  const [isShowItem, setIsShowItem] = useState(false)
  return (
    <div className="">
      <p className="text-xl" onClick={() => setIsShowItem(!isShowItem)}>
        Click vào đây thì nó show ra và đẩy xuống dưới
      </p>
      <AnimatePresence initial={false}>
        {isShowItem && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={variants}
            transition={{
              duration: 0.2,
            }}
          >
            <div className="h-[50px]">Cục nó show thêm khi ấn</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
