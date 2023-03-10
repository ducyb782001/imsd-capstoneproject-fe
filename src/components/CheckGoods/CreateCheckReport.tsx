import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createExportProduct } from "../../apis/export-product-module"
import { getListExportProduct } from "../../apis/product-module"
import { getListExportSupplier } from "../../apis/supplier-module"
import { getListStaff } from "../../apis/user-module"
import ConfirmPopup from "../ConfirmPopup"
import XIcons from "../icons/XIcons"
import PrimaryInput from "../PrimaryInput"
import PrimaryTextArea from "../PrimaryTextArea"
import Table from "../Table"
import ChooseStaffDropdown from "../ImportGoods/ChooseStaffDropdown"
import ChooseUnitImport from "../ImportGoods/ChooseUnitImport"
import SearchProductImportDropdown from "../ImportGoods/SearchProductImportDropdown"
import { useRouter } from "next/router"
import SecondaryBtn from "../SecondaryBtn"
import * as XLSX from "xlsx/xlsx"
import { createStockTakeProduct } from "../../apis/stocktake-product-module"
import ReasonDropdown from "./ReasonDropdown"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function CreateCheckReport() {
  const columns = [
    {
      Header: " ",
      columns: [
        {
          Header: "STT",
          accessor: (data: any, index) => <p>{index + 1}</p>,
        },
        {
          Header: "Ảnh",
          accessor: (data: any) => (
            <img
              src={data?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: "Mã sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productCode}</p>
          ),
        },
        {
          Header: "Tên sản phẩm",
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: "Đơn vị",
          accessor: (data: any) => (
            <ListUnitImport
              data={data}
              listProductImport={listProductImport}
              setListProductImport={setListProductImport}
            />
          ),
        },
        {
          Header: "Tồn chi nhánh",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[70px]">
              {data?.inStock}
            </div>
          ),
        },
        {
          Header: "Tồn thực tế",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[100px]">
              <ListActualStock
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
            </div>
          ),
        },
        {
          Header: "Lệch",
          accessor: (data: any) => (
            <div className="w-[70px]">
              <CountDeviated
                data={data}
                listProductImport={listProductImport}
              />
            </div>
          ),
        },
        {
          Header: "Lí do",
          accessor: (data: any) => (
            <div className="flex items-center w-[150px]">
              <ListNote
                data={data}
                listProductImport={listProductImport}
                setListProductImport={setListProductImport}
              />
            </div>
          ),
        },
        {
          Header: " ",
          accessor: (data: any, index) => (
            <div
              className="cursor-pointer"
              onClick={() => {
                let result = listChosenProduct?.filter(
                  (i, ind) => ind !== index,
                )
                setListChosenProduct(result)
              }}
            >
              <XIcons />
            </div>
          ),
        },
      ],
    },
  ]

  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductSearch, setListProductSearch] = useState<any>([])
  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()

  useEffect(() => {
    if (staffSelected) {
      setProductStockTakeObject({
        ...productStockTakeObject,
        createdId: staffSelected?.userId,
      })
    }
  }, [staffSelected])

  useEffect(() => {
    if (productChosen) {
      if (listChosenProduct.includes(productChosen)) {
        return
      }
      setListChosenProduct([...listChosenProduct, productChosen])
    }
  }, [productChosen])

  useEffect(() => {
    if (listChosenProduct?.length > 0) {
      const list = listChosenProduct.map((item) => {
        const currentStock = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.inStock
          ? undefined
          : item.inStock
        const measuredUnitId = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.measuredUnitId
          ? undefined
          : 0
        const note = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.note

        return {
          stocktakeId: 0,
          productId: item.productId,
          measuredUnitId: measuredUnitId,
          currentStock: currentStock,
          actualStock: 0,
          note: note,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      setProductStockTakeObject({
        ...productStockTakeObject,
        stocktakeNoteDetails: listProductImport,
      })
    }
  }, [listProductImport])

  const router = useRouter()
  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct()
        setListProductSearch(response?.data)
        return response?.data
      },
    },
  ])

  const createStockTakeMutation = useMutation(
    async (exportProduct) => {
      return await createStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm đơn kiểm hàng thành công!")
          router.push("/manage-check-good")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(data?.response?.data?.message[0])
          } else {
            toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
            toast.error(
              data?.response?.data?.message ||
                data?.message ||
                "Opps! Something went wrong...",
            )
          }
        }
      },
    },
  )

  const handleClickSaveBtn = (event) => {
    event?.preventDefault()
    toast.loading("Thao tác đang được xử lý ... ", {
      toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    })
    createStockTakeMutation.mutate({
      ...productStockTakeObject,
      stocktakeId: 0,
      stocktakeCode: "string",
    })
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Tạo phiếu kiểm hàng</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[190px]"
              title="Bạn chắc chắn muốn duyệt đơn?"
              handleClickSaveBtn={handleClickSaveBtn}
            >
              Tạo phiếu kiểm hàng
            </ConfirmPopup>
            <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
              Thoát
            </SecondaryBtn>
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">Thông tin đơn</h1>
          </div>
          <div className="mb-3 text-sm font-medium text-left text-gray">
            Ngày kiểm hàng: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <div className="w-64">
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={"Chọn nhân viên kiểm hàng"}
              showing={staffSelected}
              setShowing={setStaffSelected}
            />
          </div>

          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú"
            value={productStockTakeObject?.note}
            onChange={(e) => {
              setProductStockTakeObject({
                ...productStockTakeObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="!pb-20 mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm kiểm</h1>
        <SearchProductImportDropdown
          listDropdown={listProductSearch?.data}
          textDefault={"Nhà cung cấp"}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            data={listChosenProduct}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateCheckReport

function ListActualStock({ data, listProductImport, setListProductImport }) {
  const [actualStock, setActualStock] = useState()
  const handleOnChangeDiscount = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, actualStock: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[70px]"
      type="number"
      placeholder="--"
      value={actualStock ? actualStock : ""}
      onChange={(e) => {
        e.stopPropagation()
        setActualStock(e.target.value)
        handleOnChangeDiscount(e.target.value, data)
      }}
    />
  )
}

function CountDeviated({ data, listProductImport }) {
  const [deviated, setDeviated] = useState<any>(0)
  const handleSetPrice = () => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        const deviatedAmount = item.currentStock - item.actualStock
        setDeviated(deviatedAmount)
        return { ...item, amountDifferential: deviatedAmount }
      }
      return item
    })
  }

  useEffect(() => {
    handleSetPrice()
  }, [listProductImport])

  return (
    <div className="py-2 text-center text-white rounded-md bg-successBtn">
      {deviated}
    </div>
  )
}

function ListUnitImport({ data, listProductImport, setListProductImport }) {
  const [listDropdown, setListDropdown] = useState([])
  const [unitChosen, setUnitChosen] = useState<any>()
  const [defaultMeasuredUnit, setDefaultMeasuredUnit] = useState("")

  useEffect(() => {
    if (data) {
      setListDropdown(data?.measuredUnits)
      setDefaultMeasuredUnit(data?.defaultMeasuredUnit)
    }
  }, [data])

  useEffect(() => {
    if (unitChosen) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, measuredUnitId: unitChosen?.measuredUnitId }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [unitChosen])

  return (
    <ChooseUnitImport
      listDropdown={listDropdown}
      showing={unitChosen}
      setShowing={setUnitChosen}
      textDefault={defaultMeasuredUnit}
    />
  )
}

function ListNote({ data, listProductImport, setListProductImport }) {
  const [note, setNote] = useState<any>()

  useEffect(() => {
    if (note) {
      const list = listProductImport
      const newList = list.map((item) => {
        if (item.productId == data.productId) {
          return { ...item, note: note?.value }
        }
        return item
      })
      setListProductImport(newList)
    }
  }, [note])
  console.log(listProductImport)

  return <ReasonDropdown showing={note} setShowing={setNote} />
}
