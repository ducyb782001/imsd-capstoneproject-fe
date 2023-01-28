import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DialogOverlay } from "@reach/dialog"
import { MotionDialogContent } from "./MotionDialogContent"
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { useEagerConnect, useInactiveListener } from "../hooks"
import { injected } from "../lib/connectors"
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector"
import IconCloseDialog from "./icons/IconCloseDialog"
import { Spinner } from "./Spinner"

enum ConnectorNames {
  Injected = "Metamask",
  // Trust = "Trust Wallet",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.Trust]: injected,
}

function getWalletServiceIcon(name: string) {
  switch (name) {
    case ConnectorNames.Injected:
      return "/images/wallets/metamask.png"
    // case ConnectorNames.Trust:
    //   return "/images/wallets/trust.png"
  }
}

export const ConnectWalletModalContext = React.createContext({ isOpen: false })

function ModalConnectWallet({ label, ...props }) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const context = useWeb3React<Web3Provider>()
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <div className="">
      <p className="" onClick={open}>
        {label}
      </p>

      <AnimatePresence>
        {showDialog && (
          <DialogOverlay onDismiss={close} className="z-50">
            {/* @ts-ignore */}
            <MotionDialogContent
              aria-label="Connect wallet modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-50 !bg-transparent rounded-2xl"
              style={{ width: 350 }}
            >
              <motion.div
                className="flex flex-col bg-gradient-to-b from-[#262250] to-[#131632] rounded-2xl"
                initial={{ y: +30 }}
                animate={{ y: 0 }}
              >
                <div>
                  <div className="flex items-center justify-between px-8 py-6 rounded-t-2xl">
                    <p className="text-xl font-bold text-center text-white">
                      Connect your wallet
                    </p>
                    <IconCloseDialog
                      onClick={close}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="grid gap-3 px-8 my-8">
                    {Object.keys(connectorsByName).map((name) => {
                      const currentConnector = connectorsByName[name]
                      const activating =
                        currentConnector === activatingConnector
                      const connected = currentConnector === connector
                      const disabled =
                        // !triedEager ||
                        !!activatingConnector || connected || !!error

                      return (
                        <button
                          className="bg-gray-light rounded-md shadow-sm hover:shadow-md opacity-80 hover:opacity-100 duration-300 py-4 bg-[#38355C]"
                          style={{
                            cursor: disabled ? "unset" : "pointer",
                            position: "relative",
                          }}
                          disabled={disabled}
                          key={name}
                          onClick={() => {
                            setActivatingConnector(currentConnector)
                            activate(connectorsByName[name])
                            localStorage.setItem("isDeactivated", "2")
                          }}
                        >
                          <div className="flex items-center justify-between px-4">
                            <div className="font-semibold text-[#d1d5db]">
                              {name}
                            </div>
                            <div
                              style={{ width: 24, height: 24, display: "flex" }}
                            >
                              <img
                                src={getWalletServiceIcon(name)}
                                alt={name}
                              />
                            </div>
                          </div>
                        </button>

                        // <button
                        //   className="bg-gray-light rounded-md shadow-sm hover:shadow-md opacity-80 hover:opacity-100 duration-300 py-4 bg-[#38355C]"
                        //   style={{
                        //     height: "3rem",
                        //     borderColor: activating
                        //       ? "orange"
                        //       : connected
                        //       ? "green"
                        //       : "rgba(209, 213, 219",
                        //     cursor: disabled ? "unset" : "pointer",
                        //     position: "relative",
                        //     opacity:
                        //       (!connected && disabled) || activating
                        //         ? "0.5"
                        //         : 1,
                        //   }}
                        //   disabled={disabled}
                        //   key={name}
                        //   onClick={() => {
                        //     setActivatingConnector(currentConnector)
                        //     activate(connectorsByName[name])
                        //     localStorage.setItem("isDeactivated", "2")
                        //   }}
                        // >
                        //   <div
                        //     style={{
                        //       position: "absolute",
                        //       top: -17,
                        //       left: -17,
                        //       height: "100%",
                        //       display: "flex",
                        //       alignItems: "center",
                        //       color: "black",
                        //       margin: "0 0 0 1rem",
                        //     }}
                        //   >
                        //     {activating && (
                        //       <Spinner
                        //         color={"black"}
                        //         style={{ height: "25%", marginLeft: "-1rem" }}
                        //       />
                        //     )}
                        //     {connected && (
                        //       <span role="img" aria-label="check">
                        //         ✅
                        //       </span>
                        //     )}
                        //   </div>
                        //   <div className="flex items-center justify-between px-4">
                        //     <div className="font-semibold text-[#d1d5db]">
                        //       {name}
                        //     </div>
                        //     <div className="flex">
                        //       <img
                        //         src={getWalletServiceIcon(name)}
                        //         alt={name}
                        //         className="w-6 h-6"
                        //       />
                        //     </div>
                        //   </div>
                        // </button>
                      )
                    })}

                    <a
                      href="https://docs.pancakeswap.finance/get-started/connection-guide"
                      target="_blank"
                      className="flex justify-center mt-6"
                      rel="noreferrer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        color="primary"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#d1d5db"
                        className="mr-2"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 16H13V18H11V16ZM12.61 6.04C10.55 5.74 8.73 7.01 8.18 8.83C8 9.41 8.44 10 9.05 10H9.25C9.66 10 9.99 9.71 10.13 9.33C10.45 8.44 11.4 7.83 12.43 8.05C13.38 8.25 14.08 9.18 14 10.15C13.9 11.49 12.38 11.78 11.55 13.03C11.55 13.04 11.54 13.04 11.54 13.05C11.53 13.07 11.52 13.08 11.51 13.1C11.42 13.25 11.33 13.42 11.26 13.6C11.25 13.63 11.23 13.65 11.22 13.68C11.21 13.7 11.21 13.72 11.2 13.75C11.08 14.09 11 14.5 11 15H13C13 14.58 13.11 14.23 13.28 13.93C13.3 13.9 13.31 13.87 13.33 13.84C13.41 13.7 13.51 13.57 13.61 13.45C13.62 13.44 13.63 13.42 13.64 13.41C13.74 13.29 13.85 13.18 13.97 13.07C14.93 12.16 16.23 11.42 15.96 9.51C15.72 7.77 14.35 6.3 12.61 6.04Z"></path>
                      </svg>
                      <p className="font-semibold text-blue-dark text-[#d1d5db]">
                        Learn how to connect
                      </p>
                    </a>
                  </div>

                  <div className="flex flex-col items-center px-8 mb-6">
                    {(active || error) && (
                      <button
                        className="w-full px-4 py-2 font-bold text-white btn-primary rounded-xl"
                        style={{
                          backgroundColor: "#b81412",
                        }}
                        onClick={() => {
                          const isDeactivated =
                            localStorage.getItem("isDeactivated")
                          if (!isDeactivated) {
                            localStorage.setItem("isDeactivated", "1")
                          } else if (isDeactivated == "2") {
                            localStorage.setItem("isDeactivated", "1")
                          }
                          deactivate()
                          // client.resetStore();
                        }}
                      >
                        Deactivate
                      </button>
                    )}

                    {!!error && (
                      <h4 className="mt-4 mb-8 text-center text-white">
                        {getErrorMessage(error)}
                      </h4>
                    )}
                  </div>
                </div>
              </motion.div>
            </MotionDialogContent>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModalConnectWallet

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account."
  } else {
    console.error(error)
    return "An unknown error occurred. Check the console for more details."
  }
}
