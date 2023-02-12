import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"
import { variants } from "../lib/constants"
import BarChart from "./Chart/BarChart"
import DemoDropDown from "./DemoDropDown"
import DemoPopup from "./DemoPopup"
import PlusIcon from "./icons/PlusIcon"
import SearchIcon from "./icons/SearchIcon"
import PrimaryBtn from "./PrimaryBtn"
import PrimaryInput from "./PrimaryInput"
import PrimaryInputCheckbox from "./PrimaryInputCheckbox"
import PrimaryTextArea from "./PrimaryTextArea"
import SecondaryBtn from "./SecondaryBtn"
import useScanDetection from "use-scan-detection"

const listNhaCungCapDemo = [
  { id: "1", name: "Chinh Bac" },
  { id: "2", name: "ABCD" },
]

function TestPage(props) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [isShowBelow, setIsShowBelow] = useState(false)
  const [searchBarCode, setSearchBarcode] = useState("No barcode scaned")
  // console.log("searchBarCode: ", searchBarCode)

  // useScanDetection({
  //   onComplete: (code) => {
  //     console.log("Test: ", code)
  //   },
  //   minLength: 3,
  // })

  return (
    <div className="flex flex-col gap-4 mb-20">
      <PrimaryBtn>ABCD</PrimaryBtn>
      <SecondaryBtn className="border-transparent hover:bg-transparent">
        XYZ
      </SecondaryBtn>
      <PrimaryBtn accessoriesLeft={<PlusIcon />} className="w-[200px]">
        Thêm sản phẩm
      </PrimaryBtn>
      <PrimaryInput
        accessoriesLeft={<SearchIcon />}
        title="Primary input 1"
        placeholder="Primary input placeholder"
        accessoriesRight={<SearchIcon />}
      />
      <PrimaryInputCheckbox accessoriesLeft={"Text o ben tay trai"} />
      <PrimaryTextArea />
      <DemoPopup className="w-[300px]" />
      <DemoDropDown
        title="Chọn nhà cung cấp demo"
        listDropdown={listNhaCungCapDemo}
        textDefault={"Chọn nhà sản xuất"}
        showing={nhaCungCapSelected}
        setShowing={setNhaCungCapSelected}
      />
      <div className="mt-10">
        <PrimaryInputCheckbox
          accessoriesRight={
            <p className="text-xl">
              Click vào đây thì nó show ra và đẩy xuống dưới
            </p>
          }
          onClick={() => setIsShowBelow(!isShowBelow)}
        />
        <AnimatePresence initial={false}>
          {isShowBelow && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={variants}
              transition={{
                duration: 0.2,
              }}
            >
              <div className="h-[50px]">Cục nó show thêm khi ấn</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* <BarChart /> */}
      <p> Bar code: </p>
      {/* <input onChange={(e) => setSearchBarcode(e.target.value)} /> */}
      {searchBarCode ? <div>No barcode</div> : searchBarCode}
    </div>
  )
}

export default TestPage
