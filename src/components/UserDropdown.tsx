import { motion } from "framer-motion"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import ArrowDownIcon from "./icons/ArrowDownIcon"
import cookie from "cookie"
import AvatarIcon from "./icons/AvatarIcon"
import { useMutation } from "react-query"
import { logout } from "../apis/auth"
import { browserRedirectToIndexAfterSignOut } from "../lib/redirect"
import { useTranslation } from "react-i18next"

function UserDropdown({ avatar = null, userName = "" }) {
  const node = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const toggleOpenMenu = () => {
    toggleOpen(!isOpen)
  }

  const close = () => setShowDialog(false)

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (node.current && node.current?.contains(e.target)) {
      return
    }
    toggleOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.2,
        delay: 0.05,
      },
      transitionEnd: {
        display: "none",
      },
    },
  }

  const logoutMutation = useMutation(
    async () => {
      return await logout()
    },
    {
      onSuccess: (data, error, variables) => {
        console.log("logout data", data)
      },
    },
  )

  const signOut = () => {
    logoutMutation.mutate()
    localStorage.removeItem("userData")
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    localStorage.removeItem("roleId")
    window.document.cookie = cookie.serialize("token", "", {
      maxAge: -1, // Expire the cookie immediately.
      path: "/",
    })
    window.document.cookie = cookie.serialize("roleId", "", {
      maxAge: -1, // Expire the cookie immediately.
      path: "/",
    })
    browserRedirectToIndexAfterSignOut()
  }

  const { t } = useTranslation()

  return (
    <div className="relative">
      <div
        onClick={toggleOpenMenu}
        className="flex items-center gap-5 cursor-pointer"
        ref={node}
      >
        {avatar ? (
          <img
            alt="avatar-user"
            className="object-cover w-8 h-8"
            src={avatar}
          />
        ) : (
          <AvatarIcon />
        )}
        <p className="text-grayDark">{userName}</p>
        <div className={`${isOpen && "rotate-180"} smooth-transform`}>
          <ArrowDownIcon color="#373737" />
        </div>
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute top-[70] right-0 w-auto`}
        style={{
          borderRadius: 5,
          backgroundColor: "#ECF1F4",
          transformOrigin: "50% -30px",
          zIndex: 1,
        }}
        onClick={toggleOpenMenu}
      >
        <div className="smooth-transform z-50 flex w-full min-w-[209px] flex-col gap-3 rounded-lg bg-[#fff] py-5 px-8 shadow-md">
          <Link href={`/profile`}>
            <a>
              <DropDownItem label={t("personal_imformation")} />
            </a>
          </Link>

          <div onClick={signOut}>
            <DropDownItem label={t("signOut")} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UserDropdown

function DropDownItem({ label }) {
  return (
    <p className="cursor-pointer smooth-animation whitespace-nowrap hover:text-primary">
      {label}
    </p>
  )
}
