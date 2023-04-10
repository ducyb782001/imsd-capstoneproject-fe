export function getRoleId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("roleId")
  }
  return null
}
