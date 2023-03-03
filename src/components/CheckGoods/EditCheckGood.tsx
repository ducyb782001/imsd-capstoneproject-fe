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

const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function EditCheckReport() {
  const data_fake = [
    {
      productCode: "AHC123",
      productName: "Bánh mì tươi",
      measuredUnitId: "Thùng",
      typeGood: "Bánh mì",
      stock: 12,
      realStock: 10,
      deviated: 2,
      note: "Hỏng do thời tiết",
    },
    {
      productCode: "AHC123",
      productName: "Bánh mì tươi",
      measuredUnitId: "Thùng",
      typeGood: "Bánh mì",
      stock: 12,
      realStock: 10,
      deviated: 2,
      note: "Hỏng do thời tiết",
    },
  ]
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
            <PrimaryInput
              value={data?.measuredUnitId}
              className="w-20"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Loại",
          accessor: (data: any) => (
            <PrimaryInput
              value={data?.typeGood}
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Tồn chi nhánh",
          accessor: (data: any) => (
            <div className="flex items-center gap-2">
              <PrimaryInput
                value={data?.stock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: "Tồn thực tế",
          accessor: (data: any) => (
            <div className="flex items-center gap-1">
              <PrimaryInput
                value={data?.realStock}
                className="w-16"
                readOnly={true}
              />
            </div>
          ),
        },
        {
          Header: "Lệch",
          accessor: (data: any) => (
            <PrimaryInput
              value={data?.deviated}
              className="w-16"
              readOnly={true}
            />
          ),
        },
        {
          Header: "Ghi chú",
          accessor: (data: any) => (
            <PrimaryInput value={data?.note} className="w-16" readOnly={true} />
          ),
        },
      ],
    },
  ]
  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [autoUpdatePrice, setAutoUpdatePrice] = useState(true)
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductExport, setListProductExport] = useState<any>([])
  const [productExportObject, setProductExportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

  useEffect(() => {
    if (staffSelected) {
      setProductExportObject({
        ...productExportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])
  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductExportObject({
        ...productExportObject,
        supplierId: nhaCungCapSelected?.supplierId,
      })
      setProductExportObject({
        ...productExportObject,
        state: 0,
      })
    }
  }, [nhaCungCapSelected])

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
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
          ? undefined
          : 0
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.costPrice
        const price = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.price

        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
          price: costPrice,
          measuredUnitId: listProductImport.find(
            (i) => i.productId == item.productId,
          )?.measuredUnitId
            ? undefined
            : 0,
        }
      })
      setListProductImport(list)
    }
  }, [listChosenProduct])

  useEffect(() => {
    if (listProductImport) {
      const price = listProductImport.reduce(
        (total, currentValue) =>
          new BigNumber(total).plus(currentValue.price || 0),
        0,
      )
      const priceSet = new BigNumber(price).toFormat()
      setTotalPriceSend(priceSet)
      setProductExportObject({
        ...productExportObject,
        exportOrderDetails: listProductImport,
        totalPrice: new BigNumber(price).toFixed(),
      })
    }
  }, [listProductImport])

  const totalPrice = () => {
    if (listProductImport?.length > 0) {
      const price = listProductImport.reduce(
        (total, currentValue) =>
          new BigNumber(total).plus(currentValue.price || 0),
        0,
      )
      return <div>{price} đ</div>
    } else {
      return <div>0 đ</div>
    }
  }

  const router = useRouter()
  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data)
        const supplier = await getListExportSupplier({})
        setListNhaCungCap(supplier?.data?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProduct"],
      queryFn: async () => {
        const response = await getListExportProduct()
        setProductExportObject({
          ...productExportObject,
          exportId: 0,
          state: 0,
          exportCode: "string",
        })
        setListProductExport(response?.data)
        return response?.data
      },
    },
  ])
  console.log(listChosenProduct)

  const createExportMutation = useMutation(
    async (exportProduct) => {
      return await createExportProduct(exportProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm đơn xuất hàng thành công!")
          router.push("/manage-export-goods")
        } else {
          if (typeof data?.response?.data?.message !== "string") {
            toast.error(data?.response?.data?.message[0])
          } else {
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
    createExportMutation.mutate(productExportObject)
  }
  const handleClickOutBtn = (event) => {
    router.push("/manage-check-good")
  }
  const handleExportCheckProduct = () => {
    const dateTime = Date().toLocaleString() + ""
    const worksheet = XLSX.utils.json_to_sheet(
      productExportObject?.listProductImport,
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "DataSheet" + dateTime + ".xlsx")
  }

  return (
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
            <h1 className="text-xl font-semibold">Thông tin đơn</h1>
          </div>
          <div className="text-sm font-medium text-left text-gray mb-3">
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
            title="Ghi chú hóa đơn"
            value={productExportObject?.note}
            onChange={(e) => {
              setProductExportObject({
                ...productExportObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">Thông tin sản phẩm xuất</h1>
        <div className="flex gap-2">
          <ImportExportButton
            onClick={handleExportCheckProduct}
            accessoriesLeft={<DownloadIcon />}
          >
            Xuất file
          </ImportExportButton>
          <ImportExportButton accessoriesLeft={<UploadIcon />}>
            Nhập file
          </ImportExportButton>
        </div>
        <SearchProductImportDropdown
          listDropdown={listProductExport?.data}
          textDefault={"Nhà cung cấp"}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <div className="mt-4 table-style">
          <Table pageSizePagination={10} columns={columns} data={data_fake} />
        </div>
      </div>
    </div>
  )
}

export default EditCheckReport

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
