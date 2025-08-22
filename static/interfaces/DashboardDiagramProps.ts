interface StatData {
  name: string;
  value?: number;        // optional (used in salesChartData)
  negativeValue?: number; // optional (used in salesChartData)

  // fields for ticketChartData
  accepted?: number;
  rejected?: number;
  late?: number;
  onTime?: number;
}

export interface DashboardDiagramProps {
  title: string
  description?: string
  data: StatData[]
  type?: "bar" | "pie" | "area"
  color?: string
  series?: {
    key: string
    color: string
    label?: string
  }[]
}