"use client"

import { useState } from "react"
import { Trash2, Plus, MoveUp, MoveDown, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDataStore } from "@/lib/data-store"
import type { SchemaField } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SchemaBuilder() {
  const { schema, setSchema, clearData, data } = useDataStore()
  const [newField, setNewField] = useState<SchemaField>({ name: "", type: "text" })
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldToRemove, setFieldToRemove] = useState<number | null>(null)

  const addField = () => {
    if (!newField.name.trim()) {
      setError("Field name cannot be empty")
      return
    }

    if (schema.some((field) => field.name === newField.name)) {
      setError("Field name must be unique")
      return
    }

    setSchema([...schema, { ...newField }])
    setNewField({ name: "", type: "text" })
    setError(null)
  }

  const removeField = (index: number) => {
    const newSchema = [...schema]
    newSchema.splice(index, 1)
    setSchema(newSchema)

    // Always clear data when schema changes to prevent data inconsistency
    clearData()
  }

  const moveField = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === schema.length - 1)) {
      return
    }

    const newSchema = [...schema]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newSchema[index]
    newSchema[index] = newSchema[newIndex]
    newSchema[newIndex] = temp
    setSchema(newSchema)
  }

  const handleRemoveField = (index: number) => {
    if (data.length > 0) {
      setFieldToRemove(index)
      setShowConfirmation(true)
    } else {
      removeField(index)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight gradient-heading">Schema Builder</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Define the structure of your data by adding fields and specifying their types.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary/10 w-full sm:w-auto"
          onClick={() => {
            // Define multiple schema options
            const schemaOptions = [
              // Product Sales Schema
              [
                { name: "Product", type: "text" },
                { name: "Category", type: "text" },
                { name: "Sales", type: "number" },
                { name: "Rating", type: "number" },
                { name: "ReleaseDate", type: "date" },
              ],
              // Weather Data Schema
              [
                { name: "Location", type: "text" },
                { name: "Season", type: "text" },
                { name: "Temperature", type: "number" },
                { name: "Precipitation", type: "number" },
                { name: "RecordDate", type: "date" },
              ],
              // Student Performance Schema
              [
                { name: "Student", type: "text" },
                { name: "Subject", type: "text" },
                { name: "Score", type: "number" },
                { name: "StudyHours", type: "number" },
                { name: "ExamDate", type: "date" },
              ],
              // Website Analytics Schema
              [
                { name: "Page", type: "text" },
                { name: "Device", type: "text" },
                { name: "Visitors", type: "number" },
                { name: "ConversionRate", type: "number" },
                { name: "Date", type: "date" },
              ],
              // Financial Data Schema
              [
                { name: "Stock", type: "text" },
                { name: "Sector", type: "text" },
                { name: "Price", type: "number" },
                { name: "Volume", type: "number" },
                { name: "TradeDate", type: "date" },
              ],
              // Health Metrics Schema
              [
                { name: "Patient", type: "text" },
                { name: "Condition", type: "text" },
                { name: "BloodSugar", type: "number" },
                { name: "Weight", type: "number" },
                { name: "CheckupDate", type: "date" },
              ],
              // Social Media Statistics Schema
              [
                { name: "Platform", type: "text" },
                { name: "ContentType", type: "text" },
                { name: "Likes", type: "number" },
                { name: "Comments", type: "number" },
                { name: "PostDate", type: "date" },
              ],
              // Travel Destinations Schema
              [
                { name: "Destination", type: "text" },
                { name: "Region", type: "text" },
                { name: "Visitors", type: "number" },
                { name: "Rating", type: "number" },
                { name: "Season", type: "date" },
              ],
              // Restaurant Ratings Schema
              [
                { name: "Restaurant", type: "text" },
                { name: "Cuisine", type: "text" },
                { name: "Price", type: "number" },
                { name: "Rating", type: "number" },
                { name: "OpenDate", type: "date" },
              ],
              // Employee Performance Schema
              [
                { name: "Employee", type: "text" },
                { name: "Department", type: "text" },
                { name: "Performance", type: "number" },
                { name: "Satisfaction", type: "number" },
                { name: "ReviewDate", type: "date" },
              ],
            ]

            // Randomly select a schema
            const randomIndex = Math.floor(Math.random() * schemaOptions.length)
            setSchema(schemaOptions[randomIndex])
            clearData()
          }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Load Sample Schema
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-lg sm:text-xl">Add New Field</CardTitle>
          <CardDescription>Define a new field for your data schema</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="field-name" className="text-sm">
                Field Name
              </Label>
              <Input
                id="field-name"
                placeholder="e.g., age, name, date"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="rounded-lg text-sm h-9"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="field-type" className="text-sm">
                Field Type
              </Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as "text" | "number" | "date" })}
              >
                <SelectTrigger id="field-type" className="rounded-lg text-sm h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addField} className="w-full gap-2 rounded-lg text-sm h-9">
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-lg sm:text-xl">Current Schema</CardTitle>
          <CardDescription>Your data structure will be based on these fields</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          {schema.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground bg-muted/30 rounded-lg">
              <p className="mb-2 font-medium text-sm sm:text-base">No fields defined yet</p>
              <p className="text-xs sm:text-sm">Add some fields above to get started</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {schema.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg bg-background transition-colors hover:bg-muted/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{field.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">{field.type}</p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveField(index, "up")}
                      disabled={index === 0}
                      className="rounded-lg h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <MoveUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveField(index, "down")}
                      disabled={index === schema.length - 1}
                      className="rounded-lg h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <MoveDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveField(index)}
                      className="rounded-lg h-6 w-6 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/10 border-t p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Note: Changing the schema will clear your existing data.
          </p>
        </CardFooter>
      </Card>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Field Removal</h3>
            <p className="text-muted-foreground mb-4">
              Removing this field will clear all your existing data. Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (fieldToRemove !== null) {
                    removeField(fieldToRemove)
                    setFieldToRemove(null)
                  }
                  setShowConfirmation(false)
                }}
              >
                Remove Field
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
