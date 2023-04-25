import BigNumber from "bignumber.js"
import React from "react"

function InfoDashboardCard({
  token = false,
  title = "",
  value = "",
  icon = null,
}) {
  return (
    <div className="px-3 py-4 font-semibold bg-white border rounded-xl border-grayLight drop-shadow-md">
      <p className="text-lg">{title}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[#28A745] text-2xl">
          {new BigNumber(value).toFormat(0)}
          {token && " đ"}
        </p>
        {!!icon && icon}
      </div>
    </div>
  )
}

export default InfoDashboardCard
