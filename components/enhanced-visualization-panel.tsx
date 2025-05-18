"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChartIcon,
  Plus,
  Trash2,
  Download,
  AreaChart,
  Gauge,
  BarChartHorizontal,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDataStore } from "@/lib/data-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useChartStore } from "@/lib/chart-store"
import type { ChartType, ChartConfig } from "@/lib/types"

export function EnhancedVisualizationPanel() {
  const { schema, data } = useDataStore()
  const { charts, activeChart, setActiveChart, addChart, updateChart, removeChart } = useChartStore()
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState<string | null>(null)
  const [chartSizes, setChartSizes] = useState<{ width: number; height: number }>({ width: 800, height: 500 })

  const chartRefs = useRef<{ [key: string]: SVGSVGElement | null }>({})
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const numberFields = schema.filter((field) => field.type === "number").map((field) => field.name)
  const allFields = schema.map((field) => field.name)

  // Add a new chart
  const handleAddChart = () => {
    if (schema.length === 0 || data.length === 0) {
      setError("You need to define a schema and add data before visualizing")
      return
    }

    const defaultXAxis = schema[0]?.name || ""
    const defaultYAxis = numberFields[0] || ""

    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: "bar",
      title: `Chart ${charts.length + 1}`,
      xAxis: defaultXAxis,
      yAxis: defaultYAxis,
      showLegend: true,
      showGrid: true,
      showLabels: true,
      colorScheme: "purple",
      animation: true,
    }

    addChart(newChart)
  }

  // Download chart as SVG
  const downloadChart = (id: string) => {
    const svgEl = chartRefs.current[id]
    if (!svgEl) return

    const svgData = new XMLSerializer().serializeToString(svgEl)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `${charts.find((c) => c.id === id)?.title || "chart"}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  // Toggle fullscreen for a chart
  const toggleFullscreen = (id: string) => {
    setFullscreen(fullscreen === id ? null : id)
  }

  // Update chart sizes based on container size
  const updateChartSizes = () => {
    if (fullscreen) {
      setChartSizes({
        width: Math.max(window.innerWidth - 40, 300),
        height: Math.max(window.innerHeight - 150, 300),
      })
      return
    }

    const containerEl = containerRefs.current[activeChart || ""]
    if (!containerEl) return

    const containerWidth = containerEl.clientWidth || 300
    // Adjust height based on screen size
    const containerHeight =
      window.innerWidth < 640 ? Math.min(350, window.innerHeight - 200) : Math.min(500, window.innerHeight - 300)

    setChartSizes({
      width: Math.max(containerWidth - 20, 280),
      height: containerHeight,
    })
  }

  // Render a chart based on its configuration
  const renderChart = (config: ChartConfig) => {
    const svgRef = chartRefs.current[config.id]
    if (!svgRef) return

    // Clear previous chart
    d3.select(svgRef).selectAll("*").remove()

    const width = chartSizes.width
    const height = chartSizes.height
    const margin = {
      top: Math.max(20, Math.floor(height * 0.08)),
      right: Math.max(20, Math.floor(width * 0.08)),
      bottom: Math.max(30, Math.floor(height * 0.12)),
      left: Math.max(40, Math.floor(width * 0.12)),
    }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3
      .select(svgRef)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Add title
    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(config.title)

    // Get color scheme
    const getColorScheme = () => {
      switch (config.colorScheme) {
        case "blue":
          return ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"]
        case "green":
          return ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"]
        case "orange":
          return ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"]
        case "rainbow":
          return ["#ef4444", "#f97316", "#eab308", "#10b981", "#0ea5e9", "#8b5cf6", "#ec4899"]
        case "purple":
        default:
          return [
            "hsl(var(--primary))",
            "hsl(262, 83%, 68%)",
            "hsl(262, 83%, 78%)",
            "hsl(262, 83%, 48%)",
            "hsl(282, 83%, 58%)",
            "hsl(242, 83%, 58%)",
            "hsl(302, 83%, 58%)",
          ]
      }
    }

    const colorScheme = getColorScheme()

    // Get data values
    const xValues = data.map((d) => d[config.xAxis])
    const yValues = data.map((d) => Number(d[config.yAxis] || 0))

    // Render different chart types
    switch (config.type) {
      case "bar":
        renderBarChart(svg, xValues, yValues, innerWidth, innerHeight, config, colorScheme[0])
        break
      case "horizontal-bar":
        renderHorizontalBarChart(svg, xValues, yValues, innerWidth, innerHeight, config, colorScheme[0])
        break
      case "pie":
        renderPieChart(svg, xValues, innerWidth, innerHeight, config, colorScheme)
        break
      case "donut":
        renderDonutChart(svg, xValues, innerWidth, innerHeight, config, colorScheme)
        break
      case "line":
        renderLineChart(svg, xValues, yValues, innerWidth, innerHeight, config, colorScheme[0])
        break
      case "area":
        renderAreaChart(svg, xValues, yValues, innerWidth, innerHeight, config, colorScheme[0])
        break
      case "scatter":
        renderScatterChart(svg, xValues, yValues, innerWidth, innerHeight, config, colorScheme[0])
        break
      case "gauge":
        renderGaugeChart(svg, yValues, innerWidth, innerHeight, config, colorScheme)
        break
    }
  }

  // Function to update chart when settings change
  const updateChartSettings = (chartId: string) => {
    const chart = charts.find((c) => c.id === chartId)
    if (chart && chartRefs.current[chartId]) {
      renderChart(chart)
    }
  }

  // Render a bar chart
  const renderBarChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    color: string,
  ) => {
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
      .style("font-size", "12px")

    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px")

    // Grid
    if (config.showGrid) {
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
    }

    // Bars with animation
    const bars = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[config.xAxis]) || 0)
      .attr("width", xScale.bandwidth())
      .attr("fill", color)
      .attr("rx", 6)
      .attr("opacity", 0.8)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 1)
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8)
      })

    if (config.animation) {
      bars
        .attr("y", innerHeight)
        .attr("height", 0)
        .transition()
        .duration(800)
        .attr("y", (d) => yScale(Number(d[config.yAxis] || 0)))
        .attr("height", (d) => innerHeight - yScale(Number(d[config.yAxis] || 0)))
    } else {
      bars
        .attr("y", (d) => yScale(Number(d[config.yAxis] || 0)))
        .attr("height", (d) => innerHeight - yScale(Number(d[config.yAxis] || 0)))
    }

    // Labels
    if (config.showLabels) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .text(config.xAxis)
        .style("font-size", "14px")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(config.yAxis)
        .style("font-size", "14px")
    }
  }

  // Render a horizontal bar chart
  const renderHorizontalBarChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    color: string,
  ) => {
    // Scales
    const yScale = d3.scaleBand().domain(xValues).range([0, innerHeight]).padding(0.2)

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(yValues) || 0])
      .nice()
      .range([0, innerWidth])

    // Axes
    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px")

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px")

    // Grid
    if (config.showGrid) {
      svg
        .append("g")
        .attr("class", "grid")
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(innerHeight)
            .tickFormat(() => ""),
        )
        .selectAll("line")
        .attr("stroke", "hsl(var(--border))")
        .attr("stroke-opacity", 0.2)
    }

    // Bars with animation
    const bars = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d[config.xAxis]) || 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", color)
      .attr("rx", 6)
      .attr("opacity", 0.8)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 1)
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8)
      })

    if (config.animation) {
      bars
        .attr("x", 0)
        .attr("width", 0)
        .transition()
        .duration(800)
        .attr("width", (d) => xScale(Number(d[config.yAxis] || 0)))
    } else {
      bars.attr("width", (d) => xScale(Number(d[config.yAxis] || 0)))
    }

    // Labels
    if (config.showLabels) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .text(config.yAxis)
        .style("font-size", "14px")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(config.xAxis)
        .style("font-size", "14px")
    }
  }

  // Render a pie chart
  const renderPieChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    colorScheme: string[],
  ) => {
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
      .innerRadius(0)
      .outerRadius(radius * 0.8)

    const outerArc = d3
      .arc<d3.PieArcDatum<{ key: string; value: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(pieData.map((d) => d.key))
      .range(colorScheme)

    const g = svg.append("g").attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)

    // Add the arcs
    const path = g
      .selectAll("path")
      .data(pie(pieData))
      .enter()
      .append("path")
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

    if (config.animation) {
      path
        .transition()
        .duration(800)
        .attrTween("d", (d) => {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
          return (t) => arc(interpolate(t)) || ""
        })
    } else {
      path.attr("d", arc)
    }

    // Add labels with lines
    if (config.showLabels) {
      const text = g
        .selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d) => d.data.key)
        .style("font-size", "12px")

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
    }

    // Add legend
    if (config.showLegend) {
      const legend = svg
        .append("g")
        .attr("transform", `translate(${innerWidth + 20}, 0)`)
        .selectAll("g")
        .data(pieData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)

      legend
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d) => colorScale(d.key))

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text((d) => `${d.key} (${d.value})`)
        .style("font-size", "12px")
    }
  }

  // Render a donut chart
  const renderDonutChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    colorScheme: string[],
  ) => {
    // Count occurrences for donut chart
    const counts: Record<string, number> = {}
    xValues.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1
    })

    const pieData = Object.entries(counts).map(([key, value]) => ({ key, value }))

    // Create donut chart
    const radius = Math.min(innerWidth, innerHeight) / 2

    const pie = d3.pie<{ key: string; value: number }>().value((d) => d.value)

    const arc = d3
      .arc<d3.PieArcDatum<{ key: string; value: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8)

    const outerArc = d3
      .arc<d3.PieArcDatum<{ key: string; value: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(pieData.map((d) => d.key))
      .range(colorScheme)

    const g = svg.append("g").attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`)

    // Add the arcs
    const path = g
      .selectAll("path")
      .data(pie(pieData))
      .enter()
      .append("path")
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

    if (config.animation) {
      path
        .transition()
        .duration(800)
        .attrTween("d", (d) => {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
          return (t) => arc(interpolate(t)) || ""
        })
    } else {
      path.attr("d", arc)
    }

    // Add center text
    g.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", "16px").text(config.xAxis)

    // Add labels with lines
    if (config.showLabels) {
      const text = g
        .selectAll(".label-text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("class", "label-text")
        .attr("dy", ".35em")
        .text((d) => d.data.key)
        .style("font-size", "12px")

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
    }

    // Add legend
    if (config.showLegend) {
      const legend = svg
        .append("g")
        .attr("transform", `translate(${innerWidth + 20}, 0)`)
        .selectAll("g")
        .data(pieData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)

      legend
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d) => colorScale(d.key))

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text((d) => `${d.key} (${d.value})`)
        .style("font-size", "12px")
    }
  }

  // Render a line chart
  const renderLineChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    color: string,
  ) => {
    // Sort data by x-axis for line chart
    const sortedData = [...data].sort((a, b) => {
      if (a[config.xAxis] < b[config.xAxis]) return -1
      if (a[config.xAxis] > b[config.xAxis]) return 1
      return 0
    })

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(sortedData.map((d) => d[config.xAxis]))
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(yValues) || 0])
      .nice()
      .range([innerHeight, 0])

    // Line generator
    const line = d3
      .line<any>()
      .x((d) => xScale(d[config.xAxis]) || 0)
      .y((d) => yScale(Number(d[config.yAxis] || 0)))
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Add a gradient for the line
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `line-gradient-${config.id}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(0))
      .attr("x2", 0)
      .attr("y2", yScale(d3.max(yValues) || 0))

    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.8)

    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 1)

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")

    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px")

    // Grid
    if (config.showGrid) {
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
    }

    // Add a subtle area under the line
    const area = d3
      .area<any>()
      .x((d) => xScale(d[config.xAxis]) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(Number(d[config.yAxis] || 0)))
      .curve(d3.curveCatmullRom.alpha(0.5))

    svg.append("path").datum(sortedData).attr("fill", `${color}20`).attr("d", area)

    // Line with animation
    const path = svg
      .append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", `url(#line-gradient-${config.id})`)
      .attr("stroke-width", 3)

    if (config.animation) {
      const totalLength = path.node()?.getTotalLength() || 0
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("d", line)
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0)
    } else {
      path.attr("d", line)
    }

    // Points
    svg
      .selectAll(".point")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d[config.xAxis]) || 0)
      .attr("cy", (d) => yScale(Number(d[config.yAxis] || 0)))
      .attr("r", 6)
      .attr("fill", "white")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .on("mouseover", function () {
        d3.select(this).attr("r", 8).attr("opacity", 1)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 6).attr("opacity", 0.8)
      })

    // Labels
    if (config.showLabels) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .text(config.xAxis)
        .style("font-size", "14px")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(config.yAxis)
        .style("font-size", "14px")
    }
  }

  // Render an area chart
  const renderAreaChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    color: string,
  ) => {
    // Sort data by x-axis for area chart
    const sortedData = [...data].sort((a, b) => {
      if (a[config.xAxis] < b[config.xAxis]) return -1
      if (a[config.xAxis] > b[config.xAxis]) return 1
      return 0
    })

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(sortedData.map((d) => d[config.xAxis]))
      .range([0, innerWidth])

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
      .style("font-size", "12px")

    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px")

    // Grid
    if (config.showGrid) {
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
    }

    // Add gradient for area
    const areaGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `area-gradient-${config.id}`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    areaGradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.7)
    areaGradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.1)

    // Area generator
    const area = d3
      .area<any>()
      .x((d) => xScale(d[config.xAxis]) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(Number(d[config.yAxis] || 0)))
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Line generator for the top of the area
    const line = d3
      .line<any>()
      .x((d) => xScale(d[config.xAxis]) || 0)
      .y((d) => yScale(Number(d[config.yAxis] || 0)))
      .curve(d3.curveCatmullRom.alpha(0.5))

    // Add the area
    const areaPath = svg.append("path").datum(sortedData).attr("fill", `url(#area-gradient-${config.id})`)

    if (config.animation) {
      areaPath
        .attr(
          "d",
          d3
            .area<any>()
            .x((d) => xScale(d[config.xAxis]) || 0)
            .y0(innerHeight)
            .y1(innerHeight),
        )
        .transition()
        .duration(800)
        .attr("d", area)
    } else {
      areaPath.attr("d", area)
    }

    // Add the line on top of the area
    const linePath = svg
      .append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)

    if (config.animation) {
      const totalLength = linePath.node()?.getTotalLength() || 0
      linePath
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("d", line)
        .transition()
        .duration(1000)
        .attr("stroke-dashoffset", 0)
    } else {
      linePath.attr("d", line)
    }

    // Points
    svg
      .selectAll(".point")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d[config.xAxis]) || 0)
      .attr("cy", (d) => yScale(Number(d[config.yAxis] || 0)))
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .on("mouseover", function () {
        d3.select(this).attr("r", 7).attr("opacity", 1)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5).attr("opacity", 0.8)
      })

    // Labels
    if (config.showLabels) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .text(config.xAxis)
        .style("font-size", "14px")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(config.yAxis)
        .style("font-size", "14px")
    }
  }

  // Render a scatter chart
  const renderScatterChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    xValues: string[],
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    color: string,
  ) => {
    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((d) => Number(d[config.xAxis] || 0))) || 0])
      .nice()
      .range([0, innerWidth])

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
      .style("font-size", "12px")

    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px")

    // Grid
    if (config.showGrid) {
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
    }

    // Points with animation
    const points = svg
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(Number(d[config.xAxis] || 0)))
      .attr("cy", (d) => yScale(Number(d[config.yAxis] || 0)))
      .attr("fill", color)
      .attr("opacity", 0.7)
      .on("mouseover", function () {
        d3.select(this).attr("r", 10).attr("opacity", 1)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 8).attr("opacity", 0.7)
      })

    if (config.animation) {
      points.attr("r", 0).transition().duration(800).attr("r", 8)
    } else {
      points.attr("r", 8)
    }

    // Labels
    if (config.showLabels) {
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
        .attr("text-anchor", "middle")
        .text(config.xAxis)
        .style("font-size", "14px")

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text(config.yAxis)
        .style("font-size", "14px")
    }
  }

  // Render a gauge chart
  const renderGaugeChart = (
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    yValues: number[],
    innerWidth: number,
    innerHeight: number,
    config: ChartConfig,
    colorScheme: string[],
  ) => {
    const radius = Math.min(innerWidth, innerHeight) / 2
    const centerX = innerWidth / 2
    const centerY = innerHeight / 2

    // Calculate average value
    const avgValue = d3.mean(yValues) || 0
    const maxValue = d3.max(yValues) || 100

    // Create a scale for the gauge
    const scale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([-Math.PI / 2, Math.PI / 2])

    // Create an arc generator
    const arc = d3
      .arc<number>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI / 2)
      .endAngle((d) => scale(d))

    // Create background arc
    svg
      .append("path")
      .datum(maxValue)
      .attr("transform", `translate(${centerX}, ${centerY})`)
      .attr("d", arc)
      .attr("fill", "#e5e5e5")

    // Create foreground arc with animation
    const foreground = svg
      .append("path")
      .datum(0)
      .attr("transform", `translate(${centerX}, ${centerY})`)
      .attr("fill", colorScheme[0])

    if (config.animation) {
      foreground
        .transition()
        .duration(1000)
        .attrTween("d", () => {
          const interpolate = d3.interpolate(0, avgValue)
          return (t) => arc(interpolate(t)) || ""
        })
    } else {
      foreground.datum(avgValue).attr("d", arc)
    }

    // Add needle
    const needleLength = radius * 0.8
    const needleRadius = radius * 0.02
    const needleAngle = scale(avgValue)

    const needleLine = svg
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", centerX + needleLength * Math.cos(needleAngle))
      .attr("y2", centerY + needleLength * Math.sin(needleAngle))
      .attr("stroke", "#444")
      .attr("stroke-width", 2)

    if (config.animation) {
      needleLine
        .attr("x2", centerX)
        .attr("y2", centerY)
        .transition()
        .duration(1000)
        .attr("x2", centerX + needleLength * Math.cos(needleAngle))
        .attr("y2", centerY + needleLength * Math.sin(needleAngle))
    }

    // Add needle circle
    svg.append("circle").attr("cx", centerX).attr("cy", centerY).attr("r", needleRadius).attr("fill", "#444")

    // Add min and max labels
    svg
      .append("text")
      .attr("x", centerX - radius * 0.6)
      .attr("y", centerY + radius * 0.2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("0")

    svg
      .append("text")
      .attr("x", centerX + radius * 0.6)
      .attr("y", centerY + radius * 0.2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(maxValue.toFixed(0))

    // Add value text
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY + radius * 0.4)
      .attr("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .text(avgValue.toFixed(1))

    // Add label
    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY + radius * 0.6)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text(config.yAxis)
  }

  // Update all charts when data changes
  useEffect(() => {
    charts.forEach((chart) => {
      if (chartRefs.current[chart.id]) {
        renderChart(chart)
      }
    })
  }, [charts, data, schema, chartSizes])

  // Set default chart when none exists
  useEffect(() => {
    if (schema.length > 0 && data.length > 0 && charts.length === 0) {
      handleAddChart()
    }
  }, [schema, data, charts.length])

  // Update chart sizes on window resize
  useEffect(() => {
    const handleResize = () => {
      updateChartSizes()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [fullscreen, activeChart])

  useEffect(() => {
    const containers = Object.values(containerRefs.current).filter(Boolean) as HTMLDivElement[]

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        updateChartSizes()
      })

      containers.forEach((container) => {
        if (container) resizeObserver.observe(container)
      })

      return () => {
        containers.forEach((container) => {
          if (container) resizeObserver.unobserve(container)
        })
        resizeObserver.disconnect()
      }
    }
  }, [charts, activeChart])

  if (schema.length === 0) {
    return (
      <div className="text-center py-8 sm:py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 gradient-heading">Visualization</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
          You need to define your schema first before you can visualize data.
        </p>
        <Button variant="outline" asChild className="rounded-lg text-sm">
          <a href="#schema">Go to Schema Builder</a>
        </Button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 sm:py-16 px-4 bg-muted/10 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 gradient-heading">Visualization</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
          You need to add some data before you can visualize it.
        </p>
        <Button variant="outline" asChild className="rounded-lg text-sm">
          <a href="#data">Go to Data Entry</a>
        </Button>
      </div>
    )
  }

  // If a chart is in fullscreen mode, only show that chart
  if (fullscreen) {
    const chart = charts.find((c) => c.id === fullscreen)
    if (chart) {
      return (
        <div className="fixed inset-0 z-50 bg-background p-4 sm:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold gradient-heading">{chart.title}</h2>
            <Button variant="outline" size="icon" onClick={() => setFullscreen(null)} className="rounded-full">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 border rounded-xl p-4 sm:p-6 overflow-auto bg-gradient-to-br from-background to-muted/10 shadow-sm chart-container">
            <div className="flex justify-center h-full" ref={(el) => (containerRefs.current[chart.id] = el)}>
              <svg
                ref={(el) => (chartRefs.current[chart.id] = el)}
                className="max-w-full h-full"
                key={`fullscreen-${chart.id}`}
              ></svg>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight gradient-heading">Visualization</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Create interactive charts to visualize your data.
          </p>
        </div>
        <Button onClick={handleAddChart} className="gap-2 rounded-lg w-full sm:w-auto text-sm">
          <Plus className="h-4 w-4" /> Add Chart
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {charts.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4 bg-muted/10 rounded-xl">
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            Click "Add Chart" to create your first visualization.
          </p>
          <Button onClick={handleAddChart} className="gap-2 rounded-lg text-sm">
            <Plus className="h-4 w-4" /> Add Chart
          </Button>
        </div>
      ) : (
        <Tabs value={activeChart || charts[0].id} onValueChange={setActiveChart} className="w-full">
          <TabsList className="w-full flex overflow-x-auto p-1 rounded-xl">
            {charts.map((chart) => (
              <TabsTrigger key={chart.id} value={chart.id} className="rounded-lg flex-shrink-0 text-xs sm:text-sm">
                {chart.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {charts.map((chart) => (
            <TabsContent key={chart.id} value={chart.id} className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="lg:col-span-2 border shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 flex flex-row justify-between items-center p-3 sm:p-6">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{chart.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {chart.type.charAt(0).toUpperCase() + chart.type.slice(1).replace("-", " ")} Chart
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => renderChart(chart)}
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
                        title="Reload chart"
                      >
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleFullscreen(chart.id)}
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => downloadChart(chart.id)}
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeChart(chart.id)}
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 overflow-auto chart-container min-h-[400px]">
                    <div className="flex justify-center h-full" ref={(el) => (containerRefs.current[chart.id] = el)}>
                      <svg
                        ref={(el) => (chartRefs.current[chart.id] = el)}
                        className="max-w-full h-full"
                        key={chart.id}
                      ></svg>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Chart Settings</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Configure your visualization</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor={`chart-title-${chart.id}`} className="text-sm">
                        Chart Title
                      </Label>
                      <Input
                        id={`chart-title-${chart.id}`}
                        value={chart.title}
                        onChange={(e) => updateChart(chart.id, { title: e.target.value })}
                        className="rounded-lg text-sm h-8 sm:h-9"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor={`chart-type-${chart.id}`} className="text-sm">
                        Chart Type
                      </Label>
                      <Select
                        value={chart.type}
                        onValueChange={(value) => updateChart(chart.id, { type: value as ChartType })}
                      >
                        <SelectTrigger id={`chart-type-${chart.id}`} className="gap-2 rounded-lg text-sm h-8 sm:h-9">
                          <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar" className="flex items-center gap-2 text-sm">
                            <BarChart className="h-3 w-3 sm:h-4 sm:w-4" /> Bar Chart
                          </SelectItem>
                          <SelectItem value="horizontal-bar" className="flex items-center gap-2 text-sm">
                            <BarChartHorizontal className="h-3 w-3 sm:h-4 sm:w-4" /> Horizontal Bar
                          </SelectItem>
                          <SelectItem value="pie" className="flex items-center gap-2 text-sm">
                            <PieChart className="h-3 w-3 sm:h-4 sm:w-4" /> Pie Chart
                          </SelectItem>
                          <SelectItem value="donut" className="flex items-center gap-2 text-sm">
                            <PieChart className="h-3 w-3 sm:h-4 sm:w-4" /> Donut Chart
                          </SelectItem>
                          <SelectItem value="line" className="flex items-center gap-2 text-sm">
                            <LineChart className="h-3 w-3 sm:h-4 sm:w-4" /> Line Chart
                          </SelectItem>
                          <SelectItem value="area" className="flex items-center gap-2 text-sm">
                            <AreaChart className="h-3 w-3 sm:h-4 sm:w-4" /> Area Chart
                          </SelectItem>
                          <SelectItem value="scatter" className="flex items-center gap-2 text-sm">
                            <ScatterChartIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Scatter Plot
                          </SelectItem>
                          <SelectItem value="gauge" className="flex items-center gap-2 text-sm">
                            <Gauge className="h-3 w-3 sm:h-4 sm:w-4" /> Gauge Chart
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor={`x-axis-${chart.id}`} className="text-sm">
                        X-Axis / Category
                      </Label>
                      <Select value={chart.xAxis} onValueChange={(value) => updateChart(chart.id, { xAxis: value })}>
                        <SelectTrigger id={`x-axis-${chart.id}`} className="rounded-lg text-sm h-8 sm:h-9">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {allFields.map((field) => (
                            <SelectItem key={field} value={field} className="text-sm">
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {chart.type !== "pie" && chart.type !== "donut" && chart.type !== "gauge" && (
                      <div className="space-y-1 sm:space-y-2">
                        <Label htmlFor={`y-axis-${chart.id}`} className="text-sm">
                          Y-Axis / Value
                        </Label>
                        <Select value={chart.yAxis} onValueChange={(value) => updateChart(chart.id, { yAxis: value })}>
                          <SelectTrigger id={`y-axis-${chart.id}`} className="rounded-lg text-sm h-8 sm:h-9">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {numberFields.map((field) => (
                              <SelectItem key={field} value={field} className="text-sm">
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor={`color-scheme-${chart.id}`} className="text-sm">
                        Color Scheme
                      </Label>
                      <Select
                        value={chart.colorScheme}
                        onValueChange={(value) =>
                          updateChart(chart.id, {
                            colorScheme: value as "purple" | "blue" | "green" | "orange" | "rainbow",
                          })
                        }
                      >
                        <SelectTrigger id={`color-scheme-${chart.id}`} className="rounded-lg text-sm h-8 sm:h-9">
                          <SelectValue placeholder="Select color scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purple" className="text-sm">
                            Purple
                          </SelectItem>
                          <SelectItem value="blue" className="text-sm">
                            Blue
                          </SelectItem>
                          <SelectItem value="green" className="text-sm">
                            Green
                          </SelectItem>
                          <SelectItem value="orange" className="text-sm">
                            Orange
                          </SelectItem>
                          <SelectItem value="rainbow" className="text-sm">
                            Rainbow
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`show-legend-${chart.id}`} className="text-sm">
                        Show Legend
                      </Label>
                      <Switch
                        id={`show-legend-${chart.id}`}
                        checked={chart.showLegend}
                        onCheckedChange={(checked) => updateChart(chart.id, { showLegend: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`show-grid-${chart.id}`} className="text-sm">
                        Show Grid
                      </Label>
                      <Switch
                        id={`show-grid-${chart.id}`}
                        checked={chart.showGrid}
                        onCheckedChange={(checked) => updateChart(chart.id, { showGrid: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`show-labels-${chart.id}`} className="text-sm">
                        Show Labels
                      </Label>
                      <Switch
                        id={`show-labels-${chart.id}`}
                        checked={chart.showLabels}
                        onCheckedChange={(checked) => updateChart(chart.id, { showLabels: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`animation-${chart.id}`} className="text-sm">
                        Animation
                      </Label>
                      <Switch
                        id={`animation-${chart.id}`}
                        checked={chart.animation}
                        onCheckedChange={(checked) => updateChart(chart.id, { animation: checked })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 border-t p-3 sm:p-4">
                    <Button onClick={() => updateChartSettings(chart.id)} className="w-full rounded-lg text-sm">
                      Update Chart
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
