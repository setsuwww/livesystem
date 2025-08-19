interface StatData {
  name: string
  value: number
}

export interface DashboardDiagramProps {
  title: string
  description?: string
  data: StatData[]
  type?: "bar" | "pie" | "area"
  color?: string
}