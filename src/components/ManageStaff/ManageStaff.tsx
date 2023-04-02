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
import ChooseRoleDropdown from "./ChooseRoleDropDown"
import { getAllStaff } from "../../apis/user-module"
import SetStatusPopup from "./SetStatusPopup"
import { useTranslation } from "react-i18next"
import ShowDetail from "../ShowDetail"
import Page401 from "../401"

function ManageStaff() {
  const { t } = useTranslation()
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: t("staff_code"),
          accessor: (data: any) => <p>{data?.userCode || "---"}</p>,
        },
        {
          Header: t("image"),
          accessor: (data: any) => (
            <div className="w-[35px] h-[35px] rounded-xl">
              <img
                className="object-cover w-full h-full rounded-xl"
                src={data?.img || "/images/default-product-image.jpg"}
                alt="image-product"
              />
            </div>
          ),
        },
        {
          Header: t("staff_name"),
          accessor: (data: any) => (
            <p>{data?.userName ? data?.userName : "---"}</p>
          ),
        },
        {
          Header: t("phone_number"),
          accessor: (data: any) => <p>{data?.phone || "---"}</p>,
        },
        {
          Header: t("staff_position"),
          accessor: (data: any) => (
            <div className="flex justify-self-start">
              <RoleDisplay data={data} />
            </div>
          ),
        },
        {
          Header: t("status_staff"),
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
    { id: "true", status: t("active") },

    {
      id: "false",
      status: t("deactive"),
    },
  ]

  const role = [
    { id: 3, name: t("seller") },

    {
      id: 2,
      name: t("store_keeper"),
    },
  ]

  const [roleSelected, setRoleSelected] = useState<any>()
  const [statusSelected, setStatusSelected] = useState<any>()
  const [searchParam, setSearchParam] = useState<string>("")
  const [queryParamsRole, setQueryParamsRole] = useState<any>({})
  const [queryParamsStatus, setQueryParamsStatus] = useState<any>({})

  const debouncedSearchValue = useDebounce(searchParam, 500)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listFilterRole, setListFilterRole] = useState([])
  const [listFilterStatus, setListFilterStatus] = useState([])

  const [listStaffs, setListStaffs] = useState<any>()
  const [newList, setNewList] = useState([])
  const [isLoadingListExport, setIsLoadingListExport] = useState(true)

  useEffect(() => {
    if (roleSelected) {
      // Them logic check id cua nha cung cap phai khac thi moi them vao list
      setListFilterRole([
        {
          key: "roleId",
          applied: t("staff_position"),
          value: roleSelected?.name,
          id: roleSelected?.id,
        },
      ])
    }
  }, [roleSelected])
  useEffect(() => {
    if (statusSelected) {
      // Them logic check id cua type phai khac thi moi them vao list
      setListFilterStatus([
        {
          key: "status",
          applied: t("status"),
          value: statusSelected?.status,
          id: statusSelected?.id,
        },
      ])
    }
  }, [statusSelected])

  //change queryParamsRoleObj when change listFilterRole in one useEffect
  useEffect(() => {
    if (listFilterRole) {
      const queryObj = listFilterRole.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParamsRole(queryObj)
    }
  }, [listFilterRole])

  useEffect(() => {
    if (listFilterStatus) {
      const queryObj = listFilterStatus.reduce(
        (prev, curr) => ({ ...prev, [curr.key]: curr.id }),
        {},
      )
      setQueryParamsStatus(queryObj)
    }
  }, [listFilterStatus])

  const handleRemoveFilterRole = (itemIndex) => {
    const listRemove = listFilterRole.filter((i, index) => index !== itemIndex)
    setListFilterRole(listRemove)
  }

  const handleRemoveFilterStatus = (itemIndex) => {
    const listRemove = listFilterStatus.filter(
      (i, index) => index !== itemIndex,
    )
    setListFilterStatus(listRemove)
  }

  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData != "undefined") {
        setUserData(JSON.parse(userData))
      }
    }
  }, [])

  useQueries([
    {
      queryKey: [
        "getListStaffs",
        debouncedSearchValue,
        currentPage,
        pageSize,
        queryParamsRole,
        userData,
      ],
      queryFn: async () => {
        setIsLoadingListExport(true)

        const queryObj = {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          ...queryParamsRole,
          ...queryParamsStatus,
        }
        if (debouncedSearchValue) {
          queryObj["search"] = debouncedSearchValue
        }
        const response = await getAllStaff(queryObj)

        const newList = response?.data?.data.filter(
          (i) => userData?.email != i?.email,
        )

        setIsLoadingListExport(false)
        setListStaffs(response?.data)
        setNewList(newList)

        return response?.data
      },
      enabled: !!userData,
    },
  ])
  return userData?.roleId !== 1 ? (
    <Page401 />
  ) : (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2"></div>
        <Link href={`/create-staff`}>
          <a>
            <PrimaryBtn
              className="max-w-[250px]"
              accessoriesLeft={<PlusIcon />}
            >
              {t("create_new_staff")}
            </PrimaryBtn>
          </a>
        </Link>
      </div>
      <div className="mt-2 bg-white block-border">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 items-center justify-between w-full gap-1 md:grid-cols-[60%_18%_22%] mb-4">
            <SearchInput
              placeholder={t("search.searchStaff")}
              onChange={(e) => setSearchParam(e.target.value)}
              className="w-full"
            />

            <ChooseRoleDropdown
              listDropdown={role}
              textDefault={t("staff_position")}
              showing={roleSelected}
              setShowing={setRoleSelected}
            />

            <ChooseStatusDropdown
              listDropdown={status}
              textDefault={t("status_staff")}
              showing={statusSelected}
              setShowing={setStatusSelected}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <ShowLabelBar
              isExpandedLabelBar={true}
              listFilter={listFilterRole}
              handleRemoveFilter={handleRemoveFilterRole}
              appliedDate={undefined}
              dateRange={undefined}
              handleRemoveDatefilter={handleRemoveFilterRole}
            />
            <ShowLabelBar
              isExpandedLabelBar={true}
              listFilter={listFilterStatus}
              handleRemoveFilter={handleRemoveFilterStatus}
              appliedDate={undefined}
              dateRange={undefined}
              handleRemoveDatefilter={handleRemoveFilterStatus}
            />
          </div>
        </div>
        {isLoadingListExport ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="mt-4 table-style">
              <Table
                pageSizePagination={pageSize}
                columns={columns}
                data={newList}
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

function RoleDisplay({ data }) {
  const { t } = useTranslation()
  if (data?.roleName === "Owner") {
    return (
      <div className="w-[150] mt-4 font-medium text-center rounded-lg bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">{t("owner")}</h1>
      </div>
    )
  } else if (data?.roleName === "Storekeeper") {
    return (
      <div className="w-[150] mt-4 font-medium text-center text-white bg-green-50 border border-green-500 rounded-lg">
        <h1 className="m-2 ml-3 text-green-500">{t("store_keeper")}</h1>
      </div>
    )
  } else if (data?.roleName === "Seller") {
    return (
      <div className="w-[150] mt-4 font-medium text-center rounded-lg bg-orange-50 border border-[#D69555] text-[#D69555]">
        <h1 className="m-2 ml-3">{t("seller")}</h1>
      </div>
    )
  }
}

function DetailImportProduct({ data }) {
  console.log(data)

  return (
    <div className="flex items-center w-full gap-2">
      <Link href={`/edit-staff/${data?.userId}`}>
        <a className="w-full">
          <ShowDetail />
        </a>
      </Link>
    </div>
  )
}
