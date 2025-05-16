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
    const sampleData = [
      { Product: "Laptop", Category: "Electronics", Sales: "1200", Rating: "4.5", ReleaseDate: "2023-01-15" },
      { Product: "Smartphone", Category: "Electronics", Sales: "2500", Rating: "4.8", ReleaseDate: "2023-02-20" },
      { Product: "Headphones", Category: "Audio", Sales: "800", Rating: "4.2", ReleaseDate: "2023-03-10" },
      { Product: "Monitor", Category: "Electronics", Sales: "950", Rating: "4.4", ReleaseDate: "2023-04-05" },
      { Product: "Keyboard", Category: "Accessories", Sales: "350", Rating: "4.0", ReleaseDate: "2023-05-12" },
      { Product: "Mouse", Category: "Accessories", Sales: "280", Rating: "3.9", ReleaseDate: "2023-05-12" },
      { Product: "Tablet", Category: "Electronics", Sales: "1100", Rating: "4.6", ReleaseDate: "2023-06-18" },
      { Product: "Speakers", Category: "Audio", Sales: "600", Rating: "4.3", ReleaseDate: "2023-07-22" },
    ]

    // Clear existing data and add sample data
    setData([])
    sampleData.forEach((row) => addRow(row))
    setError(null)
  }

  if (schema.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4 gradient-heading">Data Entry</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You need to define your schema first before you can add data.
        </p>
        <Button variant="outline" asChild className="rounded-lg">
          <a href="#schema">Go to Schema Builder</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight gradient-heading">Data Entry</h2>
          <p className="text-muted-foreground mt-2">Add, edit, and manage your data based on the schema you defined.</p>
        </div>
        {schema.some((field) => field.name === "Product" && field.type === "text") &&
          schema.some((field) => field.name === "Category" && field.type === "text") &&
          schema.some((field) => field.name === "Sales" && field.type === "number") &&
          schema.some((field) => field.name === "Rating" && field.type === "number") &&
          schema.some((field) => field.name === "ReleaseDate" && field.type === "date") && (
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary/10"
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                {schema.map((field) => (
                  <TableHead key={field.name} className="font-medium">
                    {field.name}
                  </TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/10">
                  {schema.map((field) => (
                    <TableCell key={field.name}>
                      <Input
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        value={row[field.name] || ""}
                        onChange={(e) => handleInputChange(field.name, e.target.value, rowIndex)}
                        className="rounded-lg border-muted/60"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRow(rowIndex)}
                      className="rounded-lg h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/5 hover:bg-muted/10">
                {schema.map((field) => (
                  <TableCell key={field.name}>
                    <Input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      placeholder={`Enter ${field.name}`}
                      value={newRow[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="rounded-lg border-muted/60"
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddRow}
                    className="rounded-lg h-9 w-9 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-3 bg-muted/10 rounded-lg border">
        <p className="text-sm font-medium">
          {data.length} row{data.length !== 1 ? "s" : ""} in total
        </p>
        <p className="text-xs text-muted-foreground">
          All changes are automatically saved to your browser's session storage
        </p>
      </div>
    </div>
  )
}
