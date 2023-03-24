import React from "react"
import ShowPasswordIcon from "./icons/ShowPasswordIcon"
import SecondaryBtn from "./SecondaryBtn"

function ShowDetail() {
  return (
    <div className="w-full">
      <ShowPasswordIcon className="hidden md:block" />
      <SecondaryBtn className="block w-full md:hidden">Details</SecondaryBtn>
    </div>
  )
}

export default ShowDetail
