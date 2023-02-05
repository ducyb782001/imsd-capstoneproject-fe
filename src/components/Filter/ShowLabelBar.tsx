import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import FilterLabel from "./FilterLabel"
import IconCloseDialog from "../icons/IconCloseDialog"
import { format } from "date-fns"

function ShowLabelBar({
  isExpandedLabelBar,
  listFilter,
  handleRemoveFilter,
  appliedDate,
  dateRange,
  handleRemoveDatefilter,
}) {
  return (
    <div>
      <AnimatePresence initial={false}>
        {isExpandedLabelBar && (
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
                // animationDelay: "1",
              },
            }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.73, 0.98],
            }}
          >
            <div className="flex flex-wrap gap-4 min-h-11">
              {listFilter?.map((i, index) => (
                <FilterLabel
                  dataLabel={i}
                  key={index}
                  itemIndex={index}
                  handleRemoveFilter={handleRemoveFilter}
                />
              ))}

              {appliedDate && (
                <div className="flex items-center rounded bg-primary px-3 py-[8px]">
                  <p className="mr-6 text-white">
                    Registration date:&nbsp;
                    <span className="font-medium">
                      {format(dateRange[0].startDate, "dd/MM/yyyy")}
                    </span>
                    &nbsp; to&nbsp;
                    <span className="font-medium">
                      {format(dateRange[0].endDate, "dd/MM/yyyy")}
                    </span>
                  </p>
                  <IconCloseDialog
                    color="#ffffff"
                    className="cursor-pointer"
                    onClick={() => handleRemoveDatefilter()}
                  />
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShowLabelBar
