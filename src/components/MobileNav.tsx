import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import IconHamberger from "./icons/IconHamberger"
import IconCloseDialog from "./icons/IconCloseDialog"
import Line from "./Line"

function MobileNav() {
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

  const router = useRouter()
  const context = useWeb3React<Web3Provider>()
  const { account } = context

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
                      {/* <img src="/logo-mobile.svg" className="min-w-[131px]" /> */}
                    </a>
                  </Link>
                  <IconCloseDialog onClick={toggleHoverMenu} />
                </div>

                <Line className="mt-5 mb-3" />

                <div className="flex flex-col gap-[6px]">
                  <MobileMenuItem
                    href="/dashboard"
                    label="Dashboard"
                    isActive={router.asPath.includes("/dashboard")}
                  />

                  <MobileMenuItem
                    href="/brand"
                    label="Brand"
                    isActive={router.asPath.includes("/brand")}
                  />

                  <MobileMenuItem
                    href="/settings"
                    label="Settings"
                    isActive={router.asPath.includes("/settings")}
                  />
                </div>
              </div>
              <div>
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

function MobileMenuItem({ href, isActive, icon = null, label, ...props }) {
  return (
    <motion.div
      variants={variants}
      // whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      <Link href={href || "/"}>
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
            {label}
          </p>
        </a>
      </Link>
    </motion.div>
  )
}
