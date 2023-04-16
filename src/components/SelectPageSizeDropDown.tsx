import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

function SelectPageSizeDropDown({ setPageSize, pageSize }) {
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
        duration: 0.5,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: 15,
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
    <motion.div className="relative">
      <div
        ref={node}
        onClick={toggleOpenMenu}
        className="flex items-center justify-between h-8 gap-1 px-2 border rounded cursor-pointer border-grayLight"
      >
        <div className="flex items-center gap-1 min-w-[74px]">
          <p className="text-sm">{pageSize}</p>
        </div>
        {/* <ArrowDownIcon color="#373737" /> */}
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute right-0 bottom-[100%] w-full`}
        style={{
          // position: "absolute",
          // top: 40,
          // right: 0,
          borderRadius: 5,
          backgroundColor: "#ECF1F4",
          transformOrigin: "50% -30px",
          zIndex: 1,
        }}
        // onClick={toggleOpenMenu}
      >
        <div className="smooth-transform z-50 flex w-full min-w-full flex-col gap-3 rounded-lg bg-[#fff] py-3 shadow-md">
          {[10, 20, 30, 40, 50]
            .sort((a, b) => b - a)
            .map((i, index) => (
              <div
                onClick={() => setPageSize(i)}
                key={index}
                className="w-full px-4 py-3 cursor-pointer bg-opacity-20 hover:bg-grayLight smooth-transform"
              >
                {i}
              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SelectPageSizeDropDown
