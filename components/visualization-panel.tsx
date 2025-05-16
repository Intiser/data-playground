"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataStore } from "@/lib/data-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BarChart, LineChart, PieChart, ScatterChartIcon as ScatterPlot } from "lucide-react"

type ChartType = "bar" | "pie" | "line" | "scatter"

export function VisualizationPanel() {
  const { schema, data } = useDataStore()
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [xAxis, setXAxis] = useState<string>("")
  const [yAxis, setYAxis] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const svgRef = useRef<SVGSVGElement>(null)

  const numberFields = schema.filter((field) => field.type === "number").map((field) => field.name)
  const allFields = schema.map((field) => field.name)

  useEffect(() => {
    if (schema.length === 0 || data.length === 0) {
      setError("You need to define a schema and add data before visualizing")
      return
    }

    if (!xAxis || (chartType !== "pie" && !yAxis)) {
      setError("Please select fields for visualization")
      return
    }

    setError(null)

    if (svgRef.current) {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove()

      const width = 800
      const height = 500
      const margin = { top: 50, right: 50, bottom: 70, left: 70 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      // Get data values
      const xValues = data.map((d) => d[xAxis])

      if (chartType === "bar") {
        const yValues = data.map((d) => Number(d[yAxis] || 0))

        // Scales
        const xScale = d3.scaleBand().domain(xValues).range([0, innerWidth]).padding(0.2)

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(yValues) || 0])
          .nice()
          .range([innerHeight, 0])

        // Axes
        svg
          .append("g")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")

        svg.append("g").call(d3.axisLeft(yScale))

        // Bars
        svg
          .selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => xScale(d[xAxis]) || 0)
          .attr("y", (d) => yScale(Number(d[yAxis] || 0)))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => innerHeight - yScale(Number(d[yAxis] || 0)))
          .attr("fill", "hsl(var(--primary))")
          .attr("rx", 6)
          .attr("opacity", 0.8)
          .on("mouseover", function () {
            d3.select(this).attr("opacity", 1)
          })
          .on("mouseout", function () {
            d3.select(this).attr("opacity", 0.8)
          })

        // Labels
        svg
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .text(xAxis)

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -margin.left + 20)
          .attr("text-anchor", "middle")
          .text(yAxis)
      } else if (chartType === "pie") {
        // Count occurrences for pie chart
        const counts: Record<string, number> = {}
        xValues.forEach((value) => {
          counts[value] = (counts[value] || 0) + 1
        })

        const pieData = Object.entries(counts).map(([key, value]) => ({ key, value }))

        // Create pie chart
        const radius = Math.min(innerWidth, innerHeight) / 2

        const pie = d3.pie<{ key: string; value: number }>().value((d) => d.value)

        const arc = d3
          .arc<d3.PieArcDatum<{ key: string; value: number }>>()
          .innerRadius(radius * 0.4)
          .outerRadius(radius * 0.8)

        const outerArc = d3
          .arc<d3.PieArcDatum<{ key: string; value: number }>>()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)

        const colorScale = d3
          .scaleOrdinal<string>()
          .domain(pieData.map((d) => d.key))
          .range([
            "hsl(var(--primary))",
            "hsl(262, 83%, 68%)",
            "hsl(262, 83%, 78%)",
            "hsl(262, 83%, 48%)",
            "hsl(282, 83%, 58%)",
            "hsl(242, 83%, 58%)",
            "hsl(302, 83%, 58%)",
            "hsl(322, 83%, 58%)",
            "hsl(222, 83%, 58%)",
          ])

        const g = svg.append("g").attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)

        // Add the arcs
        const path = g
          .selectAll("path")
          .data(pie(pieData))
          .enter()
          .append("path")
          .attr("d", arc)
          .attr("fill", (d) => colorScale(d.data.key))
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 0.8)
          .on("mouseover", function () {
            d3.select(this).style("opacity", 1)
          })
          .on("mouseout", function () {
            d3.select(this).style("opacity", 0.8)
          })

        // Add labels with lines
        const text = g
          .selectAll("text")
          .data(pie(pieData))
          .enter()
          .append("text")
          .attr("dy", ".35em")
          .text((d) => d.data.key)

        function midAngle(d: d3.PieArcDatum<{ key: string; value: number }>) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2
        }

        text
          .attr("transform", (d) => {
            const pos = outerArc.centroid(d)
            pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1)
            return `translate(${pos})`
          })
          .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
          .style("font-size", "12px")

        // Add lines connecting pie slices to labels
        g.selectAll("polyline")
          .data(pie(pieData))
          .enter()
          .append("polyline")
          .attr("points", (d) => {
            const pos = outerArc.centroid(d)
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1)
            return [arc.centroid(d), outerArc.centroid(d), pos]
          })
          .style("fill", "none")
          .style("stroke", "hsl(var(--muted-foreground))")
          .style("stroke-width", "1px")
      } else if (chartType === "line") {
        const yValues = data.map((d) => Number(d[yAxis] || 0))

        // Sort data by x-axis for line chart
        const sortedData = [...data].sort((a, b) => {
          if (a[xAxis] < b[xAxis]) return -1
          if (a[xAxis] > b[xAxis]) return 1
          return 0
        })

        // Scales
        const xScale = d3
          .scalePoint()
          .domain(sortedData.map((d) => d[xAxis]))
          .range([0, innerWidth])

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(yValues) || 0])
          .nice()
          .range([innerHeight, 0])

        // Line generator
        const line = d3
          .line<any>()
          .x((d) => xScale(d[xAxis]) || 0)
          .y((d) => yScale(Number(d[yAxis] || 0)))
          .curve(d3.curveCatmullRom.alpha(0.5))

        // Add a gradient for the line
        const gradient = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", yScale(0))
          .attr("x2", 0)
          .attr("y2", yScale(d3.max(yValues) || 0))

        gradient.append("stop").attr("offset", "0%").attr("stop-color", "hsl(var(--primary))").attr("stop-opacity", 0.8)

        gradient.append("stop").attr("offset", "100%").attr("stop-color", "hsl(var(--primary))").attr("stop-opacity", 1)

        // Axes
        svg
          .append("g")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")

        svg.append("g").call(d3.axisLeft(yScale))

        // Add a subtle area under the line
        svg
          .append("path")
          .datum(sortedData)
          .attr("fill", "hsl(var(--primary) / 0.1)")
          .attr(
            "d",
            d3
              .area<any>()
              .x((d) => xScale(d[xAxis]) || 0)
              .y0(innerHeight)
              .y1((d) => yScale(Number(d[yAxis] || 0)))
              .curve(d3.curveCatmullRom.alpha(0.5)),
          )

        // Line
        svg
          .append("path")
          .datum(sortedData)
          .attr("fill", "none")
          .attr("stroke", "url(#line-gradient)")
          .attr("stroke-width", 3)
          .attr("d", line)

        // Points
        svg
          .selectAll(".point")
          .data(sortedData)
          .enter()
          .append("circle")
          .attr("class", "point")
          .attr("cx", (d) => xScale(d[xAxis]) || 0)
          .attr("cy", (d) => yScale(Number(d[yAxis] || 0)))
          .attr("r", 6)
          .attr("fill", "white")
          .attr("stroke", "hsl(var(--primary))")
          .attr("stroke-width", 2)
          .attr("opacity", 0.8)
          .on("mouseover", function () {
            d3.select(this).attr("r", 8).attr("opacity", 1)
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 6).attr("opacity", 0.8)
          })

        // Labels
        svg
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .text(xAxis)

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -margin.left + 20)
          .attr("text-anchor", "middle")
          .text(yAxis)
      } else if (chartType === "scatter") {
        const yValues = data.map((d) => Number(d[yAxis] || 0))

        // Scales
        const xScale = d3
          .scaleLinear()
          .domain([0, d3.max(data.map((d) => Number(d[xAxis] || 0))) || 0])
          .nice()
          .range([0, innerWidth])

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(yValues) || 0])
          .nice()
          .range([innerHeight, 0])

        // Axes
        svg.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(xScale))

        svg.append("g").call(d3.axisLeft(yScale))

        // Add grid lines
        svg
          .append("g")
          .attr("class", "grid")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(
            d3
              .axisBottom(xScale)
              .tickSize(-innerHeight)
              .tickFormat(() => ""),
          )
          .selectAll("line")
          .attr("stroke", "hsl(var(--border))")
          .attr("stroke-opacity", 0.2)

        svg
          .append("g")
          .attr("class", "grid")
          .call(
            d3
              .axisLeft(yScale)
              .tickSize(-innerWidth)
              .tickFormat(() => ""),
          )
          .selectAll("line")
          .attr("stroke", "hsl(var(--border))")
          .attr("stroke-opacity", 0.2)

        // Points
        svg
          .selectAll(".point")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "point")
          .attr("cx", (d) => xScale(Number(d[xAxis] || 0)))
          .attr("cy", (d) => yScale(Number(d[yAxis] || 0)))
          .attr("r", 8)
          .attr("fill", "hsl(var(--primary))")
          .attr("opacity", 0.7)
          .on("mouseover", function () {
            d3.select(this).attr("r", 10).attr("opacity", 1)
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 8).attr("opacity", 0.7)
          })

        // Labels
        svg
          .append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight + margin.bottom - 10)
          .attr("text-anchor", "middle")
          .text(xAxis)

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -margin.left + 20)
          .attr("text-anchor", "middle")
          .text(yAxis)
      }
    }
  }, [chartType, xAxis, yAxis, data, schema])

  // Set default axes when schema or chart type changes
  useEffect(() => {
    if (schema.length > 0) {
      // Set default x-axis
      if (!xAxis || !schema.some((field) => field.name === xAxis)) {
        setXAxis(schema[0].name)
      }

      // Set default y-axis for charts that need it
      if (chartType !== "pie" && numberFields.length > 0) {
        if (!yAxis || !numberFields.includes(yAxis)) {
          setYAxis(numberFields[0])
        }
      }
    }
  }, [schema, chartType, xAxis, yAxis, numberFields])

  if (schema.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4 gradient-heading">Visualization</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You need to define your schema first before you can visualize data.
        </p>
        <Button variant="outline" asChild className="rounded-lg">
          <a href="#schema">Go to Schema Builder</a>
        </Button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4 gradient-heading">Visualization</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You need to add some data before you can visualize it.
        </p>
        <Button variant="outline" asChild className="rounded-lg">
          <a href="#data">Go to Data Entry</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight gradient-heading">Visualization</h2>
        <p className="text-muted-foreground mt-2">Create interactive charts to visualize your data.</p>
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
          <CardTitle>Chart Configuration</CardTitle>
          <CardDescription>Select chart type and configure axes</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                <SelectTrigger id="chart-type" className="gap-2 rounded-lg">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" /> Bar Chart
                  </SelectItem>
                  <SelectItem value="pie" className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" /> Pie Chart
                  </SelectItem>
                  <SelectItem value="line" className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" /> Line Chart
                  </SelectItem>
                  <SelectItem value="scatter" className="flex items-center gap-2">
                    <ScatterPlot className="h-4 w-4" /> Scatter Plot
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="x-axis">X-Axis / Category</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger id="x-axis" className="rounded-lg">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {allFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {chartType !== "pie" && (
              <div className="space-y-2">
                <Label htmlFor="y-axis">Y-Axis / Value</Label>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger id="y-axis" className="rounded-lg">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {numberFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-xl p-6 overflow-auto bg-gradient-to-br from-background to-muted/10 shadow-sm chart-container">
        <div className="flex justify-center">
          <svg ref={svgRef} className="max-w-full"></svg>
        </div>
      </div>
    </div>
  )
}
