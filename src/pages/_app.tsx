import { useEffect } from "react"
import "@reach/dialog/styles.css"
import Head from "next/head"
import { QueryClient, QueryClientProvider } from "react-query"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { IKContext } from "imagekitio-react"

import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import "../styles/globals.css"
import "../styles/nav.css"
import "../styles/table.css"
import "../styles/loading.css"
import "../styles/tooltip.css"
import "../styles/add-image.css"

function App({ Component, pageProps }) {
  // react query stop refetch when switch browser tabs
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      // @ts-ignore
      if (document.activeElement.type === "number") {
        // @ts-ignore
        document.activeElement.blur()
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>Welcome to IMSD system</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Welcome to IMSD system" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="/images/og.jpeg" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>

      <IKContext
        // urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        // publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint="https://ik.imagekit.io/imsd/"
        publicKey="public_XiISXxtv+NpyIofQPuKlcs7wvDQ="
        authenticationEndpoint="/api/auth"
      >
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </IKContext>
    </>
  )
}

export default App
