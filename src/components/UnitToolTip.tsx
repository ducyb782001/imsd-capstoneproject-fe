import React, { useState } from "react"

function UnitToolTip({ content = null, children }) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="text-sm font-light tooltip-unit smooth-transform"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {show && content && (
        <div className="font-semibold tooltip-unit-content top">{content}</div>
      )}
      {children}
    </div>
  )
}

export default UnitToolTip
