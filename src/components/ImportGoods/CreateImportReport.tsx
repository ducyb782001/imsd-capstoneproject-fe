import React, { useState } from "react"
import { useQueries } from "react-query"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import InfoIcon from "../icons/InfoIcon"
import XIcons from "../icons/XIcons"
import ChooseSupplierDropdown from "../ManageGoods/ChooseSupplierDropdown"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import SecondaryBtn from "../SecondaryBtn"
import StepBar from "../StepBar"
import Table from "../Table"
import Tooltip from "../ToolTip"
import AddProductPopup from "./AddProductPopup"
import ChooseStaffDropdown from "./ChooseStaffDropdown"
import ChooseUnitImport from "./ChooseUnitImport"
import SearchProductImportDropdown from "./SearchProductImportDropdown"

function CreateImportReport() {
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [listSupplier, setListSupplier] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([1, 2, 3, 4, 5])

  useQueries([
    {
      queryKey: ["getListSupplier"],
      queryFn: async () => {
        const response = await getListExportSupplier({})
        setListSupplier(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const response = await getListStaff({})
        setListStaff(response?.data)
        return response?.data
      },
    },
  ])

  return (
    <div>
      <div className="grid gap-5 grid-cols md: grid-cols-7525">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Tạo hóa đơn nhập hàng</h1>
            <SecondaryBtn className="max-w-[120px]">Thoát</SecondaryBtn>
          </div>
          <div className="flex justify-center mt-6">
            <StepBar />
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-xl font-semibold">Chọn nhà cung cấp</h1>
              <Tooltip content="Chọn nhà cung cấp để hiển thị mặt hàng tương ứng">
                <InfoIcon />
              </Tooltip>
            </div>
            <ChooseSupplierDropdown
              listDropdown={listSupplier}
              textDefault={"Nhà cung cấp"}
              showing={nhaCungCapSelected}
              setShowing={setNhaCungCapSelected}
            />
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày nhập hàng: 26/01/2023
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <ChooseStaffDropdown
            listDropdown={listStaff?.data}
            textDefault={"Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
          />
          <PrimaryTextArea rows={4} className="mt-2" title="Ghi chú hóa đơn" />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <SearchProductImportDropdown
          listDropdown={listStaff?.data}
          textDefault={"Nhà cung cấp"}
          showing={nhaCungCapSelected}
          setShowing={setNhaCungCapSelected}
        />
        <AddProductPopup className="mt-4" />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <SummaryCreateImportOrder />
        <ConfirmPopup
          classNameBtn="bg-successBtn border-successBtn active:bg-greenDark mt-4"
          title="Bạn có chắc chắn muốn tạo phiếu nhập hàng không?"
          // handleClickSaveBtn={handleClickSaveBtn}
        >
          Tạo hóa đơn nhập hàng
        </ConfirmPopup>
      </div>
    </div>
  )
}

export default CreateImportReport

const columns = [
  {
    Header: " ",
    columns: [
      {
        Header: "STT",
        accessor: (index) => <p>{index}</p>,
      },
      {
        Header: "Ảnh",
        accessor: (data: any) => <p>ảnh</p>,
      },
      {
        Header: "Tên sản phẩm",
        accessor: (data: any) => (
          <p className="truncate-2-line max-w-[100px]">
            Giỏ quà tết 2023 lalallala oh my god
          </p>
        ),
      },
      {
        Header: "SL nhập",
        accessor: (data: any) => <ListQuantitiveImport />,
      },
      {
        Header: "Đơn vị",
        accessor: (data: any) => <ListUnitImport />,
      },
      {
        Header: "Đơn giá",
        accessor: (data: any) => (
          <div className="flex items-center gap-2">
            <ListPriceImport />
            <p>đ</p>
          </div>
        ),
      },
      {
        Header: "Chiết khấu",
        accessor: (data: any) => (
          <div className="flex items-center gap-1">
            <ListDiscountImport />
            <p>%</p>
          </div>
        ),
      },
      {
        Header: "Thành tiền",
        accessor: (data: any) => <p>2000000000</p>,
      },
      {
        Header: " ",
        accessor: (data: any) => (
          <div className="cursor-pointer">
            <XIcons />
          </div>
        ),
      },
    ],
  },
]

function SummaryCreateImportOrder() {
  return (
    <div className="grid grid-cols-2 p-6 border rounded border-grayBorder gap-y-1">
      <h1 className="text-xl font-semibold">Tổng kết</h1>
      <div />
      <div>Số lượng</div>
      <div>0</div>
      <div>Tổng tiền</div>
      <div>0</div>
      <div>Chiết khấu</div>
      <div>0</div>
      <div>Chi phí nhập hàng</div>
      <input
        type="text"
        defaultValue={0}
        className="w-[100px] border rounded outline-none border-grayLight focus:border-primary hover:border-primary smooth-transform"
        // onChange={(e) => {
        //   setSearchInput(e.target.value)
        // }}
      />
      <div>Tiền cần trả</div>
      <div>0</div>
      <div>Đã thanh toán cho NCC</div>
      <input
        type="text"
        defaultValue={0}
        className="w-[100px] border rounded outline-none border-grayLight focus:border-primary hover:border-primary smooth-transform"
        // onChange={(e) => {
        //   setSearchInput(e.target.value)
        // }}
      />
      <div>Còn phải trả</div>
      <div>0</div>
    </div>
  )
}

function ListQuantitiveImport() {
  return <PrimaryInput className="w-[60px]" type="number" placeholder="0" />
}

function ListPriceImport() {
  return <PrimaryInput className="w-[80px]" type="number" placeholder="---" />
}

function ListDiscountImport() {
  return <PrimaryInput className="w-[50px]" type="number" placeholder="0" />
}

function ListUnitImport() {
  return (
    <ChooseUnitImport
      listDropdown={[
        { id: 1, categoryName: "Loc" },
        { id: 2, categoryName: "Goi" },
      ]}
      showing={undefined}
      setShowing={undefined}
      textDefault={""}
    />
  )
}
