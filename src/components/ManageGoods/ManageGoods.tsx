import React, { useState } from "react"
import DatePicker from "../DatePicker"
import DemoDropDown from "../DemoDropDown"
import DownloadIcon from "../icons/DownloadIcon"
import PlusIcon from "../icons/PlusIcon"
import UploadIcon from "../icons/UploadIcon"
import PrimaryBtn from "../PrimaryBtn"
import SearchInput from "../SearchInput"
import SmallTitle from "../SmallTitle"
import { addDays, format } from "date-fns"
import ClockIcon from "../icons/ClockIcon"
import ShowLabelBar from "../Filter/ShowLabelBar"
import Table from "../Table"
import Pagination from "../Pagination"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import BigNumber from "bignumber.js"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã SP",
        accessor: (data: any) => <p>SP01</p>,
      },
      {
        Header: "Ảnh",
        accessor: (data: any) => (
          <div className="w-[35px] h-[35px] rounded-xl">
            <img
              className="object-cover rounded-xl"
              src="/images/image-default.png"
              alt="image-product"
            />
          </div>
        ),
      },
      {
        Header: "Tên sản phẩm",
        accessor: (data: any) => <p>Giỏ quà Tết 2023 TET200</p>,
      },
      {
        Header: "Nhà cung cấp",
        accessor: (data: any) => <p>Chính Bắc</p>,
      },
      {
        Header: "Loại",
        accessor: (data: any) => <p>Giỏ quà</p>,
      },
      {
        Header: "Tồn kho",
        accessor: (data: any) => <p>{new BigNumber(100).toFormat()}</p>,
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <p>Giỏ</p>,
      },
      {
        Header: "Ngày khởi tạo",
        accessor: (data: any) => <p>12/08/2022 15:30</p>,
      },
      {
        Header: " ",
        accessor: (data: any) => {
          return (
            <Link href={`/product-detail/${data?.id}`}>
              <a className="w-full">
                <ShowDetailIcon />
              </a>
            </Link>
          )
        },
      },
    ],
  },
]

const dataTest = [
  { id: 1, firstName: "Test 1", lastName: "Test last2" },
  { id: 2, firstName: "Test 1", lastName: "Test last2" },
  { id: 3, name: "Chinh Bac" },
  { id: 4, name: "Chinh Bac" },
  { id: 5, name: "ABCD" },
  { id: 6, name: "Chinh Bac" },
  { id: 7, name: "Chinh Bac" },
]

const listNhaCungCapDemo = [
  { id: "1", name: "Chinh Bac" },
  { id: "2", name: "ABCD" },
]

function ManageGoods({ ...props }) {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>()
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ])
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const listFilter = [
    {
      applied: "Orders",
      condition: "Equals",
      queryParamKey: "orders_0",
      value: "23",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <ImportExportButton accessoriesLeft={<DownloadIcon />}>
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <PrimaryBtn className="max-w-[200px]" accessoriesLeft={<PlusIcon />}>
          Thêm sản phẩm
        </PrimaryBtn>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col gap-4">
          <div className="grid items-center justify-between w-full gap-4 md:grid-cols-40202020">
            <SearchInput
              placeholder="Tìm kiếm theo tên/ mã sản phẩm"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />
            <DemoDropDown
              listDropdown={listNhaCungCapDemo}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <DemoDropDown
              listDropdown={listNhaCungCapDemo}
              textDefault={"Loại sản phẩm"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
            <DatePicker dateRange={dateRange} setDateRange={setDateRange}>
              <div className="flex items-center w-full h-full gap-2 px-3 border rounded cursor-pointer smooth-transform hover:border-primary border-grayLight">
                <ClockIcon /> <span>-</span>
                <p className="text-[#4F4F4F]">Ngày khởi tạo</p>
              </div>
            </DatePicker>
          </div>
          <ShowLabelBar
            isExpandedLabelBar={true}
            listFilter={listFilter}
            handleRemoveFilter={undefined}
            appliedDate={undefined}
            dateRange={undefined}
            handleRemoveDatefilter={undefined}
          />
        </div>

        {/* Table */}
        <div className="mt-4 table-style">
          {/* {data && ( */}
          <Table
            pageSizePagination={pageSize}
            columns={columns}
            data={dataTest}
          />
          {/* )} */}
        </div>
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={46}
        />
      </div>
    </div>
  )
}

export default ManageGoods

function ImportExportButton({
  accessoriesLeft,
  children,
  onClick = null,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`text-base text-primary max-w-[120px] px-2 py-3 flex gap-2 items-center ${className}`}
    >
      {accessoriesLeft && <div>{accessoriesLeft}</div>}
      {children}
    </button>
  )
}
