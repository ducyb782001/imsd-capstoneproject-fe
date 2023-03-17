import BigNumber from "bignumber.js"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useMutation, useQueries } from "react-query"
import { toast } from "react-toastify"
import { createImportProduct } from "../../apis/import-product-module"
import { getListExportProductBySupplier } from "../../apis/product-module"
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
import AddChooseSupplierDropdown from "../ManageGoods/AddChooseSupplierDropdown"
import ChooseImportReportDropdown from "./ChooseImportReportDropdown"
import SmallTitle from "../SmallTitle"
import { useTranslation } from "react-i18next"
import SecondaryBtn from "../SecondaryBtn"
const TOAST_CREATED_PRODUCT_TYPE_ID = "toast-created-product-type-id"

function DraffReturnReport() {
  const { t } = useTranslation()

  const product_fake = [
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      measuredUnits: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
    {
      productCode: "SP01",
      productName: "Giỏ quà tết 2023",
      measuredUnitId: "Giỏ",
      measuredUnits: "Giỏ",
      category: "Giỏ quà",
      returnAmount: 200,
      price: 10000,
      costPrice: 2000000,
    },
  ]
  const import_fake = [
    {
      importCode: "NAHA01",
    },
    {
      importCode: "NAHA02",
    },
    {
      importCode: "NAHA03",
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
          Header: t("image"),
          accessor: (data: any) => (
            <img
              src={data?.product?.image || "/images/default-product-image.jpg"}
              alt="product-image"
              className="object-cover w-[40px] h-[40px] rounded-md"
            />
          ),
        },
        {
          Header: t("product_code"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">
              {/* {data?.product?.productCode} */}
              {data?.productCode}
            </p>
          ),
        },
        {
          Header: t("product_name"),
          accessor: (data: any) => (
            <p className="truncate-2-line max-w-[100px]">{data?.productName}</p>
          ),
        },
        {
          Header: t("unit"),
          accessor: (data: any) => (
            <div>{data?.measuredUnitId ? data?.measuredUnitId : "---"}</div>
          ),
        },
        {
          Header: t("type.type"),
          accessor: (data: any) => (
            <div>{data?.category ? data?.category : "---"}</div>
          ),
        },
        {
          Header: t("return_amount"),
          accessor: (data: any) => (
            <div>{data?.returnAmount ? data?.returnAmount : "---"}</div>
          ),
        },
        {
          Header: t("price"),
          accessor: (data: any) => (
            <p className="text-center">
              {new BigNumber(data.price).toFormat(0)} đ
            </p>
          ),
        },
        {
          Header: t("total_price"),
          accessor: (data: any) => (
            <p>{new BigNumber(data.costPrice).toFormat(0)} đ</p>
          ),
        },
      ],
    },
  ]

  const [nhaCungCapSelected, setNhaCungCapSelected] = useState<any>()
  const [listNhaCungCap, setListNhaCungCap] = useState<any>()
  const [staffSelected, setStaffSelected] = useState<any>()
  const [listStaff, setListStaff] = useState<any>()
  const [listChosenProduct, setListChosenProduct] = useState([])
  const [productChosen, setProductChosen] = useState<any>()
  const [listProductImport, setListProductImport] = useState<any>([])
  const [listProductBySupplierImport, setListProductBySupplierImport] =
    useState<any>([])
  const [productImportObject, setProductImportObject] = useState<any>()
  const [totalPriceSend, setTotalPriceSend] = useState<any>()
  useEffect(() => {
    if (staffSelected) {
      setProductImportObject({
        ...productImportObject,
        userId: staffSelected?.userId,
      })
    }
  }, [staffSelected])
  useEffect(() => {
    if (nhaCungCapSelected) {
      setProductImportObject({
        ...productImportObject,
        supplierId: nhaCungCapSelected?.supplierId,
      })
      setProductImportObject({
        ...productImportObject,
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
    if (listChosenProduct.length > 0) {
      const list = listChosenProduct.map((item) => {
        const discount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.discount
        const amount = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.amount
        const costPrice = listProductImport.find(
          (i) => i.productId == item.productId,
        )?.costPrice

        return {
          productId: item.productId,
          amount: amount,
          costPrice: costPrice,
          discount: discount,
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
      const price = listProductImport.reduce((accumulator, currentProduct) => {
        const cost = new BigNumber(currentProduct.costPrice || 0).times(
          currentProduct.amount || 0,
        )
        if (currentProduct.discount) {
          const discountPrice = new BigNumber(currentProduct.amount || 0)
            .multipliedBy(currentProduct.costPrice || 0)
            .multipliedBy(currentProduct.discount || 0)
            .dividedBy(100)
          return accumulator.plus(cost).minus(discountPrice)
        } else {
          return accumulator.plus(cost)
        }
      }, new BigNumber(0))
      setTotalPriceSend(price)
      setProductImportObject({
        ...productImportObject,
        importOrderDetails: listProductImport,
        totalCost: new BigNumber(price).toFixed(),
      })
    }
  }, [listProductImport])

  const createImportMutation = useMutation(
    async (importProduct) => {
      return await createImportProduct(importProduct)
    },
    {
      onSuccess: (data, error, variables) => {
        if (data?.status >= 200 && data?.status < 300) {
          toast.dismiss(TOAST_CREATED_PRODUCT_TYPE_ID)
          toast.success("Thêm đơn nhập hàng thành công")
          router.push("/manage-import-goods")
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
    createImportMutation.mutate(productImportObject)
  }

  const router = useRouter()
  useQueries([
    {
      queryKey: ["getListStaff"],
      queryFn: async () => {
        const staff = await getListStaff()
        setListStaff(staff?.data?.data)
        const supplier = await getListExportSupplier({})
        setListNhaCungCap(supplier?.data?.data)
        return staff?.data?.data
      },
    },
    {
      queryKey: ["getListProductBySupplier", nhaCungCapSelected],
      queryFn: async () => {
        if (nhaCungCapSelected) {
          const response = await getListExportProductBySupplier(
            nhaCungCapSelected.supplierId,
          )
          setProductImportObject({
            ...productImportObject,
            supplierId: nhaCungCapSelected.supplierId,
            importId: 0,
            state: 0,
          })
          setListProductBySupplierImport(response?.data)

          return response?.data
        }
      },
    },
  ])
  const handleClickCancelBtn = (event) => {
    // toast.loading(t("operation_process"), {
    //   toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    // })
    // event?.preventDefault()
    // cancelImportMutation.mutate(productImport?.importId)
    router.push("/return-report-detail/" + 2005)
  }

  const handleClickOutBtn = () => {
    router.push("/manage-return-good")
  }
  const handleClickApproveBtn = async (event) => {
    // toast.loading(t("operation_process"), {
    //   toastId: TOAST_CREATED_PRODUCT_TYPE_ID,
    // })
    // event?.preventDefault()
    // await approveImportMutation.mutate(productImport?.importId)
    router.push("/return-good-pending/" + 2005)
  }
  console.log(productImportObject)

  return (
    <div>
      <div className="grid grid-cols md: grid-cols-7525 gap-4">
        <div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold">#TAHA201</h1>
              <div className="px-4 py-1 bg-[#F5E6D8] border border-[#D69555] text-[#D69555] rounded-2xl">
                {t("wait_accept_import")}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <SecondaryBtn className="w-[120px]" onClick={handleClickOutBtn}>
                {t("exit")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[60px] !bg-transparent text-cancelBtn !border-cancelBtn hover:!bg-[#ED5B5530]"
                title={t("cancel_confirm_import")}
                handleClickSaveBtn={handleClickCancelBtn}
              >
                {t("cancel")}
              </ConfirmPopup>
              <SecondaryBtn
                className="w-[100px] !border-blue hover:bg-[#3388F730] text-blue active:bg-blueDark active:border-blueDark "
                onClick={() => {
                  router.push("/edit-return-good/" + 2005)
                }}
              >
                {t("edit_import")}
              </SecondaryBtn>
              <ConfirmPopup
                className="!w-fit"
                classNameBtn="w-[120px]"
                title={t("confirm_import")}
                handleClickSaveBtn={handleClickApproveBtn}
              >
                {t("approve")}
              </ConfirmPopup>
            </div>
          </div>
          <div className="w-full p-6 mt-6 bg-white block-border">
            <SmallTitle>Thông tin nhà cung cấp, mã đơn trả</SmallTitle>
            <div className="mt-4">
              <AddChooseSupplierDropdown
                title="Nhà cung cấp"
                listDropdown={listNhaCungCap}
                textDefault={"Nhà cung cấp"}
                showing={nhaCungCapSelected}
                setShowing={setNhaCungCapSelected}
              />
            </div>
            <div className="mt-4">
              <ChooseImportReportDropdown
                title="Đơn trả"
                listDropdown={import_fake}
                textDefault={"Mã đơn trả"}
                showing={productChosen}
                setShowing={setProductChosen}
              />
            </div>
          </div>
        </div>
        <div className="bg-white block-border">
          <h1 className="text-xl font-semibold text-center">
            Thông tin bổ sung
          </h1>
          <div className="text-sm font-medium text-center text-gray">
            Ngày trả hàng: {format(Date.now(), "dd/MM/yyyy")}
          </div>
          <div className="mt-3 text-sm font-bold text-gray">Nhân viên</div>
          <ChooseStaffDropdown
            listDropdown={listStaff}
            textDefault={"Chọn nhân viên"}
            showing={staffSelected}
            setShowing={setStaffSelected}
          />
          <PrimaryTextArea
            rows={4}
            className="mt-2"
            title="Ghi chú hóa đơn"
            onChange={(e) => {
              setProductImportObject({
                ...productImportObject,
                note: e.target.value,
              })
            }}
          />
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <h1 className="mb-4 text-xl font-semibold">
          Thông tin sản phẩm nhập vào
        </h1>
        <SearchProductImportDropdown
          listDropdown={listProductBySupplierImport?.data}
          textDefault={"Nhà cung cấp"}
          showing={productChosen}
          setShowing={setProductChosen}
        />
        <div className="mt-4 table-style">
          <Table
            pageSizePagination={10}
            columns={columns}
            // data={listChosenProduct}
            data={product_fake}
          />
        </div>
        <div className="flex items-center justify-end gap-5 mt-6">
          <div className="text-base font-semibold">
            Tổng giá trị đơn hàng: {new BigNumber(totalPriceSend).toFormat(0)} đ
          </div>
        </div>
      </div>
    </div>
  )
}

export default DraffReturnReport
