"use client"

import { useState } from "react"
import { Plus, Trash2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useDataStore } from "@/lib/data-store"
import type { DataRow } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DataTable() {
  const { schema, data, addRow, updateRow, removeRow, setData } = useDataStore()
  const [newRow, setNewRow] = useState<DataRow>({})
  const [error, setError] = useState<string | null>(null)

  const handleAddRow = () => {
    // Validate required fields
    for (const field of schema) {
      if (!newRow[field.name] && field.type !== "number") {
        setError(`Field "${field.name}" is required`)
        return
      }
    }

    addRow({ ...newRow })
    setNewRow({})
    setError(null)
  }

  const handleInputChange = (field: string, value: string, rowIndex?: number) => {
    if (rowIndex !== undefined) {
      // Updating existing row
      const updatedRow = { ...data[rowIndex] }
      updatedRow[field] = value
      updateRow(rowIndex, updatedRow)
    } else {
      // Updating new row
      setNewRow({ ...newRow, [field]: value })
    }
  }

  const loadSampleData = () => {
    // First, identify the current schema type by checking field names
    const schemaFieldNames = schema.map((field) => field.name.toLowerCase())

    // Clear existing data
    setData([])

    // Product Sales Data
    if (
      schemaFieldNames.some((name) => name.includes("product")) &&
      schemaFieldNames.some((name) => name.includes("category") || name.includes("sales"))
    ) {
      const productData = [
        { Product: "Laptop", Category: "Electronics", Sales: "1200", Rating: "4.5", ReleaseDate: "2023-01-15" },
        { Product: "Smartphone", Category: "Electronics", Sales: "2500", Rating: "4.8", ReleaseDate: "2023-02-20" },
        { Product: "Headphones", Category: "Audio", Sales: "800", Rating: "4.2", ReleaseDate: "2023-03-10" },
        { Product: "Monitor", Category: "Electronics", Sales: "950", Rating: "4.4", ReleaseDate: "2023-04-05" },
        { Product: "Keyboard", Category: "Accessories", Sales: "350", Rating: "4.0", ReleaseDate: "2023-05-12" },
        { Product: "Mouse", Category: "Accessories", Sales: "280", Rating: "3.9", ReleaseDate: "2023-05-12" },
        { Product: "Tablet", Category: "Electronics", Sales: "1100", Rating: "4.6", ReleaseDate: "2023-06-18" },
        { Product: "Speakers", Category: "Audio", Sales: "600", Rating: "4.3", ReleaseDate: "2023-07-22" },
        { Product: "Smart Watch", Category: "Wearables", Sales: "750", Rating: "4.1", ReleaseDate: "2023-08-05" },
        { Product: "Camera", Category: "Electronics", Sales: "890", Rating: "4.7", ReleaseDate: "2023-09-10" },
      ]

      // Map sample data to match the actual schema field names
      const mappedData = productData.map((item) => {
        const newRow: DataRow = {}
        schema.forEach((field) => {
          const fieldLower = field.name.toLowerCase()
          if (fieldLower.includes("product")) newRow[field.name] = item.Product
          else if (fieldLower.includes("category")) newRow[field.name] = item.Category
          else if (fieldLower.includes("sales")) newRow[field.name] = item.Sales
          else if (fieldLower.includes("rating")) newRow[field.name] = item.Rating
          else if (fieldLower.includes("date")) newRow[field.name] = item.ReleaseDate
        })
        return newRow
      })

      mappedData.forEach((row) => addRow(row))
    }

    // Weather Data
    else if (
      schemaFieldNames.some((name) => name.includes("location") || name.includes("city")) &&
      schemaFieldNames.some((name) => name.includes("temp") || name.includes("weather"))
    ) {
      const weatherData = [
        { Location: "New York", Season: "Winter", Temperature: "32", Precipitation: "4.5", RecordDate: "2023-01-15" },
        {
          Location: "Los Angeles",
          Season: "Winter",
          Temperature: "68",
          Precipitation: "1.2",
          RecordDate: "2023-01-15",
        },
        { Location: "Chicago", Season: "Winter", Temperature: "25", Precipitation: "3.8", RecordDate: "2023-01-15" },
        { Location: "Miami", Season: "Winter", Temperature: "75", Precipitation: "2.1", RecordDate: "2023-01-15" },
        { Location: "New York", Season: "Summer", Temperature: "85", Precipitation: "3.2", RecordDate: "2023-07-15" },
        {
          Location: "Los Angeles",
          Season: "Summer",
          Temperature: "92",
          Precipitation: "0.1",
          RecordDate: "2023-07-15",
        },
        { Location: "Chicago", Season: "Summer", Temperature: "88", Precipitation: "2.9", RecordDate: "2023-07-15" },
        { Location: "Miami", Season: "Summer", Temperature: "91", Precipitation: "6.5", RecordDate: "2023-07-15" },
        { Location: "Seattle", Season: "Winter", Temperature: "45", Precipitation: "5.8", RecordDate: "2023-01-15" },
        { Location: "Denver", Season: "Summer", Temperature: "90", Precipitation: "1.5", RecordDate: "2023-07-15" },
      ]

      // Map sample data to match the actual schema field names
      const mappedData = weatherData.map((item) => {
        const newRow: DataRow = {}
        schema.forEach((field) => {
          const fieldLower = field.name.toLowerCase()
          if (fieldLower.includes("location") || fieldLower.includes("city")) newRow[field.name] = item.Location
          else if (fieldLower.includes("season")) newRow[field.name] = item.Season
          else if (fieldLower.includes("temp")) newRow[field.name] = item.Temperature
          else if (fieldLower.includes("precip") || fieldLower.includes("rain")) newRow[field.name] = item.Precipitation
          else if (fieldLower.includes("date")) newRow[field.name] = item.RecordDate
        })
        return newRow
      })

      mappedData.forEach((row) => addRow(row))
    }

    // Student Performance
    else if (
      schemaFieldNames.some((name) => name.includes("student") || name.includes("name")) &&
      schemaFieldNames.some((name) => name.includes("score") || name.includes("grade"))
    ) {
      const studentData = [
        { Student: "Alex", Subject: "Math", Score: "92", StudyHours: "8.5", ExamDate: "2023-05-10" },
        { Student: "Emma", Subject: "Math", Score: "88", StudyHours: "7.0", ExamDate: "2023-05-10" },
        { Student: "Noah", Subject: "Math", Score: "79", StudyHours: "5.5", ExamDate: "2023-05-10" },
        { Student: "Olivia", Subject: "Math", Score: "95", StudyHours: "9.0", ExamDate: "2023-05-10" },
        { Student: "Alex", Subject: "Science", Score: "85", StudyHours: "7.5", ExamDate: "2023-05-12" },
        { Student: "Emma", Subject: "Science", Score: "91", StudyHours: "8.0", ExamDate: "2023-05-12" },
        { Student: "Noah", Subject: "Science", Score: "82", StudyHours: "6.0", ExamDate: "2023-05-12" },
        { Student: "Olivia", Subject: "Science", Score: "88", StudyHours: "7.0", ExamDate: "2023-05-12" },
        { Student: "Liam", Subject: "Math", Score: "90", StudyHours: "8.0", ExamDate: "2023-05-10" },
        { Student: "Sophia", Subject: "Science", Score: "93", StudyHours: "8.5", ExamDate: "2023-05-12" },
      ]

      // Map sample data to match the actual schema field names
      const mappedData = studentData.map((item) => {
        const newRow: DataRow = {}
        schema.forEach((field) => {
          const fieldLower = field.name.toLowerCase()
          if (fieldLower.includes("student") || fieldLower.includes("name")) newRow[field.name] = item.Student
          else if (fieldLower.includes("subject")) newRow[field.name] = item.Subject
          else if (fieldLower.includes("score") || fieldLower.includes("grade")) newRow[field.name] = item.Score
          else if (fieldLower.includes("hours") || fieldLower.includes("study")) newRow[field.name] = item.StudyHours
          else if (fieldLower.includes("date")) newRow[field.name] = item.ExamDate
        })
        return newRow
      })

      mappedData.forEach((row) => addRow(row))
    }

    // Default fallback data if schema doesn't match any of the above
    else {
      // Create generic data based on the schema
      const genericData: DataRow[] = []

      for (let i = 1; i <= 10; i++) {
        const row: DataRow = {}

        schema.forEach((field) => {
          if (field.type === "text") {
            row[field.name] = `Sample ${field.name} ${i}`
          } else if (field.type === "number") {
            row[field.name] = `${Math.floor(Math.random() * 100)}`
          } else if (field.type === "date") {
            const date = new Date(2023, 0, i)
            row[field.name] = date.toISOString().split("T")[0]
          }
        })

        genericData.push(row)
      }

      genericData.forEach((row) => addRow(row))
    }

    setError(null)
  }

  if (schema.length === 0) {
    return (
      <div className="text-center py-8 sm:py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 gradient-heading">Data Entry</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
          You need to define your schema first before you can add data.
        </p>
        <Button variant="outline" asChild className="rounded-lg text-sm">
          <a href="#schema">Go to Schema Builder</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight gradient-heading">Data Entry</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Add, edit, and manage your data based on the schema you defined.
          </p>
        </div>
        {schema.length > 0 && (
          <Button
            variant="outline"
            className="gap-2 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary/10 w-full sm:w-auto"
            onClick={loadSampleData}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Load Sample Data
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-xl overflow-hidden shadow-sm bg-background">
        <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                {schema.map((field) => (
                  <TableHead key={field.name} className="font-medium whitespace-nowrap">
                    {field.name}
                  </TableHead>
                ))}
                <TableHead className="w-[60px] sm:w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/10">
                  {schema.map((field) => (
                    <TableCell key={field.name} className="p-2 sm:p-4">
                      <Input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        value={row[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value, rowIndex)}
                        className="rounded-lg border-muted/60 text-xs sm:text-sm h-8 sm:h-10 min-w-[80px]"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="p-2 sm:p-4">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRow(rowIndex)}
                      className="rounded-lg h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/5 hover:bg-muted/10">
                {schema.map((field) => (
                  <TableCell key={field.name} className="p-2 sm:p-4">
                    <Input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      placeholder={`Enter ${field.name}`}
                      value={newRow[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="rounded-lg border-muted/60 text-xs sm:text-sm h-8 sm:h-10 min-w-[80px]"
                    />
                  </TableCell>
                ))}
                <TableCell className="p-2 sm:p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddRow}
                    className="rounded-lg h-8 w-8 sm:h-9 sm:w-9 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center px-3 py-2 sm:px-4 sm:py-3 bg-muted/10 rounded-lg border text-center sm:text-left">
        <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-0">
          {data.length} row{data.length !== 1 ? "s" : ""} in total
        </p>
        <p className="text-xs text-muted-foreground">
          All changes are automatically saved to your browser's session storage
        </p>
      </div>
    </div>
  )
}
