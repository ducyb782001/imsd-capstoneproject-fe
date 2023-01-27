import { motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { DateRangePicker } from "react-date-range"
import { format } from "date-fns"

function DatePicker({ dateRange, setDateRange, children }) {
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

  return (
    <div className="relative h-full">
      <div onClick={toggleOpenMenu} className="h-full">
        {children}
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute top-[70] right-0 w-auto`}
        style={{
          // position: "absolute",
          // top: 40,
          // right: 0,
          borderRadius: 5,
          backgroundColor: "#ECF1F4",
          transformOrigin: "50% -30px",
          zIndex: 1,
        }}
        onClick={toggleOpenMenu}
      >
        <div className="smooth-transform z-50 flex w-full min-w-[209px] flex-col gap-3 rounded-lg bg-[#fff] py-2 px-2 shadow-md">
          <DateRangePicker
            months={2}
            // @ts-ignore
            onChange={(item) => setDateRange([item.selection])}
            ranges={dateRange}
            direction="horizontal"
            rangeColors={["#6A44D2", "#6A44D2", "#6A44D2"]}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default DatePicker
