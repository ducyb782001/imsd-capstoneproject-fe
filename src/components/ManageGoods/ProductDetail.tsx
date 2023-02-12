import React, { useState } from "react"
import SmallTitle from "../SmallTitle"
import BigNumber from "bignumber.js"
import format from "date-fns/format"
import { useQueries } from "react-query"
import { getProductDetail } from "../../apis/product-module"
import { useRouter } from "next/router"
import { formatISO } from "date-fns"

function ProductDetail(props) {
  const [isCreateWarehouse, setIsCreateWarehouse] = useState(false)
  const [isAdditionalUnit, setIsAdditionalUnit] = useState(false)
  const [listUnits, setListUnits] = useState([])
  const [newType, setNewType] = useState<string>("")
  const [newDetail, setNewDetail] = useState<string>("")
  const [detailProduct, setDetailProduct] = useState<any>()
  const router = useRouter()
  const handleAddNewUnit = () => {
    if (newType && newDetail) {
      setListUnits([
        ...listUnits,
        {
          type: newType,
          detail: newDetail,
        },
      ])
      setNewType("")
      setNewDetail("")
    }
  }
  const { productId } = router.query
  useQueries([
    {
      queryKey: ["getProductDetail", productId],
      queryFn: async () => {
        if (productId) {
          const response = await getProductDetail(productId)
          setDetailProduct(response?.data)
          return response?.data
        }
      },
    },
  ])

  const dateNow = new Date()

  return (
    <div>
      <h1 className="text-3xl font-medium">{detailProduct?.productName}</h1>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Thông tin sản phẩm</SmallTitle>
        <div className="grid mt-4 md:grid-cols-433">
          <div className="grid grid-cols-2 gap-y-1">
            <ProductInfo
              title="Mã sản phẩm"
              data={detailProduct?.productCode}
            />
            <ProductInfo
              title="Nhà cung cấp"
              data={detailProduct?.supplier?.supplierName}
            />
            <ProductInfo
              title="Loại sản phẩm"
              data={detailProduct?.category?.categoryName}
            />
            <ProductInfo
              title="Tồn kho"
              data={new BigNumber(detailProduct?.inStock).toFormat()}
            />
            <ProductInfo title="Đơn vị tính" data={"Hộp"} />
            <ProductInfo
              title="Giá nhập"
              data={`${new BigNumber(
                detailProduct?.costPrice,
              ).toFormat()} đồng`}
            />
            <ProductInfo
              title="Giá bán"
              data={`${new BigNumber(
                detailProduct?.sellingPrice,
              ).toFormat()} đồng`}
            />
            <ProductInfo
              title="Ngày tạo"
              data={detailProduct?.created}
              // data={formatISO(detailProduct?.created)}
            />
          </div>
          <div>
            <div className="text-gray">Mô tả sản phẩm</div>
            <p>{detailProduct?.description}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            {/* <img
                className="object-cover w-[200] h-[200px] rounded-md"
                alt="product-image"
                src="/images/image-product-demo.jpeg"
              /> */}
            {detailProduct?.image ? (
              <>
                <img
                  className="object-cover w-[150px] h-[150px] rounded-md"
                  alt="product-image"
                  src={detailProduct?.image || `/images/no-image.svg`}
                />
              </>
            ) : (
              <>
                <img
                  className="object-cover w-[100px] h-[100px] rounded-md"
                  alt="product-image"
                  src="/images/no-image.svg"
                />
                <p>Sản phẩm chưa có ảnh</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white block-border">
        <SmallTitle>Lịch sử</SmallTitle>
      </div>
    </div>
  )
}

export default ProductDetail

function ProductInfo({ title = "", data = "" }) {
  return (
    <>
      <div className="text-gray">{title}</div>
      <div className="text-black">{data}</div>
    </>
  )
}

function useFormatTimeDuration(saleAt: any) {
  if (saleAt) {
    // console.log("Sale at: ", saleAt)
    return saleAt
  }
}
