import React, { useEffect, useState } from "react"
import { basePagination } from "../lib/pagination"
import SelectPageSizeDropDown from "./SelectPageSizeDropDown"
import { useTranslation } from "react-i18next"

function Pagination({
  totalItems,
  currentPage = 1,
  setCurrentPage,
  pageSize,
  setPageSize,
}) {
  const [totalPage, setTotalPage] = useState(1)
  const { t } = useTranslation()
  useEffect(() => {
    if (totalItems % pageSize == 0) {
      setTotalPage(Math.floor(totalItems / pageSize))
    } else if (totalItems % pageSize > 0) {
      setTotalPage(Math.ceil(totalItems / pageSize))
    }
  }, [totalItems, pageSize])

  useEffect(() => {
    if (pageSize) {
      setCurrentPage(1)
    }
  }, [pageSize])

  const pageRange = basePagination(currentPage, totalPage)

  const startList = pageSize * (currentPage - 1) + 1
  const endList = pageSize * (currentPage - 1) + pageSize

  return (
    <div className="flex flex-col items-center gap-8 mt-4 text-sm md:flex-row">
      <SelectPageSizeDropDown pageSize={pageSize} setPageSize={setPageSize} />

      <div className="flex items-center gap-[6px]">
        {pageRange?.map((i, index) => (
          <PageBtn
            currentPage={currentPage}
            value={i}
            key={index}
            setCurrentPage={setCurrentPage}
          />
        ))}
      </div>

      <div className="flex items-center justify-center h-8 px-2 border rounded border-grayLight">
        {startList} -&nbsp;
        {endList > totalItems ? totalItems : endList}
        &nbsp; {t("of")} {totalItems}
      </div>
    </div>
  )
}

export default Pagination

function PageBtn({ value, currentPage, setCurrentPage }) {
  const isActive = value == currentPage
  return (
    <div
      onClick={() => (value === "..." ? null : setCurrentPage(value))}
      className={`flex items-center justify-center w-8 h-8 text-sm border rounded cursor-pointer ${
        isActive == true
          ? "border-primary bg-primary text-white"
          : "bg-white border-[#EFEAFA] text-[#4F4F4F]"
      }`}
    >
      {value}
    </div>
  )
}
