import React from "react"
import VIcon from "./icons/VIcon"

function StepBar({
  status = "new",
  createdDate = null,
  approvedDate = null,
  succeededDate = null,
}) {
  return (
    <div className="max-w-[668px] w-full mx-auto">
      <div className="grid w-full grid-cols-3">
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          Tạo đơn
        </p>
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          Duyệt đơn
        </p>
        <p className="text-[#999999] text-sm uppercase font-semibold text-center">
          Hoàn thành
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
            ) : (
              <SuccessIcon />
            )}
          </div>
          <div className="flex items-center justify-center">
            {status == "approved" ? <SuccessIcon /> : <StepIcon step={3} />}
          </div>
        </div>
        <div
          className={`h-[2px] w-[220px] absolute right-1/2 top-4 z-10 ${
            status == "new" ? " bg-[#D6DDE8]" : "bg-primary"
          }`}
        ></div>
        <div
          className={`h-[2px] w-[220px] absolute left-1/2 top-4 z-10 ${
            status == "approved" ? "bg-primary" : "bg-[#D6DDE8]"
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

function StepIcon({ step }) {
  return (
    <div className="flex items-center justify-center w-8 h-8 border-2 rounded-full border-[#D6DDE8] text-[#ADADAD] bg-[#F6F5FA]">
      {step}
    </div>
  )
}
