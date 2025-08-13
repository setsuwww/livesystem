import UsersTable from "./UsersTable"
import { prisma } from "@/lib/prisma"
import { DashboardHeader } from './../DashboardHeader';
import ContentForm from './../../../../components/content/ContentForm';
import ContentInformation from './../../../../components/content/ContentInformation';

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      tickets: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        }
      },
      schedules: {
        select: {
          id: true,
          title: true,
          date: true
        }
      },
      userShifts: { // ganti dari shifts
        select: {
          shift: { // ambil data shift dari relasi pivot
            select: {
              id: true,
              type: true,
              startTime: true,
              endTime: true
            }
          },
          date: true
        }
      }
    }
  })
}



export default async function Page() {
  const users = await getUsers()

  return (
    <section>
      <DashboardHeader title="Users Table" subtitle="Manage users data here" />

      <ContentForm>
        <ContentInformation heading="List Users" subheading="Manage all data users"/>
        <UsersTable data={users} />
      </ContentForm>
    </section>
  )
}
