import Link from "next/link"
import React from "react"

function Page401() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white block-border">
      <img src="/images/401.svg" alt="401" />
      <div className="mt-6 text-2xl">Oops!... Authorization Required</div>
      <p className="mt-5 text-sm">
        Please try another URL or{" "}
        <Link href={`/`}>
          <a className="font-semibold">back to homepage</a>
        </Link>
      </p>
    </div>
  )
}

export default Page401
