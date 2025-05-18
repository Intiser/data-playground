import Link from "next/link"
import { ArrowRight, BarChart3, Database, FileJson, Layers, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-hero-pattern">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>DataPlayground</span>
          </div>
          <Link href="/visualizer">
            <Button className="rounded-full">Start Visualizing</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              100% Client-Side Data Visualization
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] gradient-heading">
              DataPlayground
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Visualize your data intuitively — without storing anything on a server.
              <br />
              No backend. No tracking. No login.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/visualizer">
                <Button size="lg" className="gap-2 rounded-full px-8">
                  Start Visualizing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {/* Hero image removed as requested */}
          </div>
        </section>

        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl gradient-heading">See It In Action</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                DataPlayground makes it easy to visualize your data with just a few clicks
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold">Define Your Schema</h3>
                <p className="text-muted-foreground">
                  Create fields for your data structure like Product, Category, and Sales.
                </p>
                <div className="mt-4 w-full rounded-lg border p-3 bg-muted/10">
                  <div className="text-xs font-medium">Schema Example:</div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product</span>
                      <span className="text-muted-foreground">Text</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category</span>
                      <span className="text-muted-foreground">Text</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sales</span>
                      <span className="text-muted-foreground">Number</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold">Enter Your Data</h3>
                <p className="text-muted-foreground">Add rows of data based on your schema structure.</p>
                <div className="mt-4 w-full rounded-lg border p-3 bg-muted/10">
                  <div className="text-xs font-medium">Data Example:</div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span>Laptop</span>
                      <span>Electronics</span>
                      <span>1200</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span>Smartphone</span>
                      <span>Electronics</span>
                      <span>2500</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span>Headphones</span>
                      <span>Audio</span>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold">Visualize Results</h3>
                <p className="text-muted-foreground">Create interactive charts to visualize your data.</p>
                <div className="mt-4 w-full rounded-lg border overflow-hidden">
                  <img
                    src="/chart-example-dark.png"
                    alt="Bar chart showing product sales data"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link href="/visualizer">
                <Button size="lg" className="rounded-full px-8">
                  Try It Yourself
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl gradient-heading">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                A powerful yet simple workflow to visualize your data in minutes
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Define Your Schema</h3>
                <p className="text-muted-foreground">
                  Create custom fields with different data types to structure your data exactly how you need it.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Input Your Data</h3>
                <p className="text-muted-foreground">
                  Add, edit, and delete rows of data with automatic validation based on your schema.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Visualize with D3.js</h3>
                <p className="text-muted-foreground">
                  Create interactive charts and graphs that update in real-time as your data changes.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileJson className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Export & Import</h3>
                <p className="text-muted-foreground">
                  Save your work as JSON and reload it later, all within your browser.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-background/50 p-6 shadow-sm card-hover">
                <div className="rounded-full bg-primary/10 p-3">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Light & Dark Mode</h3>
                <p className="text-muted-foreground">
                  Switch between light and dark themes based on your preference or system settings.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/20 p-6 shadow-sm card-hover">
                <h3 className="text-xl font-bold">100% Client-Side</h3>
                <p className="text-muted-foreground">
                  No backend. No tracking. No login. All data is session-based and lives in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20 p-12 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl gradient-heading">
              Ready to visualize your data?
            </h2>
            <p className="max-w-[750px] text-lg text-muted-foreground">
              Start creating beautiful, interactive visualizations in seconds.
            </p>
            <Link href="/visualizer">
              <Button size="lg" className="mt-4 rounded-full px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium">DataPlayground</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DataPlayground. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
