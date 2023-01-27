import React from "react"

function ComingSoon(props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white block-border">
      <img src="/images/comingsoon.svg" alt="404" />
      <div className="mt-6 text-2xl">Feature coming soon!</div>
      <p className="mt-5 text-sm">
        This feature is in development. Please come back later.
      </p>
    </div>
  )
}

export default ComingSoon
