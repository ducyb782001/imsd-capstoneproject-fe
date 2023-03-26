import React from "react"
import XIcons from "./icons/XIcons"
import SecondaryBtn from "./SecondaryBtn"

function DeleteDetail() {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <XIcons />
      </div>
      <div className="block md:hidden">
        <SecondaryBtn>Delete</SecondaryBtn>
      </div>
    </div>
  )
}

export default DeleteDetail
