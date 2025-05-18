"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { ChartConfig } from "./types"

interface ChartStoreContextType {
  charts: ChartConfig[]
  activeChart: string | null
  setCharts: (charts: ChartConfig[]) => void
  setActiveChart: (id: string | null) => void
  addChart: (chart: ChartConfig) => void
  updateChart: (id: string, updates: Partial<ChartConfig>) => void
  removeChart: (id: string) => void
  saveToSession: () => void
  loadFromSession: () => void
}

const ChartStoreContext = createContext<ChartStoreContextType | undefined>(undefined)

export function ChartStoreProvider({ children }: { children: ReactNode }) {
  const [charts, setChartsState] = useState<ChartConfig[]>([])
  const [activeChart, setActiveChartState] = useState<string | null>(null)

  const setCharts = useCallback(
    (newCharts: ChartConfig[]) => {
      setChartsState(newCharts)
      saveToSessionStorage(newCharts, activeChart)
    },
    [activeChart],
  )

  const setActiveChart = useCallback(
    (id: string | null) => {
      setActiveChartState(id)
      saveToSessionStorage(charts, id)
    },
    [charts],
  )

  const addChart = useCallback(
    (chart: ChartConfig) => {
      const newCharts = [...charts, chart]
      setChartsState(newCharts)
      setActiveChartState(chart.id)
      saveToSessionStorage(newCharts, chart.id)
    },
    [charts],
  )

  const updateChart = useCallback(
    (id: string, updates: Partial<ChartConfig>) => {
      const newCharts = charts.map((chart) => (chart.id === id ? { ...chart, ...updates } : chart))
      setChartsState(newCharts)
      saveToSessionStorage(newCharts, activeChart)
    },
    [charts, activeChart],
  )

  const removeChart = useCallback(
    (id: string) => {
      const newCharts = charts.filter((chart) => chart.id !== id)
      setChartsState(newCharts)

      if (activeChart === id) {
        const newActiveChart = newCharts.length > 0 ? newCharts[0].id : null
        setActiveChartState(newActiveChart)
        saveToSessionStorage(newCharts, newActiveChart)
      } else {
        saveToSessionStorage(newCharts, activeChart)
      }
    },
    [charts, activeChart],
  )

  const saveToSession = useCallback(() => {
    saveToSessionStorage(charts, activeChart)
  }, [charts, activeChart])

  const loadFromSession = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const savedData = sessionStorage.getItem("dataPlaygroundCharts")
        if (savedData) {
          const parsed = JSON.parse(savedData)
          setChartsState(parsed.charts || [])
          setActiveChartState(parsed.activeChart || null)
        }
      }
    } catch (error) {
      console.error("Error loading chart data from session storage:", error)
    }
  }, [])

  const saveToSessionStorage = (charts: ChartConfig[], activeChart: string | null) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dataPlaygroundCharts", JSON.stringify({ charts, activeChart }))
      }
    } catch (error) {
      console.error("Error saving chart data to session storage:", error)
    }
  }

  // Load charts from session storage on initial mount
  useEffect(() => {
    loadFromSession()
  }, [loadFromSession])

  return (
    <ChartStoreContext.Provider
      value={{
        charts,
        activeChart,
        setCharts,
        setActiveChart,
        addChart,
        updateChart,
        removeChart,
        saveToSession,
        loadFromSession,
      }}
    >
      {children}
    </ChartStoreContext.Provider>
  )
}

export function useChartStore() {
  const context = useContext(ChartStoreContext)
  if (context === undefined) {
    throw new Error("useChartStore must be used within a ChartStoreProvider")
  }
  return context
}
