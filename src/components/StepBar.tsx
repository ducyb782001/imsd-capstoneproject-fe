import React from "react"
import VIcon from "./icons/VIcon"
import XIcons from "./icons/XIcons"
import { useTranslation } from "react-i18next"

function StepBar({
  status = "new",
  createdDate = null,
  approvedDate = null,
  succeededDate = null,
}) {
  const { t } = useTranslation()
  return (
    <div className="max-w-[668px] w-full mx-auto">
      <div className="grid w-full grid-cols-3">
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          {t("create_report")}
        </p>
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          {t("approve_report")}
        </p>
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          {t("final")}
        </p>
      </div>
      <div className="relative">
        <div className="relative z-20 grid w-full grid-cols-3 mt-3">
          <div className="flex items-center justify-center">
            {status == "new" ? <ActiveIcon /> : <SuccessIcon />}
          </div>
          <div className="flex items-center justify-center">
            {status == "pending" ? (
              <ActiveIcon />
            ) : status === "new" ? (
              <StepIcon step={2} />
            ) : status === "deny" ? (
              <DenyIcon />
            ) : (
              <SuccessIcon />
            )}
          </div>
          <div className="flex items-center justify-center">
            {status == "succeed" ? (
              <SuccessIcon />
            ) : status === "approved" ? (
              <ActiveIcon />
            ) : (
              <StepIcon step={3} />
            )}
          </div>
          {/* <div className="flex items-center justify-center">
            {status == "succeed" ? <SuccessIcon /> : ""}
          </div> */}
        </div>
        <div
          className={`h-[2px] w-[220px] absolute right-1/2 top-4 z-10 ${
            status == "new" ? " bg-[#D6DDE8]" : "bg-primary"
          }`}
        ></div>
        <div
          className={`h-[2px] w-[190px] md:w-[220px] absolute left-1/2 top-4 z-10 ${
            status == "succeed" || status == "approved"
              ? "bg-primary"
              : "bg-[#D6DDE8]"
          }`}
        ></div>
      </div>
      <div className="grid grid-cols-3 mt-3">
        <p className={`text-center text-sm text-grayDark`}>{createdDate}</p>
        <p
          className={`text-center text-sm ${
            status == "new" ? "text-gray" : "text-grayDark"
          }`}
        >
          {approvedDate}
        </p>
        <p
          className={`text-center text-sm ${
            status == "approved" ? "text-grayDark" : "text-gray"
          }`}
        >
          {succeededDate}
        </p>
      </div>
    </div>
  )
}

export default StepBar

function ActiveIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full border-primary bg-[#F6F5FA] ">
      <div className="w-[10px] h-[10px] rounded-full bg-primary"></div>
    </div>
  )
}

function SuccessIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
      <VIcon color="#ffffff" />
    </div>
  )
}

function DenyIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#CB3A31]">
      <XIcons color="#ffffff" />
    </div>
  )
}

function StepIcon({ step }) {
  return (
    <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full border-[#D6DDE8] text-[#ADADAD] bg-[#F6F5FA]">
      {step}
    </div>
  )
}
