import UsersTable from "./UsersTable"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from './../DashboardHeader';
import ContentForm from '@/components/content/ContentForm';
import ContentInformation from '@/components/content/ContentInformation';

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
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
    role: u.role,
    shift: u.shift 
      ? (() => { const start = u.shift.startTime.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          }); const end = u.shift.endTime.toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          }); return `${u.shift.type} (${start} - ${end})`
        })() : "-",
    createdAt: u.createdAt.toISOString()
  }))

  return (
    <section>
      <DashboardHeader title="Users Table" subtitle="Manage users data here" />
      <ContentForm>
        <ContentInformation heading="List Users" subheading="Manage all data users" />
        <UsersTable data={tableData} />
      </ContentForm>
    </section>
  )
}