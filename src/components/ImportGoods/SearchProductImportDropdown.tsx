import BigNumber from "bignumber.js"
import { motion } from "framer-motion"
import { appWithTranslation } from "next-i18next"
import React, { useEffect, useRef, useState } from "react"
import useScanDetection from "../../hooks/useScanDetection"
import { searchProduct } from "../../lib/search"
import SearchIcon from "../icons/SearchIcon"

function SearchProductImportDropdown({
  title = "",
  listDropdown,
  showing,
  setShowing,
  textDefault,
  placeholder,
}) {
  const node = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  useScanDetection({
    onComplete: (code) => {
      setSearchInput(code)
    },
    minLength: 13,
  })

  useEffect(() => {
    setSearchInput(searchInput.replace("Shift", ""))
  }, [searchInput])

  const listResult = searchProduct(searchInput, listDropdown)

  const toggleOpenMenu = () => {
    if (listDropdown?.length > 0) {
      toggleOpen(!isOpen)
    }
  }

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (node.current && node.current?.contains(e.target)) {
      return
    }
    toggleOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.2,
        delay: 0.05,
      },
      transitionEnd: {
        display: "none",
      },
    },
  }

  return (
    <motion.div className="relative text-[#4F4F4F]">
      <div ref={node}>
        {title && <p className="mb-1 text-sm font-bold text-gray">{title}</p>}

        <div className={`relative w-full`} onClick={() => toggleOpen(true)}>
          <div className="absolute top-3 left-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="w-full py-3 pl-10 pr-3 border rounded outline-none border-grayLight focus:border-primary hover:border-primary smooth-transform"
            placeholder={
              placeholder
                ? placeholder
                : "Tìm kiếm theo tên sản phẩm hoặc quét mã barcode"
            }
            value={searchInput ? searchInput : ""}
            onChange={(e) => {
              setSearchInput(e.target.value)
            }}
          />
        </div>
      </div>

      <motion.div
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={subMenuAnimate}
        className={`absolute right-0 w-full shadow-md mt-2`}
        style={{
          // position: "absolute",
          // top: 40,
          // right: 0,
          borderRadius: 5,
          backgroundColor: "#ECF1F4",
          transformOrigin: "50% -30px",
          zIndex: 1,
        }}
      >
        <div
          id="list-dropdown"
          className="smooth-transform z-50 flex w-full flex-col gap-1 bg-[#fff] pb-3 max-h-[250px] overflow-y-auto"
        >
          {listResult?.map((i, index) => (
            <DropDownItem key={index} data={i} setShowing={setShowing} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SearchProductImportDropdown

function DropDownItem({ data, setShowing }) {
  return (
    <div
      onClick={() => setShowing(data)}
      className="w-full flex justify-between px-4 py-3 text-sm cursor-pointer bg-opacity-20 hover:bg-[#EFEAFA] smooth-transform"
    >
      <div className="flex gap-2">
        <img
          src={data?.image || "/images/default-product-image.jpg"}
          alt="product-image"
          className="object-cover w-[40px] h-[40px] rounded-md"
        />
        <div className="max-w-[150px] md:max-w-[600px]">
          <p className="truncate-2-line">{data?.productName}</p>
          <p className="text-gray">
            {data?.productCode} ĐVT:
            <span className="text-blue"> {data?.defaultMeasuredUnit}</span>
          </p>
        </div>
      </div>
      <div className="text-end">
        <p>
          Giá nhập:{" "}
          {data?.costPrice ? new BigNumber(data?.costPrice).toFormat(0) : "0"} đ
        </p>
        <p className="text-blue">
          Tồn: {data?.inStock ? new BigNumber(data?.inStock).toFormat(0) : "0"}
        </p>
      </div>
    </div>
  )
}
