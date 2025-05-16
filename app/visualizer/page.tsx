"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { JsonTools } from "@/components/json-tools"
import { SchemaBuilder } from "@/components/schema-builder"
import { ThemeToggle } from "@/components/theme-toggle"
import { VisualizationPanel } from "@/components/visualization-panel"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"

export default function VisualizerPage() {
  const { loadFromSession } = useDataStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFromSession()
  }, [loadFromSession])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-hero-pattern">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>DataPlayground</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/20 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium">Welcome to DataPlayground!</h3>
            <p className="text-sm text-muted-foreground">
              Start by defining your schema, then add data, and finally visualize it with interactive charts.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="#schema">
              <Button variant="outline" size="sm" className="rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl p-1">
            <TabsTrigger value="schema" className="rounded-lg">
              Schema Builder
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-lg">
              Data Entry
            </TabsTrigger>
            <TabsTrigger value="visualize" className="rounded-lg">
              Visualize
            </TabsTrigger>
            <TabsTrigger value="json" className="rounded-lg">
              JSON Export/Import
            </TabsTrigger>
          </TabsList>
          <TabsContent value="schema" className="p-6 border rounded-xl mt-6 bg-background/50 shadow-sm">
            <SchemaBuilder />
          </TabsContent>
          <TabsContent value="data" className="p-6 border rounded-xl mt-6 bg-background/50 shadow-sm">
            <DataTable />
          </TabsContent>
          <TabsContent value="visualize" className="p-6 border rounded-xl mt-6 bg-background/50 shadow-sm">
            <VisualizationPanel />
          </TabsContent>
          <TabsContent value="json" className="p-6 border rounded-xl mt-6 bg-background/50 shadow-sm">
            <JsonTools />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium">DataPlayground</span>
          </div>
          <p className="text-sm text-muted-foreground">
            All data is stored locally in your browser and is not sent to any server.
          </p>
        </div>
      </footer>
    </div>
  )
}
