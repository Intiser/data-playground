export interface SchemaField {
  name: string
  type: "text" | "number" | "date"
}

export interface DataRow {
  [key: string]: string
}

export type ChartType = "bar" | "pie" | "line" | "scatter" | "area" | "donut" | "horizontal-bar" | "gauge"

export interface ChartConfig {
  id: string
  type: ChartType
  title: string
  xAxis: string
  yAxis: string
  showLegend: boolean
  showGrid: boolean
  showLabels: boolean
  colorScheme: "purple" | "blue" | "green" | "orange" | "rainbow"
  animation: boolean
}
