import React from "react"
import EditIcon from "./icons/EditIcon"
import PrimaryBtn from "./PrimaryBtn"

function EditDetail() {
  return (
    <div className="w-full">
      <EditIcon className="hidden md:block" />
      <PrimaryBtn className="block w-full md:hidden">Edit</PrimaryBtn>
    </div>
  )
}

export default EditDetail
