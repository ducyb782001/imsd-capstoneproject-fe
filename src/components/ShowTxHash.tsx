import Link from "next/link"
import React, { useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { PRODUCT_ENV } from "../lib/constants"
import { shortenAddress } from "../lib/shortenAddress"
import CopyIcon from "./icons/CopyIcon"
import LinkIcon from "./icons/LinkIcon"
import VIcon from "./icons/VIcon"

function ShowTxHash({ txHash, txLength = 4 }) {
  const [copiedText, setCopiedText] = useState(false)

  useEffect(() => {
    const resetState = setInterval(() => {
      setCopiedText(false)
    }, 2500)
    return () => clearInterval(resetState)
  }, [])

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <p className="min-w-[120px]">{shortenAddress(txHash, txLength)}</p>
      <CopyToClipboard onCopy={() => setCopiedText(true)} text={txHash}>
        <div className="p-[2px] bg-[#F6F5FA] rounded cursor-pointer">
          {copiedText ? (
            <VIcon color="#4F4F4F" />
          ) : (
            <CopyIcon color="#4F4F4F" />
          )}
        </div>
      </CopyToClipboard>
      <Link
        href={`${
          PRODUCT_ENV === "testnet"
            ? `https://testnet.bscscan.com/tx/${txHash}`
            : `https://bscscan.com/tx/${txHash}`
        }`}
      >
        <a target={`_blank`}>
          <div className="p-[2px] bg-[#F6F5FA] rounded cursor-pointer">
            <LinkIcon />
          </div>
        </a>
      </Link>
    </div>
  )
}

export default ShowTxHash
