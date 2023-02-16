import React from "react"
import { useTable, useSortBy, usePagination } from "react-table"
import PaginationLeft from "./icons/PaginationLeft"
import PaginationRight from "./icons/PaginationRight"

function Table({
  columns,
  data = [],
  fetchData = (d) => console.log("no fetchData { pageIndex, pageSize }", d),
  loading = false,
  pageCount: controlledPageCount = 1,
  count = 0,
  headerBgColor = "#202B38",
  headerColor = "#B2B8D2",
  borderColor = "#202B38",
  textColor = "#ffffff",
  fontSize = 14,
  columnSize = "",
  pageSizePagination,
}) {
  const {
    getTableProps,
    headerGroups,
    flatHeaders,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSizePagination },
      manualPagination: true,
      pageCount: controlledPageCount,
      autoResetPage: false,
    },
    // useSortBy,
    usePagination,
  )

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [pageIndex, pageSize])

  const firstPageRows = rows.slice(0, pageSize)

  const headerTextAlightRight = [
    "Amount",
    "Fee",
    "Discount amount",
    "Active point",
    "Mint rate",
    "Value",
    "Total spending",
    "Orders",
    "Earned",
  ]

  const headerTextAlignCenter = ["Status", "Type", "In | Out"]

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <td
                    key={index}
                    className={`${
                      headerTextAlightRight.includes(column?.Header)
                        ? "text-right"
                        : headerTextAlignCenter.includes(column.Header)
                        ? "text-center"
                        : ""
                    }`}
                    // {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </td>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {firstPageRows.map((row, i) => {
            let className = "odd"
            if (i % 2 === 0) {
              className = "even"
            }
            return (
              prepareRow(row) || (
                <tr key={i} className={className} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        className={`${
                          headerTextAlightRight.includes(cell.column.Header)
                            ? "text-right"
                            : ""
                        } ${columnSize}`}
                        data-label={cell.column.Header}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    )
                  })}
                </tr>
              )
            )
          })}

          {page.length < 1 && (
            <tr className="odd">
              <td colSpan={100}>No data</td>
            </tr>
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="flex items-center justify-center w-full mt-4">
          <div className="flex items-center justify-center text-white">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              <PaginationLeft />
            </Button>
            <p className="text-base font-title">
              <span>Page</span>{" "}
              <strong className="">
                {pageIndex + 1} of {pageOptions.length || 1}
              </strong>
            </p>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              <PaginationRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table

function Button(props) {
  return (
    <button
      className="px-1 py-1 mx-2 bg-transparent cursor-pointer"
      {...props}
    />
  )
}
