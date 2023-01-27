import Link from "next/link"
import React from "react"

function Page404(props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white block-border">
      <img src="/images/404.svg" alt="404" />
      <div className="mt-6 text-2xl">Oops!... 404 - page not found</div>
      <p className="mt-5 text-sm">
        Please try another URL or{" "}
        <Link href={`/`}>
          <a className="font-semibold">back to homepage</a>
        </Link>
      </p>
    </div>
  )
}

export default Page404
