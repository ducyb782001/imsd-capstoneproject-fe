import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
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
import { useQueries } from "react-query"
import {
  getListCity,
  getListDistrictByCode,
  getListWardByCode,
} from "../apis/search-country-module"
import CountryDropDown from "./CountryDropDown"
import useScanDetection from "../hooks/useScanDetection"
import { useTranslation } from "react-i18next"

const listNhaCungCapDemo = [
  { id: "1", name: "Chinh Bac" },
  { id: "2", name: "ABCD" },
]

function TestPage(props) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [isShowBelow, setIsShowBelow] = useState(false)
  const [searchBarCode, setSearchBarcode] = useState("No barcode scaned")

  const [newSupplier, setNewSupplier] = useState<any>()

  // Phan lien quna den api cac vung
  const [citySelected, setCitySelected] = useState<any>()
  const [districtSelected, setDistrictSelected] = useState<any>()
  const [wardSelected, setWardSelected] = useState<any>()

  const [listCity, setListCity] = useState([])
  const [listDistrict, setListDistrict] = useState([])
  const [listWard, setListWard] = useState([])

  useQueries([
    {
      queryKey: ["getListCity"],
      queryFn: async () => {
        const response = await getListCity()
        setListCity(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListDistrict", citySelected],
      queryFn: async () => {
        if (citySelected) {
          const response = await getListDistrictByCode(citySelected?.code)
          setListDistrict(response?.data?.districts)
          return response?.data
        }
      },
    },
    {
      queryKey: ["getListWards", districtSelected],
      queryFn: async () => {
        if (districtSelected) {
          const response = await getListWardByCode(districtSelected?.code)
          setListWard(response?.data?.wards)
          return response?.data
        }
      },
    },
  ])

  useEffect(() => {
    setDistrictSelected(undefined)
    setWardSelected(undefined)
    setNewSupplier({
      ...newSupplier,
      city: citySelected?.name,
    })
  }, [citySelected])

  // console.log("searchBarCode: ", searchBarCode)

  useScanDetection({
    onComplete: (code) => {
      setSearchBarcode(code)
    },
    minLength: 3,
  })

  useEffect(() => {
    setSearchBarcode(searchBarCode.replace("Shift", ""))
  }, [searchBarCode])

  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 mb-20">
      {/* {searchBarCode} */}
      {/* <div className="w-full h-[500px] skeleton-loading" /> */}
      <PrimaryBtn>ABCD</PrimaryBtn>
      <SecondaryBtn className="border-transparent hover:bg-transparent">
        XYZ
      </SecondaryBtn>
      <PrimaryBtn accessoriesLeft={<PlusIcon />} className="w-[200px]">
        Th??m s???n ph???m
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
        title="Ch???n nh?? cung c???p demo"
        listDropdown={listNhaCungCapDemo}
        textDefault={"Ch???n nh?? s???n xu???t"}
        showing={nhaCungCapSelected}
        setShowing={setNhaCungCapSelected}
      />
      <div className="mt-10">
        <PrimaryInputCheckbox
          accessoriesRight={
            <p className="text-xl">
              Click v??o ????y th?? n?? show ra v?? ?????y xu???ng d?????i
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
              <div className="h-[50px]">C???c n?? show th??m khi ???n</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* <BarChart /> */}
      <p> Bar code: </p>
      {/* <input onChange={(e) => setSearchBarcode(e.target.value)} /> */}
      {searchBarCode ? <div>No barcode</div> : searchBarCode}
      <div className="grid grid-cols-3 mt-4 mb-60 gap-7">
        <CountryDropDown
          title={"T???nh/Th??nh ph???"}
          listDropdown={listCity}
          textDefault={"Ch???n T???nh/Th??nh ph???"}
          showing={citySelected}
          setShowing={setCitySelected}
        />
        <CountryDropDown
          title={"Qu???n/Huy???n"}
          listDropdown={listDistrict}
          textDefault={"Ch???n Qu???n/Huy???n"}
          showing={districtSelected}
          setShowing={setDistrictSelected}
        />
        <CountryDropDown
          title={"Ph?????ng/X??"}
          listDropdown={listWard}
          textDefault={"Ch???n Ph?????ng/X??"}
          showing={wardSelected}
          setShowing={setWardSelected}
        />
      </div>
    </div>
  )
}

export default TestPage
