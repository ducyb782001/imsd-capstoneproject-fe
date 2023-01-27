import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface NavDataType {
  name: string
  subTab: { name: string; href: string }[]
  checkActive: string[]
}

function NavItemExpand({ navData }: { navData: NavDataType }) {
  const [ispExpanded, setIspExpanded] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <div>
      <motion.header
        className="cursor-pointer"
        onClick={() => setIspExpanded(!ispExpanded)}
      >
        <div
          className={`flex cursor-pointer items-center gap-2 py-4 text-center text-lg justify-between ${
            isActive ? "" : ""
          }`}
        >
          {navData.name}
          <div
            className={`smooth-transform ${
              ispExpanded ? "rotate-0" : "-rotate-90"
            }`}
          >
            {/* <ArrowDownIcon color={isActive ? "#B85985" : "#ADADAD"} /> */}
          </div>
        </div>
      </motion.header>

      <AnimatePresence initial={false}>
        {ispExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: {
                opacity: 0,
                height: 0,
                animationDelay: "1",
              },
            }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.73, 0.98],
            }}
            className="flex flex-col gap-4"
          >
            {navData?.subTab.map((i, index) => (
              <Item data={i} key={index} />
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavItemExpand

function Item({ data, isActive = true }) {
  const [serviceName, setServiceName] = useState("")

  return (
    <div
      className={`cursor-pointer rounded-lg p-3 ${
        isActive ? "text-primaryColor" : "text-[#B4B4B4]"
      }`}
    >
      {data?.name}
    </div>
  )
}
