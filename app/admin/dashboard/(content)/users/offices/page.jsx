import { DashboardHeader } from "@/app/admin/dashboard/DashboardHeader"
import ContentForm from "@/_components/content/ContentForm"
import { ContentInformation } from "@/_components/content/ContentInformation"
import { Pagination } from "@/app/admin/dashboard/Pagination"
import OfficesTable from "./OfficesTable"
import { prisma } from "@/_lib/prisma"

const PAGE_SIZE = 5

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const [offices, total] = await Promise.all([
    prisma.office.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, location: true, type: true, status: true,
        latitude: true, longitude: true, radius: true,
        startTime: true, endTime: true, createdAt: true, updatedAt: true,
      },
    }),
    prisma.office.count(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const formattedOffices = offices.map((office) => ({
    ...office,
    startTime: office.startTime != null
      ? `${String(Math.floor(office.startTime / 60)).padStart(2, "0")}:${String(office.startTime % 60).padStart(2, "0")}`
      : "-",
    endTime: office.endTime != null
      ? `${String(Math.floor(office.endTime / 60)).padStart(2, "0")}:${String(office.endTime % 60).padStart(2, "0")}`
      : "-",
  }))

  return (
    <section>
      <DashboardHeader title="Offices" subtitle="List of office locations" />
      <ContentForm>
        <ContentForm.Header>
          <ContentInformation
            heading="List Offices"
            subheading="Manage all office data in this table"
            show={true}
            buttonText="Create Office"
            href="/admin/dashboard/offices/create"
          />
        </ContentForm.Header>

        <ContentForm.Body>
          <OfficesTable data={formattedOffices} />
          <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/offices" />
        </ContentForm.Body>
      </ContentForm>
    </section>
  )
}
