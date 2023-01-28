import React from "react"
import PlusIcon from "./icons/PlusIcon"
import SearchIcon from "./icons/SearchIcon"
import PrimaryBtn from "./PrimaryBtn"
import PrimaryInput from "./PrimaryInput"
import PrimaryInputCheckbox from "./PrimaryInputCheckbox"
import PrimaryTextArea from "./PrimaryTextArea"
import SecondaryBtn from "./SecondaryBtn"

function TestPage(props) {
  return (
    <div className="flex flex-col gap-4">
      <PrimaryBtn>ABCD</PrimaryBtn>
      <SecondaryBtn>XYZ</SecondaryBtn>
      <PrimaryBtn accessoriesLeft={<PlusIcon />} className="w-[200px]">
        Thêm sản phẩm
      </PrimaryBtn>
      <PrimaryInput
        accessoriesLeft={<SearchIcon />}
        title="Primary input 1"
        placeholder="Primary input placeholder"
      />
      <PrimaryInputCheckbox accessoriesLeft={"Text o ben tay trai"} />
      <PrimaryTextArea />
    </div>
  )
}

export default TestPage
