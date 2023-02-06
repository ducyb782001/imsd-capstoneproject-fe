import React, { useState } from "react"

function Tooltip({ content = null, children }) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="tooltip smooth-transform"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {show && <div className="tooltip-content top">{content}</div>}
      {children}
    </div>
  )
}

export default Tooltip
