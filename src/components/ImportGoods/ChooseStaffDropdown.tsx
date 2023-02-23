import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { search } from "../../lib/search"
import DemoPopup from "../DemoPopup"
import AddPlusIcon from "../icons/AddPlusIcon"
import ArrowDownIcon from "../icons/ArrowDownIcon"
import SearchIcon from "../icons/SearchIcon"

function ChooseStaffDropdown({
  title = "",
  listDropdown,
  showing,
  setShowing,
  textDefault,
}) {
  const node = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const listResult = search(searchInput, listDropdown)

  const toggleOpenMenu = () => {
    if (listDropdown?.length > 0) {
      toggleOpen(!isOpen)
    }
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
        {title && <p className="mb-1 text-sm font-bold text-gray">{title}</p>}

        <div
          onClick={toggleOpenMenu}
          className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
        >
          <div className="flex items-center gap-1">
            <p className="text-gray">
              {showing?.name || showing || textDefault}
            </p>
          </div>
          <ArrowDownIcon color="#373737" />
        </div>
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute right-0 w-full shadow-md mt-2`}
        style={{
          // position: "absolute",
          // top: 40,
          // right: 0,
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
          placeholder="Tìm kiếm theo tên"
        />
        <div
          id="list-dropdown"
          className="smooth-transform z-50 flex w-full flex-col gap-1 bg-[#fff] pb-3 max-h-[250px] overflow-y-auto"
        >
          {listResult?.map((i, index) => (
            <DropDownItem key={index} data={i} setShowing={setShowing} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChooseStaffDropdown

function DropDownItem({ data, setShowing }) {
  return (
    <div
      onClick={() => setShowing(data)}
      className="w-full px-4 py-3 text-sm cursor-pointer bg-opacity-20 hover:bg-[#EFEAFA] smooth-transform"
    >
      {data?.name || data}
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
