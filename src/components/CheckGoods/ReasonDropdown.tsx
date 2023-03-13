import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import ArrowDownIcon from "../icons/ArrowDownIcon"

function ReasonDropdown({ showing, setShowing, textDefault = "" }) {
  const listDropdown = [
    { id: 1, value: "Khác" },
    { id: 2, value: "Hư hỏng" },
    { id: 3, value: "Trả hàng" },
  ]
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

  return (
    <motion.div className="w-full relative text-[#4F4F4F]">
      <div className="w-full" ref={node}>
        <div
          onClick={toggleOpenMenu}
          className="flex items-center justify-between gap-1 px-4 py-3 border rounded cursor-pointer border-grayLight hover:border-primary smooth-transform"
        >
          <p className="text-gray">{showing?.value || textDefault}</p>
          <ArrowDownIcon color="#373737" />
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
          className="smooth-transform z-50 flex w-full flex-col gap-1  bg-[#fff] py-3  max-h-[250px] overflow-y-auto"
        >
          {listDropdown?.map((i, index) => (
            <DropDownItem key={index} data={i} setShowing={setShowing} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReasonDropdown

function DropDownItem({ data, setShowing }) {
  return (
    <div
      onClick={() => setShowing(data)}
      className="w-full px-4 py-3 text-sm cursor-pointer bg-opacity-20 hover:bg-[#EFEAFA] smooth-transform"
    >
      {data?.value || data}
    </div>
  )
}
