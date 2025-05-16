"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SchemaField, DataRow, ChartConfig } from "./types"

interface DataStoreContextType {
  schema: SchemaField[]
  data: DataRow[]
  charts: ChartConfig[]
  activeChart: string | null
  setSchema: (schema: SchemaField[]) => void
  setData: (data: DataRow[]) => void
  setCharts: (charts: ChartConfig[]) => void
  setActiveChart: (chartId: string | null) => void
  addRow: (row: DataRow) => void
  updateRow: (index: number, row: DataRow) => void
  removeRow: (index: number) => void
  clearData: () => void
  saveToSession: () => void
  loadFromSession: () => void
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [schema, setSchemaState] = useState<SchemaField[]>([])
  const [data, setDataState] = useState<DataRow[]>([])
  const [charts, setChartsState] = useState<ChartConfig[]>([])
  const [activeChart, setActiveChartState] = useState<string | null>(null)

  const setSchema = useCallback(
    (newSchema: SchemaField[]) => {
      setSchemaState(newSchema)
      saveToSessionStorage(newSchema, data, charts, activeChart)
    },
    [data, charts, activeChart],
  )

  const setData = useCallback(
    (newData: DataRow[]) => {
      setDataState(newData)
      saveToSessionStorage(schema, newData, charts, activeChart)
    },
    [schema, charts, activeChart],
  )

  const setCharts = useCallback(
    (newCharts: ChartConfig[]) => {
      setChartsState(newCharts)
      saveToSessionStorage(schema, data, newCharts, activeChart)
    },
    [schema, data, activeChart],
  )

  const setActiveChart = useCallback(
    (chartId: string | null) => {
      setActiveChartState(chartId)
      saveToSessionStorage(schema, data, charts, chartId)
    },
    [schema, data, charts],
  )

  const addRow = useCallback(
    (row: DataRow) => {
      const newData = [...data, row]
      setDataState(newData)
      saveToSessionStorage(schema, newData, charts, activeChart)
    },
    [data, schema, charts, activeChart],
  )

  const updateRow = useCallback(
    (index: number, row: DataRow) => {
      const newData = [...data]
      newData[index] = row
      setDataState(newData)
      saveToSessionStorage(schema, newData, charts, activeChart)
    },
    [data, schema, charts, activeChart],
  )

  const removeRow = useCallback(
    (index: number) => {
      const newData = [...data]
      newData.splice(index, 1)
      setDataState(newData)
      saveToSessionStorage(schema, newData, charts, activeChart)
    },
    [data, schema, charts, activeChart],
  )

  const clearData = useCallback(() => {
    setDataState([])
    saveToSessionStorage(schema, [], charts, activeChart)
  }, [schema, charts, activeChart])

  const saveToSession = useCallback(() => {
    saveToSessionStorage(schema, data, charts, activeChart)
  }, [schema, data, charts, activeChart])

  const loadFromSession = useCallback(() => {
    try {
      const savedData = sessionStorage.getItem("dataPlayground")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setSchemaState(parsed.schema || [])
        setDataState(parsed.data || [])
        setChartsState(parsed.charts || [])
        setActiveChartState(parsed.activeChart || null)
      }
    } catch (error) {
      console.error("Error loading data from session storage:", error)
    }
  }, [])

  const saveToSessionStorage = (
    schema: SchemaField[],
    data: DataRow[],
    charts: ChartConfig[],
    activeChart: string | null,
  ) => {
    try {
      sessionStorage.setItem("dataPlayground", JSON.stringify({ schema, data, charts, activeChart }))
    } catch (error) {
      console.error("Error saving to session storage:", error)
    }
  }

  return (
    <DataStoreContext.Provider
      value={{
        schema,
        data,
        charts,
        activeChart,
        setSchema,
        setData,
        setCharts,
        setActiveChart,
        addRow,
        updateRow,
        removeRow,
        clearData,
        saveToSession,
        loadFromSession,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
