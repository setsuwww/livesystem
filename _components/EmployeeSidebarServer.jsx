import { getCurrentUser } from "@/_lib/auth"
import EmployeeSidebar from "./EmployeeSidebar"

export default async function EmployeeSidebarServer() {
  const user = await getCurrentUser()

  return <EmployeeSidebar employee={user} />
}
