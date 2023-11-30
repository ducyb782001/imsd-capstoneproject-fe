import React from "react"
import { CustomChat, FacebookProvider } from "react-facebook"

function FacebookMsg() {
  return (
    <FacebookProvider appId="667923708859090" chatSupport>
      <CustomChat pageId="173168602549251" minimized={true} />
    </FacebookProvider>
  )
}

export default FacebookMsg
