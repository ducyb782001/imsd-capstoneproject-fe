import React, { useEffect, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import PrimaryBtn from "../PrimaryBtn"
import SearchInput from "../SearchInput"
import ShowLabelBar from "../Filter/ShowLabelBar"
import Table from "../Table"
import Pagination from "../Pagination"
import Link from "next/link"
import ShowDetailIcon from "../icons/ShowDetailIcon"
import useDebounce from "../../hooks/useDebounce"
import { useQueries } from "react-query"
import ChooseStatusDropdown from "../ImportGoods/ChooseStatusDropdown"
import TableSkeleton from "../Skeleton/TableSkeleton"
import Switch from "react-switch"
import ChooseRoleDropdown from "./ChooseRoleDropDown"
import { getAllStaff } from "../../apis/user-module"
import SetStatusPopup from "./SetStatusPopup"

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "Mã nhân viên",
        accessor: (data: any) => <p>{data?.userCode}</p>,
      },
      {
        Header: "Ảnh",
        accessor: (data: any) => <p>{data?.img}</p>,
      },
      {
        Header: "Tên nhân viên",
        accessor: (data: any) => <p>{data?.userName}</p>,
      },
      {
        Header: "Số điện thoại",
        accessor: (data: any) => <p>{data?.phone}</p>,
      },
      {
        Header: "Chức vụ",
        accessor: (data: any) => (
          <div className="flex justify-self-start">
            <StatusDisplay data={data} />
          </div>
        ),
      },
      {
        Header: "Trạng thái hoạt động",
        accessor: (data: any) => <SetStatusPopup data={data} />,
      },
      {
        Header: " ",
        accessor: (data: any) => <DetailImportProduct data={data} />,
      },
    ],
  },
]

const status = [
  { id: "true", status: "Kích hoạt" },

  {
    id: "false",
    status: "Vô hiệu hóa",
  },
]

const role = [
  { id: 1, name: "Nhân viên bán hàng" },

  {
    id: 2,
    name: "Kiểm kho",
  },
]

function ManageStaff({ ...props }) {
  const [roleSelected, setRoleSelected] = useState<any>()
  const [statusSelected, setStatusSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParams, setQueryParams] = useState<any>({})
  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilter, setListFilter] = useState([])

  const [listStaffs, setListStaffs] = useState<any>()

  const [listImportProductExport, setListImportProductExport] = useState<any>()
  const [isLoadingListExport, setIsLoadingListExport] = useState(true)

  useEffect(() => {
    if (roleSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "roleId",
          applied: "Chức vụ",
          value: roleSelected?.id,
          id: roleSelected?.id,
        },
      ])
    }
  }, [roleSelected])
  useEffect(() => {
    if (statusSelected) {
      // Them logic check id cua type phai khac thi moi them vao list
      setListFilter([
        ...listFilter,
        {
          key: "status",
          applied: "Trạng thái",
          value: statusSelected?.status,
          id: statusSelected?.id,
        },
      ])
    }
  }, [statusSelected])

  //change queryParamsObj when change listFilter in one useEffect
  useEffect(() => {
    if (listFilter) {
      const queryObj = listFilter.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParams(queryObj)
    }
  }, [listFilter])

  const handleRemoveFilter = (itemIndex) => {
    const listRemove = listFilter.filter((i, index) => index !== itemIndex)
    setListFilter(listRemove)
  }

  useQueries([
    {
      queryKey: [
        "getListStaffs",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParams,
      ],
      queryFn: async () => {
        if (debouncedSearchValue) {
          const response = await getAllStaff({
            code: debouncedSearchValue,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListStaffs(response?.data)

          return response?.data
        } else {
          const response = await getAllStaff({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            ...queryParams,
          })
          setListStaffs(response?.data)
          setIsLoadingListExport(response?.data?.isLoading)

          //-----------

          return response?.data
        }
      },
    },
  ])

  // console.log(listStaffs)

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href={`/create-staff`}>
          <a>
            <PrimaryBtn
              className="max-w-[250px]"
              accessoriesLeft={<PlusIcon />}
            >
              Đăng ký nhân viên mới
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid items-center justify-between w-full gap-1 md:grid-cols-[60%_18%_22%] mb-4">
            <SearchInput
              placeholder="Tìm theo tên nhân viên, mã nhân viên, số điện thoại"
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />

            <ChooseRoleDropdown
              listDropdown={role}
              textDefault={"Chức vụ"}
              showing={roleSelected}
              setShowing={setRoleSelected}
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={"Trạng thái hoạt động"}
              showing={statusSelected}
              setShowing={setStatusSelected}
            />
          </div>
          <ShowLabelBar
            isExpandedLabelBar={true}
            listFilter={listFilter}
            handleRemoveFilter={handleRemoveFilter}
            appliedDate={undefined}
            dateRange={undefined}
            handleRemoveDatefilter={handleRemoveFilter}
          />
        </div>
        {isLoadingListExport ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={listStaffs?.data}
              />
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={listStaffs?.total}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ManageStaff

function StatusDisplay({ data }) {
  if (data?.state == 0) {
    return (
      //   <div className="w-32 mt-4 font-medium text-center text-white rounded-2xl bg-orange-50 border border-[#D69555]">
      <div className="w-[150] mt-4 font-medium text-center text-white bg-green-50 border border-green-500 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">Kiểm kho</h1>
        {/* <h1 className="m-2 ml-3 text-orange-500">Kiểm kho</h1> */}
      </div>
    )
  } else if (data?.state == 1) {
    return (
      <div className="w-[150] mt-4 font-medium text-center rounded-2xl bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">Nhân viên bán hàng</h1>
      </div>
    )
  } else if (data?.state == 2) {
    return (
      <div className="w-[150] mt-4 font-medium text-center text-white bg-green-50 border border-green-500 rounded-2xl">
        <h1 className="m-2 ml-3 text-green-500">Kiểm kho</h1>
      </div>
    )
  } else {
    return (
      //   <div className="w-32 mt-4 font-medium text-center text-white border border-red-500 rounded-2xl bg-red-50">
      <div className="w-[150] mt-4 font-medium text-center rounded-2xl bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">Nhân viên bán hàng</h1>
        {/* <h1 className="m-2 ml-3 text-red-500">Nhân viên bán hàng</h1> */}
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/edit-staff/${data?.userId}`}>
        <a className="w-full">
          <ShowDetailIcon />
        </a>
      </Link>
    </div>
  )
}
