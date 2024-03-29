import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import ArrowDownIcon from "../icons/ArrowDownIcon"
import EngFlagIcon from "../icons/EngFlagIcon"
import VnFlagIcon from "../icons/VnFlagIcon"
import { useTranslation } from "react-i18next"

const listResult = [
  { id: 1, name: "Tiếng Việt", code: "vi", logo: <VnFlagIcon /> },
  { id: 2, name: "English", code: "en", logo: <EngFlagIcon /> },
]

function LanguageDropdown({ title = "" }) {
  const node = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const toggleOpenMenu = () => {
    toggleOpen(!isOpen)
  }

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
  const { i18n } = useTranslation()

  const [showingLanguage, setShowingLanguage] = useState<any>()
  useEffect(() => {
    if (i18n.language === "en") {
      setShowingLanguage({
        id: 2,
        name: "English",
        code: "en",
        logo: <EngFlagIcon />,
      })
    } else if (i18n.language === "vi") {
      setShowingLanguage({
        id: 1,
        name: "Tiếng Việt",
        code: "vi",
        logo: <VnFlagIcon />,
      })
    }
  }, [i18n.language])

  return (
    <motion.div className="relative text-[#4F4F4F]">
      <div ref={node}>
        {title && <p className="mb-1 text-sm text-gray">{title}</p>}
        <div
          onClick={toggleOpenMenu}
          className="flex items-center justify-between gap-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div>{showingLanguage?.logo}</div>
            <p className="text-base font-medium text-black">
              {showingLanguage?.name}
            </p>
            <div className={`${isOpen && "rotate-180"} smooth-transform`}>
              <ArrowDownIcon color="#373737" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute right-0 w-full shadow-md mt-2`}
        style={{
          borderRadius: 5,
          backgroundColor: "#ECF1F4",
          transformOrigin: "50% -30px",
          zIndex: 1,
        }}
      >
        <div
          id="list-dropdown"
          className="smooth-transform z-50 flex min-w-[150px] flex-col gap-1  bg-[#fff] py-3  max-h-[250px] overflow-y-auto border border-grayLight rounded-md"
        >
          {listResult?.map((i) => (
            <DropDownItem key={i?.id} data={i} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LanguageDropdown

function DropDownItem({ data }) {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return (
    <div
      onClick={() => {
        changeLanguage(data?.code)
      }}
      className="w-full px-4 py-3 text-sm cursor-pointer bg-opacity-20 hover:bg-[#EFEAFA] smooth-transform"
    >
      {data?.name}
    </div>
  )
}
