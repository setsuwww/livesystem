import UsersTable from "./UsersTable"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from './../DashboardHeader';
import ContentForm from '@/components/content/ContentForm';
import ContentInformation from '@/components/content/ContentInformation';
import { capitalize } from "./function/functionCapitalize";

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      shift: {
        select: {
          id: true,
          type: true,
          startTime: true,
          endTime: true
        }
      }
    }
  })
}

export default async function Page() {
  const users = await getUsers()
  
  const tableData = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: capitalize(u.role),
    shift: u.shift 
      ? (() => { 
        const start = u.shift.startTime.toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit",
          timeZone: "UTC" 
        }); 
        const end = u.shift.endTime.toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit",
          timeZone: "UTC" 
        }); return `${capitalize(u.shift.type)} (${start} - ${end})`
        })() : "-",
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }))

  return (
    <section>
      <DashboardHeader title="Users" subtitle="Users data detail" />
      <ContentForm>
        <ContentInformation heading="List users" subheading="Manage all users data in this table" />
        <UsersTable data={tableData} />
      </ContentForm>
    </section>
  )
}