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
import "../styles/tooltip.css"
import "../styles/tooltip-unit.css"
import "../styles/add-image.css"
import "../styles/add-file-media.css"
import "../styles/skeleton-loading.css"
import { ThemeProvier } from "../context/ThemeContext"
import "src/i18n/i18n"
import Script from "next/script"

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

  function TrackingWebsiteView() {
    return (
      <>
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-84RDCELSTL`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-84RDCELSTL');
        `}
        </Script>
      </>
    )
  }

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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <TrackingWebsiteView />
      <QueryClientProvider client={queryClient}>
        <ThemeProvier>
          <Component {...pageProps} />
        </ThemeProvier>
      </QueryClientProvider>
    </>
  )
}

export default App
