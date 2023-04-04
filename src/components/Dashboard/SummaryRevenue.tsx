import BigNumber from "bignumber.js"
import React, { useState } from "react"
import { useQuery } from "react-query"
import { getDashboardByTime } from "../../apis/dashboard-module"
import NewCancelDashboardIcon from "../icons/NewCancelDashboardIcon"
import NewOrdersDashboardIcon from "../icons/NewOrdersDashboardIcon"
import NewReturnDashboardIcon from "../icons/NewReturnDashboardIcon"
import ProfitDashboardIcon from "../icons/ProfitDashboardIcon"
import UserIcon from "../icons/UserIcon"
import DashboardCardSkeleton from "../Skeleton/DashboardCardSkeleton"
import SmallTitle from "../SmallTitle"
import RevenueTimeDropdown from "./RevenueTimeDropdown"
import { useTranslation } from "react-i18next"

function SummaryRevenue() {
  const { t } = useTranslation()

  const [timeSelected, setTimeSelected] = useState<any>({
    key: "today",
    value: t("today"),
  })

  const { data, isLoading } = useQuery({
    queryKey: ["getDashboardByTime", timeSelected.key],
    queryFn: async () => {
      if (timeSelected.key) {
        const response = await getDashboardByTime({
          timeperiod: timeSelected.key,
        })
        return response?.data
      }
    },
  })

  return (
    <div className="mt-6 bg-white block-border">
      <div className="flex items-center justify-between">
        <SmallTitle>{t("revenue_of_day")}</SmallTitle>
        <RevenueTimeDropdown
          listDropdown={[
            {
              key: "today",
              value: t("today"),
            },
            {
              key: "yesterday",
              value: t("yesterday"),
            },
            {
              key: "thisweek",
              value: t("thisweek"),
            },
            {
              key: "thismonth",
              value: t("thismonth"),
            },
          ]}
          showing={timeSelected}
          setShowing={setTimeSelected}
          textDefault={"Select time"}
        />
      </div>
      {isLoading ? (
        <SummaryRevenueSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4">
          <RevenueDashboardCard
            title={t("revenue")}
            value={data?.profit}
            token={true}
            icon={<ProfitDashboardIcon />}
          />
          <RevenueDashboardCard
            title={t("new_order")}
            value={data?.newOrders}
            icon={<NewOrdersDashboardIcon />}
          />
          <RevenueDashboardCard
            title={t("return_order")}
            value={data?.newReturns}
            icon={<NewReturnDashboardIcon />}
          />
          <RevenueDashboardCard
            title={t("cancel_order")}
            value={data?.cancelOrders}
            icon={<NewCancelDashboardIcon />}
          />
        </div>
      )}
    </div>
  )
}

export default SummaryRevenue

function SummaryRevenueSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  )
}

function RevenueDashboardCard({
  token = false,
  title = "",
  value = "",
  icon = null,
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-4 font-semibold bg-white border rounded-xl border-grayLight drop-shadow-md">
      {!!icon && icon}
      <div>
        <p className="text-lg">{title}</p>
        <p className="text-[#28A745] text-xl mt-1">
          {new BigNumber(value).toFormat()}
          {token && " đ"}
        </p>
      </div>
    </div>
  )
}
