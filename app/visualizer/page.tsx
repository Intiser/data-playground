"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Menu } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { JsonTools } from "@/components/json-tools"
import { SchemaBuilder } from "@/components/schema-builder"
import { ThemeToggle } from "@/components/theme-toggle"
import { EnhancedVisualizationPanel } from "@/components/enhanced-visualization-panel"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function VisualizerPage() {
  const { loadFromSession } = useDataStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("schema")

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
            <span className="hidden sm:inline">DataPlayground</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Mobile Navigation */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col gap-6 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <span>DataPlayground</span>
                      </div>
                      <ThemeToggle />
                    </div>
                    <nav className="flex flex-col gap-2">
                      <Button
                        variant={activeTab === "schema" ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          setActiveTab("schema")
                          document
                            .querySelector('[data-state="open"]')
                            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                        }}
                      >
                        Schema Builder
                      </Button>
                      <Button
                        variant={activeTab === "data" ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          setActiveTab("data")
                          document
                            .querySelector('[data-state="open"]')
                            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                        }}
                      >
                        Data Entry
                      </Button>
                      <Button
                        variant={activeTab === "visualize" ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          setActiveTab("visualize")
                          document
                            .querySelector('[data-state="open"]')
                            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                        }}
                      >
                        Visualize
                      </Button>
                      <Button
                        variant={activeTab === "json" ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => {
                          setActiveTab("json")
                          document
                            .querySelector('[data-state="open"]')
                            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                        }}
                      >
                        JSON Export/Import
                      </Button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/20 p-3 sm:p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm sm:text-base">Welcome to DataPlayground!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Start by defining your schema, then add data, and finally visualize it with interactive charts.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="#schema">
              <Button variant="outline" size="sm" className="rounded-lg text-xs sm:text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <div className="sm:hidden mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold gradient-heading">
            {activeTab === "schema" && "Schema Builder"}
            {activeTab === "data" && "Data Entry"}
            {activeTab === "visualize" && "Visualization"}
            {activeTab === "json" && "JSON Export/Import"}
          </h2>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl p-1 hidden sm:grid">
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
          <TabsContent value="schema" className="p-3 sm:p-6 border rounded-xl mt-4 sm:mt-6 bg-background/50 shadow-sm">
            <SchemaBuilder />
          </TabsContent>
          <TabsContent value="data" className="p-3 sm:p-6 border rounded-xl mt-4 sm:mt-6 bg-background/50 shadow-sm">
            <DataTable />
          </TabsContent>
          <TabsContent
            value="visualize"
            className="p-3 sm:p-6 border rounded-xl mt-4 sm:mt-6 bg-background/50 shadow-sm"
          >
            <EnhancedVisualizationPanel />
          </TabsContent>
          <TabsContent value="json" className="p-3 sm:p-6 border rounded-xl mt-4 sm:mt-6 bg-background/50 shadow-sm">
            <JsonTools />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-4 sm:py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">DataPlayground</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            All data is stored locally in your browser and is not sent to any server.
          </p>
        </div>
      </footer>
    </div>
  )
}
