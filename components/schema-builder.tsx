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
  const { schema, setSchema, clearData } = useDataStore()
  const [newField, setNewField] = useState<SchemaField>({ name: "", type: "text" })
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight gradient-heading">Schema Builder</h2>
          <p className="text-muted-foreground mt-2">
            Define the structure of your data by adding fields and specifying their types.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary/10"
          onClick={() => {
            setSchema([
              { name: "Product", type: "text" },
              { name: "Category", type: "text" },
              { name: "Sales", type: "number" },
              { name: "Rating", type: "number" },
              { name: "ReleaseDate", type: "date" },
            ])
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
          <CardTitle>Add New Field</CardTitle>
          <CardDescription>Define a new field for your data schema</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                placeholder="e.g., age, name, date"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as "text" | "number" | "date" })}
              >
                <SelectTrigger id="field-type" className="rounded-lg">
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
              <Button onClick={addField} className="w-full gap-2 rounded-lg">
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle>Current Schema</CardTitle>
          <CardDescription>Your data structure will be based on these fields</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {schema.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
              <p className="mb-2 font-medium">No fields defined yet</p>
              <p className="text-sm">Add some fields above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schema.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-background transition-colors hover:bg-muted/10"
                >
                  <div className="flex-1">
                    <p className="font-medium">{field.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveField(index, "up")}
                      disabled={index === 0}
                      className="rounded-lg h-8 w-8"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveField(index, "down")}
                      disabled={index === schema.length - 1}
                      className="rounded-lg h-8 w-8"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeField(index)}
                      className="rounded-lg h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/10 border-t">
          <p className="text-sm text-muted-foreground">Note: Changing the schema will clear your existing data.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
