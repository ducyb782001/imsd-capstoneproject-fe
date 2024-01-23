import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getMaintenancePageStatus } from "../apis/market-config-module"

const MaintenanceContext = createContext({
  isMaintenance: false,
  checkMaintenance: () => null,
})

function MaintenanceProvier({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false)

  const checkMaintenance = async () => {
    try {
      const { data } = await getMaintenancePageStatus()
      if (data?.isMaintaining) {
        setIsMaintenance(true)
      } else {
        setIsMaintenance(false)
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error || "Something went wrong")
    }
  }
  useEffect(() => {
    checkMaintenance()
  }, [])

  const contextValue = useMemo(
    () => ({
      isMaintenance,
      checkMaintenance,
    }),
    [isMaintenance],
  )
  return <MaintenanceContext.Provider value={contextValue}>{children}</MaintenanceContext.Provider>
}

const useMaintenanceContext = () => useContext(MaintenanceContext)

export { MaintenanceContext, MaintenanceProvier, useMaintenanceContext }
