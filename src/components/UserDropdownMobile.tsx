import { DialogOverlay } from "@reach/dialog"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import React, { useState } from "react"
import { useMutation } from "react-query"
import { logout } from "../apis/auth"
import useGetMe from "../hooks/useGetMe"
import { browserRedirectToIndexAfterSignOut } from "../lib/redirect"
import ArrowDownIcon from "./icons/ArrowDownIcon"
import AvatarIcon from "./icons/AvatarIcon"
import IconCloseDialog from "./icons/IconCloseDialog"
import Line from "./Line"
import cookie from "cookie"
import { MotionDialogContent } from "./MotionDialogContent"
import UserIcon from "./icons/UserIcon"
import LogoutIcon from "./icons/LogoutIcon"
import LanguageDropdown from "./Nav/LanguageDropdown"
import { useTranslation } from "react-i18next"

function UserDropdownMobile() {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const { data, isLoading } = useGetMe()

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
    <div className="flex items-center justify-end gap-3">
      <LanguageDropdown />
      <div onClick={open} className="flex items-center">
        <AvatarIcon />
        <p className="text-grayDark">
          {/* {data?.firstName} {data?.lastName}{" "} */}
        </p>
        <ArrowDownIcon color="#373737" />
      </div>

      <AnimatePresence>
        {showDialog && (
          <DialogOverlay
            onDismiss={close}
            className="z-50 flex flex-col justify-end"
          >
            {/* @ts-ignore */}
            <MotionDialogContent
              aria-label="User-mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                y: 300,
                transition: {
                  duration: 0.15,
                },
              }}
              className="z-50 !w-screen md:w-[540px] !m-0 !bg-transparent "
              // style={{ width: 350 }}
            >
              <motion.div
                className="relative flex flex-col w-full pb-20 bg-white rounded-t-2xl h-min-content"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
              >
                <IconCloseDialog
                  className="absolute top-[18px] left-4"
                  onClick={close}
                />
                <p className="font-semibold text-center text-grayDark py-[18px]">
                  {data?.userName}
                </p>
                <Line />
                <div className="px-6">
                  <MenuItem
                    icon={<UserIcon />}
                    label={t("personal_imformation")}
                    href="/profile"
                  />
                  <MenuItem
                    icon={<LogoutIcon />}
                    label={t("signOut")}
                    onClick={signOut}
                  />
                </div>
              </motion.div>
            </MotionDialogContent>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDropdownMobile

function MenuItem({ isActive = false, href = "/", label, icon, ...props }) {
  return (
    <div>
      <Link href={href || "/"}>
        <a
          className={`items-center px-3 rounded py-[14px] gap-2 flex cursor-pointer ${
            isActive ? "bg-[#F6F5FA]" : "bg-transparent"
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
    </div>
  )
}
