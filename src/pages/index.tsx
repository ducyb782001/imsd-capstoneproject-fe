import React, { useEffect } from "react"
import { useRouter } from "next/router"
import cookie from "cookie"

function index() {
  const router = useRouter()

  useEffect(() => {
    const cookies = cookie.parse(window.document.cookie)
    if (!cookies.token) {
      router.push("/login")
    } else {
      router.push("/manage-goods")
    }
  }, [cookie])

  return <p className="p-5">Redirecting...</p>
}

export default index
