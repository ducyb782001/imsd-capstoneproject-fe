import { useEffect } from "react"
import "@reach/dialog/styles.css"
import Head from "next/head"
import { QueryClient, QueryClientProvider } from "react-query"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import "../styles/globals.css"
import "../styles/nav.css"
import "../styles/table.css"
import "../styles/loading.css"

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

        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PJX3J32')
            `,
          }}
        ></script> */}
        {/*
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PJX3J32"
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript> */}
      </Head>

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
    </>
  )
}

export default App
