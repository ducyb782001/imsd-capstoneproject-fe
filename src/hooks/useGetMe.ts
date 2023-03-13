import { useQuery } from "react-query"
import { getUserData } from "../apis/auth"

function useGetMe() {
  const getMeQuery = useQuery("getMeQuery", async () => {
    const response = await getUserData()
    localStorage.setItem("userData", JSON.stringify(response?.data))
    return response?.data
  })
  return getMeQuery
}

export default useGetMe
