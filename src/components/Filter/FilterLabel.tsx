import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import IconCloseDialog from "../icons/IconCloseDialog"

function FilterLabel({ dataLabel, handleRemoveFilter, itemIndex }) {
  const [listTierQuery, setListTierQuery] = useState<any>()
  const [valueToShow, setValueToShow] = useState("")

  useEffect(() => {
    if (listTierQuery && dataLabel.applied == "Tier") {
      const convertLabelValueToArray = dataLabel.value.split(",")
      const convertArrayLabelToReadableString = convertLabelValueToArray.map(
        (i) => {
          const findName = listTierQuery?.find((j) => j.id == i)
          return findName.name
        },
      )
      const valueConverted = convertArrayLabelToReadableString?.reduce(
        (prev, curr) => `${prev},${curr}`,
        "",
      )
      setValueToShow(valueConverted)
    } else {
      setValueToShow(dataLabel?.value)
    }
  }, [dataLabel, listTierQuery])

  return (
    <div className="flex items-center rounded bg-primary px-3 py-[8px]">
      {valueToShow && (
        <p className="mr-6 text-white">
          {dataLabel.applied}:&nbsp;{dataLabel.condition}&nbsp;
          {/* {valueToShow.replace(",", "")} */}
          {/* {new BigNumber(valueToShow.replace(",", "")).toFormat()} */}
          {new BigNumber(valueToShow).isNaN()
            ? valueToShow
            : new BigNumber(valueToShow.replace(",", "")).toFormat()}
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
