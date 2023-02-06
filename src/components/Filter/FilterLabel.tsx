import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import IconCloseDialog from "../icons/IconCloseDialog"

function FilterLabel({ dataLabel, handleRemoveFilter, itemIndex }) {
  return (
    <div className="flex items-center rounded bg-primary px-3 py-[8px]">
      {dataLabel && (
        <p className="mr-6 text-white">
          {dataLabel.applied}:&nbsp;{dataLabel.value}&nbsp;
        </p>
      )}
      <IconCloseDialog
        color="#ffffff"
        className="cursor-pointer"
        onClick={() => handleRemoveFilter(itemIndex)}
      />
    </div>
  )
}

export default FilterLabel
