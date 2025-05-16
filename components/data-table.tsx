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
    // First, identify the current schema type
    const schemaFieldNames = schema.map((field) => field.name.toLowerCase())

    // Clear existing data
    setData([])

    // Product Sales Data
    if (
      schemaFieldNames.includes("product") &&
      schemaFieldNames.includes("category") &&
      schemaFieldNames.includes("sales")
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
      productData.forEach((row) => addRow(row))
    }

    // Weather Data
    else if (schemaFieldNames.includes("location") && schemaFieldNames.includes("temperature")) {
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
      weatherData.forEach((row) => addRow(row))
    }

    // Student Performance
    else if (schemaFieldNames.includes("student") && schemaFieldNames.includes("score")) {
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
      studentData.forEach((row) => addRow(row))
    }

    // Website Analytics
    else if (schemaFieldNames.includes("page") && schemaFieldNames.includes("visitors")) {
      const analyticsData = [
        { Page: "Home", Device: "Desktop", Visitors: "1250", ConversionRate: "3.2", Date: "2023-06-01" },
        { Page: "Products", Device: "Desktop", Visitors: "980", ConversionRate: "4.5", Date: "2023-06-01" },
        { Page: "Checkout", Device: "Desktop", Visitors: "540", ConversionRate: "8.1", Date: "2023-06-01" },
        { Page: "Home", Device: "Mobile", Visitors: "1820", ConversionRate: "2.1", Date: "2023-06-01" },
        { Page: "Products", Device: "Mobile", Visitors: "1340", ConversionRate: "3.2", Date: "2023-06-01" },
        { Page: "Checkout", Device: "Mobile", Visitors: "680", ConversionRate: "5.4", Date: "2023-06-01" },
        { Page: "Home", Device: "Tablet", Visitors: "420", ConversionRate: "2.8", Date: "2023-06-01" },
        { Page: "Products", Device: "Tablet", Visitors: "310", ConversionRate: "3.9", Date: "2023-06-01" },
        { Page: "Blog", Device: "Desktop", Visitors: "750", ConversionRate: "2.5", Date: "2023-06-01" },
        { Page: "Contact", Device: "Mobile", Visitors: "480", ConversionRate: "1.8", Date: "2023-06-01" },
      ]
      analyticsData.forEach((row) => addRow(row))
    }

    // Financial Data
    else if (schemaFieldNames.includes("stock") || schemaFieldNames.includes("price")) {
      const financialData = [
        { Stock: "AAPL", Sector: "Technology", Price: "182.52", Volume: "45.2", TradeDate: "2023-07-01" },
        { Stock: "MSFT", Sector: "Technology", Price: "338.11", Volume: "32.1", TradeDate: "2023-07-01" },
        { Stock: "AMZN", Sector: "Consumer", Price: "129.78", Volume: "38.5", TradeDate: "2023-07-01" },
        { Stock: "GOOGL", Sector: "Technology", Price: "119.70", Volume: "29.8", TradeDate: "2023-07-01" },
        { Stock: "JPM", Sector: "Financial", Price: "145.15", Volume: "18.2", TradeDate: "2023-07-01" },
        { Stock: "BAC", Sector: "Financial", Price: "28.47", Volume: "22.6", TradeDate: "2023-07-01" },
        { Stock: "PFE", Sector: "Healthcare", Price: "36.32", Volume: "15.4", TradeDate: "2023-07-01" },
        { Stock: "JNJ", Sector: "Healthcare", Price: "165.52", Volume: "12.8", TradeDate: "2023-07-01" },
        { Stock: "TSLA", Sector: "Automotive", Price: "261.77", Volume: "51.3", TradeDate: "2023-07-01" },
        { Stock: "NVDA", Sector: "Technology", Price: "423.85", Volume: "47.6", TradeDate: "2023-07-01" },
      ]
      financialData.forEach((row) => addRow(row))
    }

    // Health Metrics
    else if (schemaFieldNames.includes("patient") || schemaFieldNames.includes("bloodsugar")) {
      const healthData = [
        { Patient: "P001", Condition: "Diabetes", BloodSugar: "142", Weight: "78.5", CheckupDate: "2023-04-10" },
        { Patient: "P002", Condition: "Hypertension", BloodSugar: "105", Weight: "82.3", CheckupDate: "2023-04-11" },
        { Patient: "P003", Condition: "Healthy", BloodSugar: "98", Weight: "65.7", CheckupDate: "2023-04-12" },
        { Patient: "P004", Condition: "Diabetes", BloodSugar: "156", Weight: "91.2", CheckupDate: "2023-04-13" },
        { Patient: "P005", Condition: "Hypertension", BloodSugar: "110", Weight: "75.8", CheckupDate: "2023-04-14" },
        { Patient: "P006", Condition: "Healthy", BloodSugar: "92", Weight: "68.4", CheckupDate: "2023-04-15" },
        { Patient: "P007", Condition: "Diabetes", BloodSugar: "138", Weight: "84.1", CheckupDate: "2023-04-16" },
        { Patient: "P008", Condition: "Hypertension", BloodSugar: "118", Weight: "79.6", CheckupDate: "2023-04-17" },
        { Patient: "P009", Condition: "Obesity", BloodSugar: "115", Weight: "102.3", CheckupDate: "2023-04-18" },
        { Patient: "P010", Condition: "Anemia", BloodSugar: "90", Weight: "61.2", CheckupDate: "2023-04-19" },
      ]
      healthData.forEach((row) => addRow(row))
    }

    // Social Media Statistics
    else if (schemaFieldNames.includes("platform") || schemaFieldNames.includes("likes")) {
      const socialData = [
        { Platform: "Instagram", ContentType: "Photo", Likes: "1250", Comments: "85", PostDate: "2023-03-05" },
        { Platform: "Instagram", ContentType: "Video", Likes: "1820", Comments: "132", PostDate: "2023-03-06" },
        { Platform: "Twitter", ContentType: "Text", Likes: "450", Comments: "28", PostDate: "2023-03-07" },
        { Platform: "Twitter", ContentType: "Image", Likes: "680", Comments: "42", PostDate: "2023-03-08" },
        { Platform: "Facebook", ContentType: "Photo", Likes: "520", Comments: "35", PostDate: "2023-03-09" },
        { Platform: "Facebook", ContentType: "Video", Likes: "980", Comments: "76", PostDate: "2023-03-10" },
        { Platform: "TikTok", ContentType: "Video", Likes: "2450", Comments: "185", PostDate: "2023-03-11" },
        { Platform: "YouTube", ContentType: "Video", Likes: "1750", Comments: "210", PostDate: "2023-03-12" },
        { Platform: "LinkedIn", ContentType: "Article", Likes: "320", Comments: "45", PostDate: "2023-03-13" },
        { Platform: "Pinterest", ContentType: "Image", Likes: "890", Comments: "25", PostDate: "2023-03-14" },
      ]
      socialData.forEach((row) => addRow(row))
    }

    // Travel Destinations
    else if (schemaFieldNames.includes("destination") || schemaFieldNames.includes("region")) {
      const travelData = [
        { Destination: "Paris", Region: "Europe", Visitors: "8500000", Rating: "4.7", Season: "2023-06-15" },
        { Destination: "Tokyo", Region: "Asia", Visitors: "9200000", Rating: "4.8", Season: "2023-06-15" },
        { Destination: "New York", Region: "North America", Visitors: "12500000", Rating: "4.6", Season: "2023-06-15" },
        { Destination: "Rome", Region: "Europe", Visitors: "7800000", Rating: "4.5", Season: "2023-06-15" },
        { Destination: "Bangkok", Region: "Asia", Visitors: "11500000", Rating: "4.4", Season: "2023-06-15" },
        { Destination: "London", Region: "Europe", Visitors: "9700000", Rating: "4.6", Season: "2023-06-15" },
        { Destination: "Dubai", Region: "Middle East", Visitors: "8200000", Rating: "4.7", Season: "2023-06-15" },
        { Destination: "Sydney", Region: "Oceania", Visitors: "6400000", Rating: "4.8", Season: "2023-06-15" },
        { Destination: "Barcelona", Region: "Europe", Visitors: "7100000", Rating: "4.6", Season: "2023-06-15" },
        { Destination: "Bali", Region: "Asia", Visitors: "5800000", Rating: "4.9", Season: "2023-06-15" },
      ]
      travelData.forEach((row) => addRow(row))
    }

    // Restaurant Ratings
    else if (schemaFieldNames.includes("restaurant") || schemaFieldNames.includes("cuisine")) {
      const restaurantData = [
        { Restaurant: "Bella Italia", Cuisine: "Italian", Price: "28", Rating: "4.6", OpenDate: "2022-05-10" },
        { Restaurant: "Sushi Palace", Cuisine: "Japanese", Price: "42", Rating: "4.8", OpenDate: "2021-08-15" },
        { Restaurant: "Taco Fiesta", Cuisine: "Mexican", Price: "18", Rating: "4.3", OpenDate: "2022-02-20" },
        { Restaurant: "Burger Joint", Cuisine: "American", Price: "15", Rating: "4.1", OpenDate: "2021-11-05" },
        { Restaurant: "Spice Garden", Cuisine: "Indian", Price: "25", Rating: "4.5", OpenDate: "2022-07-12" },
        { Restaurant: "Le Bistro", Cuisine: "French", Price: "45", Rating: "4.7", OpenDate: "2021-04-30" },
        { Restaurant: "Dragon Wok", Cuisine: "Chinese", Price: "22", Rating: "4.2", OpenDate: "2022-01-18" },
        { Restaurant: "Mediterranean", Cuisine: "Greek", Price: "32", Rating: "4.4", OpenDate: "2021-09-22" },
        { Restaurant: "Thai Orchid", Cuisine: "Thai", Price: "27", Rating: "4.6", OpenDate: "2022-03-15" },
        { Restaurant: "Brazilian Grill", Cuisine: "Brazilian", Price: "38", Rating: "4.5", OpenDate: "2021-10-08" },
      ]
      restaurantData.forEach((row) => addRow(row))
    }

    // Employee Performance
    else if (schemaFieldNames.includes("employee") || schemaFieldNames.includes("department")) {
      const employeeData = [
        {
          Employee: "John Smith",
          Department: "Sales",
          Performance: "85",
          Satisfaction: "4.2",
          ReviewDate: "2023-02-15",
        },
        {
          Employee: "Sarah Johnson",
          Department: "Marketing",
          Performance: "92",
          Satisfaction: "4.5",
          ReviewDate: "2023-02-16",
        },
        {
          Employee: "Michael Brown",
          Department: "Engineering",
          Performance: "88",
          Satisfaction: "4.0",
          ReviewDate: "2023-02-17",
        },
        { Employee: "Emily Davis", Department: "HR", Performance: "90", Satisfaction: "4.7", ReviewDate: "2023-02-18" },
        {
          Employee: "David Wilson",
          Department: "Sales",
          Performance: "78",
          Satisfaction: "3.8",
          ReviewDate: "2023-02-19",
        },
        {
          Employee: "Jessica Taylor",
          Department: "Marketing",
          Performance: "86",
          Satisfaction: "4.3",
          ReviewDate: "2023-02-20",
        },
        {
          Employee: "Andrew Miller",
          Department: "Engineering",
          Performance: "94",
          Satisfaction: "4.1",
          ReviewDate: "2023-02-21",
        },
        {
          Employee: "Olivia Moore",
          Department: "HR",
          Performance: "89",
          Satisfaction: "4.6",
          ReviewDate: "2023-02-22",
        },
        {
          Employee: "Robert Chen",
          Department: "Engineering",
          Performance: "91",
          Satisfaction: "4.4",
          ReviewDate: "2023-02-23",
        },
        {
          Employee: "Amanda Lewis",
          Department: "Sales",
          Performance: "83",
          Satisfaction: "4.0",
          ReviewDate: "2023-02-24",
        },
      ]
      employeeData.forEach((row) => addRow(row))
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
        {schema.length > 0 && (
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
