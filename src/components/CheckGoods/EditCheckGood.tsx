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
import DownloadIcon from "../icons/DownloadIcon"
import UploadIcon from "../icons/UploadIcon"
import * as XLSX from "xlsx/xlsx"
import {
  getDetailStockTakeProduct,
  updateStockTakeProduct,
} from "../../apis/stocktake-product-module"
import StockTakeSkeleton from "../Skeleton/StockTakeDetailSkeleton"

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function EditCheckReport() {
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
              listProductImport={listProductStockTake}
              setListProductImport={setListProductStockTake}
            />
          ),
        },
        {
          Header: "Tồn chi nhánh",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[70px]">
              <ListStock
                data={data}
                listProductImport={listProductStockTake}
                setListProductImport={setListProductStockTake}
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
              />
            </div>
          ),
        },
        {
          Header: "Tồn thực tế",
          accessor: (data: any) => (
            <div className="flex items-center max-w-[80px]">
              <ListActualStock
                data={data}
                listProductImport={listProductStockTake}
                setListProductImport={setListProductStockTake}
                autoUpdatePrice={autoUpdatePrice}
                setAutoUpdatePrice={setAutoUpdatePrice}
              />
            </div>
          ),
        },
        {
          Header: "Lệch",
          accessor: (data: any) => (
            <CountDeviated
              data={data}
              listProductImport={listProductStockTake}
              setListProductImport={setListProductStockTake}
              autoUpdatePrice={autoUpdatePrice}
            />
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
                // let listProduct = listProductImport?.filter(
                //   (i, ind) => ind !== index,
                // )
                // setListProductImport(listProduct)
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
  const [listProductStockTake, setListProductStockTake] = useState<any>([])
  const [listProductStockTakeCurrent, setListProductStockTakeCurrent] =
    useState<any>([])
  const [listProductExport, setListProductExport] = useState<any>([])
  const [productStockTakeObject, setProductStockTakeObject] = useState<any>()
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)

  useEffect(() => {
    if (staffSelected) {
      setProductStockTakeObject({
        ...productStockTakeObject,
        userId: staffSelected?.userId,
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
        const currentStock = listProductStockTake.find(
          (i) => i.productId == item.productId,
        )?.inStock
        const measuredUnitId = listProductStockTake.find(
          (i) => i.productId == item.productId,
        )?.measuredUnitId
        const stocktakeId = listProductStockTake.find(
          (i) => i.productId == item.productId,
        )?.actualStock

        const currentStockTake = listProductStockTakeCurrent.map((a) => {
          if (a.productId == item.productId) {
            return a.actualStock
          }
        })
        return {
          stocktakeId: stocktakeId,
          productId: item.productId,
          measuredUnitId: measuredUnitId,
          currentStock: currentStock,
          actualStock: currentStockTake[0],
          note: "",
        }
      })
      setListProductStockTake(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductStockTake) {
      setProductStockTakeObject({
        ...productStockTakeObject,
        stocktakeNoteDetails: listProductStockTake,
      })
    }
  }, [listProductStockTake])

  const router = useRouter()
  const { checkId } = router.query
  const [isLoadingReport, setIsLoadingReport] = useState(true)

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
        setListProductExport(response?.data)
        return response?.data
      },
    },
    {
      queryKey: ["getDetailStockTake"],
      queryFn: async () => {
        const response = await getDetailStockTakeProduct(checkId)
        setProductStockTakeObject(response?.data)
        setListProductStockTakeCurrent(response?.data?.stocktakeNoteDetails)
        const list = response?.data?.stocktakeNoteDetails.map((item) => {
          return item.product
        })
        setListChosenProduct(list)
        setListProductStockTake(response?.data?.stocktakeNoteDetails)
        setIsLoadingReport(response?.data?.isLoading)
        return response?.data
      },
      enabled: !!checkId,
    },
  ])
  console.log(listStaff)

  const updateStockTakeMutation = useMutation(
    async (exportProduct) => {
      return await updateStockTakeProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Chỉnh sửa đơn kiểm hàng thành công!")
          router.push("/draff-check-good/" + checkId)
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
    updateStockTakeMutation.mutate(productStockTakeObject)
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }

  return isLoadingReport ? (
    <StockTakeSkeleton />
  ) : (
    <div>
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Chỉnh sửa kiểm hàng</h1>
          </div>
          <div className="flex items-center justify-between gap-4">
            <ConfirmPopup
              className="!w-fit"
              classNameBtn="w-[180px]"
              title="Bạn chắc chắn muốn duyệt đơn?"
              handleClickSaveBtn={handleClickSaveBtn}
            >
              Lưu
            </ConfirmPopup>
            <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
              Thoát
            </SecondaryBtn>
          </div>
        </div>
        <div className="w-full p-6 mt-6 bg-white block-border">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-semibold">Thông tin phiếu</h1>
          </div>
          <div className="text-sm font-medium text-left text-gray mb-3">
            <p className="mb-3">Ngày kiểm hàng: </p>
            <PrimaryInput
              value={format(Date.now(), "dd/MM/yyyy HH:mm")}
              className="w-[150px] text-sm font-normal text-gray"
              readOnly={true}
            />
          </div>
          <p className="text-sm font-medium text-left text-gray mb-3">
            Nhân viên
          </p>
          <div className="w-64">
            <ChooseStaffDropdown
              listDropdown={listStaff}
              textDefault={productStockTakeObject?.createdBy?.userName}
              showing={staffSelected}
              setShowing={setStaffSelected}
            />
          </div>

          <PrimaryTextArea
            rows={7}
            className="mt-4"
            title="Ghi chú hóa đơn"
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
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm kiểm</h1>
        <SearchProductImportDropdown
          listDropdown={listProductExport?.data}
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

export default EditCheckReport

function ListStock({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
  const [currentStock, setCurrentStock] = useState()

  useEffect(() => {
    if (data) {
      // Bug chua su dung duoc gia co san de tinh toan
      setCurrentStock(data?.inStock)
    }
  }, [data])

  const handleOnChangePrice = (value, data) => {
    const list = listProductImport
    const newList = list.map((item) => {
      if (item.productId == data.productId) {
        return { ...item, currentStock: value }
      }
      return item
    })
    setListProductImport(newList)
  }

  return (
    <PrimaryInput
      className="w-[100px]"
      type="number"
      placeholder="---"
      value={currentStock ? currentStock : ""}
      onChange={(e) => {
        e.stopPropagation()
        setCurrentStock(e.target.value)
        handleOnChangePrice(e.target.value, data)
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function ListActualStock({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
  setAutoUpdatePrice,
}) {
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
      value={actualStock ? actualStock : ""}
      onChange={(e) => {
        e.stopPropagation()
        setActualStock(e.target.value)
        handleOnChangeDiscount(e.target.value, data)
        setAutoUpdatePrice(!autoUpdatePrice)
      }}
    />
  )
}

function CountDeviated({
  data,
  listProductImport,
  setListProductImport,
  autoUpdatePrice,
}) {
  const [deviated, setDeviated] = useState<any>()
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
    setListProductImport(newList)
  }

  return (
    <div
      className="py-2 text-center text-white rounded-md cursor-pointer bg-successBtn h-12"
      onClick={handleSetPrice}
    >
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
