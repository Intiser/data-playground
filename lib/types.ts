export interface SchemaField {
  name: string
  type: "text" | "number" | "date"
}

export interface DataRow {
  [key: string]: string
}
