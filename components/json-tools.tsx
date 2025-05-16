"use client"

import { useState } from "react"
import { Copy, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useDataStore } from "@/lib/data-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function JsonTools() {
  const { schema, data, setSchema, setData } = useDataStore()
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  const exportData = () => {
    const exportObj = {
      schema,
      data,
    }
    return JSON.stringify(exportObj, null, 2)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData())
    toast({
      title: "Copied to clipboard",
      description: "The JSON data has been copied to your clipboard.",
    })
  }

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportData())
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "data-playground-export.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImport = () => {
    try {
      setError(null)
      setSuccess(null)

      if (!jsonInput.trim()) {
        setError("Please enter JSON data to import")
        return
      }

      const importObj = JSON.parse(jsonInput)

      if (!importObj.schema || !Array.isArray(importObj.schema)) {
        setError("Invalid JSON format: schema is missing or not an array")
        return
      }

      if (!importObj.data || !Array.isArray(importObj.data)) {
        setError("Invalid JSON format: data is missing or not an array")
        return
      }

      // Validate schema
      for (const field of importObj.schema) {
        if (!field.name || !field.type) {
          setError("Invalid schema: each field must have a name and type")
          return
        }

        if (!["text", "number", "date"].includes(field.type)) {
          setError(`Invalid field type: ${field.type}. Must be text, number, or date.`)
          return
        }
      }

      setSchema(importObj.schema)
      setData(importObj.data)
      setSuccess("Data imported successfully")
      setJsonInput("")
    } catch (err) {
      setError(`Error parsing JSON: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight gradient-heading">JSON Export & Import</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Export your data as JSON or import previously saved data.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="default"
          className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 rounded-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2">
        <Card className="border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-lg sm:text-xl">Export Data</CardTitle>
            <CardDescription>Export your schema and data as JSON</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <Textarea
              className="font-mono h-[150px] sm:h-[200px] md:h-[300px] rounded-lg border-muted/60 bg-muted/5 text-xs sm:text-sm"
              readOnly
              value={exportData()}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 bg-muted/10 border-t p-3 sm:p-4">
            <Button
              variant="outline"
              className="gap-2 rounded-lg w-full text-xs sm:text-sm"
              onClick={handleCopyToClipboard}
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" /> Copy to Clipboard
            </Button>
            <Button className="gap-2 rounded-lg w-full text-xs sm:text-sm" onClick={handleDownload}>
              <Download className="h-3 w-3 sm:h-4 sm:w-4" /> Download JSON
            </Button>
          </CardFooter>
        </Card>

        <Card className="border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-lg sm:text-xl">Import Data</CardTitle>
            <CardDescription>Import previously exported JSON data</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <Textarea
              className="font-mono h-[200px] sm:h-[300px] rounded-lg border-muted/60 bg-muted/5 text-xs sm:text-sm"
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-3 sm:p-4">
            <Button className="w-full gap-2 rounded-lg text-xs sm:text-sm" onClick={handleImport}>
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" /> Import Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
