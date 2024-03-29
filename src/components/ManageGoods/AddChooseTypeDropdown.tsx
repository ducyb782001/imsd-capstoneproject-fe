import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { search, searchByCategoryName } from "../../lib/search"
import ArrowDownIcon from "../icons/ArrowDownIcon"
import SearchIcon from "../icons/SearchIcon"
import AddTypePopup from "./ManageTypeGoods/AddTypePopup"
import { useTranslation } from "react-i18next"
import AddPlusIcon from "../icons/AddPlusIcon"

function AddChooseTypeDropdown({
  title = "",
  listDropdown,
  showing,
  setShowing,
  textDefault,
}) {
  const node = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const listResult = searchByCategoryName(searchInput, listDropdown)
  const { t } = useTranslation()
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

  return (
    <motion.div className="relative text-[#4F4F4F]">
      <div ref={node}>
        {title && <p className="mb-1 text-sm text-gray">{title}</p>}

        <div
          onClick={toggleOpenMenu}
          className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-gray hover:border-primary smooth-transform"
        >
          <div className="flex items-center gap-1">
            <p className="text-gray">
              {showing?.categoryName || showing || textDefault}
            </p>
          </div>
          <div className={`${isOpen && "rotate-180"} smooth-transform`}>
            <ArrowDownIcon color="#373737" />
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
        <DropdownSearch
          onClick={toggleOpenMenu}
          onChange={(e) => setSearchInput(e.target.value)}
          className=""
          placeholder={t("search.searchAdd")}
        />
        <div
          id="list-dropdown"
          className="smooth-transform z-50 flex w-full flex-col gap-1 bg-[#fff] max-h-[250px] overflow-y-auto"
        >
          {listResult?.map((i, index) => (
            <DropDownItem key={index} data={i} setShowing={setShowing} />
          ))}
        </div>
        <AddTypePopup>
          <button className="flex items-center gap-1 bg-[#fff] w-full px-4 py-3 active:bg-[#EFEFEF] hover:bg-[#EFEAFA]">
            <AddPlusIcon /> {t("add_type")}
          </button>
        </AddTypePopup>
      </motion.div>
    </motion.div>
  )
}

export default AddChooseTypeDropdown

function DropDownItem({ data, setShowing }) {
  return (
    <div
      onClick={() => setShowing(data)}
      className="w-full px-4 py-3 text-sm cursor-pointer bg-opacity-20 hover:bg-[#EFEAFA] smooth-transform"
    >
      {data?.categoryName || data}
    </div>
  )
}

function DropdownSearch({ className = "", ...props }) {
  return (
    <div className={`relative w-full ${className} border-b border-grayLight`}>
      <div className="absolute top-3 left-3">
        <SearchIcon />
      </div>
      <input
        {...props}
        type="text"
        className="w-full py-3 pl-10 pr-3 outline-none smooth-transform"
      />
    </div>
  )
}
