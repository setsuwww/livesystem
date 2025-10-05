import { DashboardHeader } from "../../DashboardHeader"
import ContentForm from "@/components/content/ContentForm"
import { ContentInformation } from "@/components/content/ContentInformation"
import { Pagination } from "../../Pagination"
import OfficesTable from "./OfficesTable"

// data dummy
const PAGE_SIZE = 5
const dummyOffices = [
  {
    id: 1,
    name: "Head Office",
    location: "Jakarta",
    type: "WFO",
    status: "ACTIVE",
    startTime: "08:00",
    endTime: "17:00",
    createdAt: "2025-01-01T08:00:00.000Z",
    updatedAt: "2025-02-01T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Remote Office Bandung",
    location: "Bandung",
    type: "WFH",
    status: "INACTIVE",
    startTime: "09:00",
    endTime: "18:00",
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2025-02-02T09:00:00.000Z",
  },
  {
    id: 3,
    name: "Surabaya Branch",
    location: "Surabaya",
    type: "WFO",
    status: "ACTIVE",
    startTime: "07:30",
    endTime: "16:30",
    createdAt: "2025-01-15T08:00:00.000Z",
    updatedAt: "2025-02-03T09:00:00.000Z",
  },
  {
    id: 4,
    name: "Bali Hub",
    location: "Denpasar",
    type: "WFH",
    status: "ACTIVE",
    startTime: "10:00",
    endTime: "19:00",
    createdAt: "2025-01-20T08:00:00.000Z",
    updatedAt: "2025-02-04T09:00:00.000Z",
  },
  {
    id: 5,
    name: "Jogja Office",
    location: "Yogyakarta",
    type: "WFO",
    status: "INACTIVE",
    startTime: "08:30",
    endTime: "17:30",
    createdAt: "2025-01-25T08:00:00.000Z",
    updatedAt: "2025-02-05T09:00:00.000Z",
  },
  {
    id: 6,
    name: "Medan Office",
    location: "Medan",
    type: "WFH",
    status: "ACTIVE",
    startTime: "09:00",
    endTime: "18:00",
    createdAt: "2025-01-28T08:00:00.000Z",
    updatedAt: "2025-02-06T09:00:00.000Z",
  },
]

export default async function Page({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const total = dummyOffices.length
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // slice dummy data for pagination
  const offices = dummyOffices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (page > totalPages && totalPages > 0) {
    return <div className="p-4">Page not found</div>
  }

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
          <OfficesTable data={offices} />
          <Pagination page={page} totalPages={totalPages} basePath="/admin/dashboard/offices" />
        </ContentForm.Body>
      </ContentForm>
    </section>
  )
}
