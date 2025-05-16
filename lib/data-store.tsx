"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SchemaField, DataRow } from "./types"

interface DataStoreContextType {
  schema: SchemaField[]
  data: DataRow[]
  setSchema: (schema: SchemaField[]) => void
  setData: (data: DataRow[]) => void
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

  const setSchema = useCallback(
    (newSchema: SchemaField[]) => {
      setSchemaState(newSchema)
      saveToSessionStorage(newSchema, data)
    },
    [data],
  )

  const setData = useCallback(
    (newData: DataRow[]) => {
      setDataState(newData)
      saveToSessionStorage(schema, newData)
    },
    [schema],
  )

  const addRow = useCallback(
    (row: DataRow) => {
      const newData = [...data, row]
      setDataState(newData)
      saveToSessionStorage(schema, newData)
    },
    [data, schema],
  )

  const updateRow = useCallback(
    (index: number, row: DataRow) => {
      const newData = [...data]
      newData[index] = row
      setDataState(newData)
      saveToSessionStorage(schema, newData)
    },
    [data, schema],
  )

  const removeRow = useCallback(
    (index: number) => {
      const newData = [...data]
      newData.splice(index, 1)
      setDataState(newData)
      saveToSessionStorage(schema, newData)
    },
    [data, schema],
  )

  const clearData = useCallback(() => {
    setDataState([])
    saveToSessionStorage(schema, [])
  }, [schema])

  const saveToSession = useCallback(() => {
    saveToSessionStorage(schema, data)
  }, [schema, data])

  const loadFromSession = useCallback(() => {
    try {
      const savedData = sessionStorage.getItem("dataPlayground")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setSchemaState(parsed.schema || [])
        setDataState(parsed.data || [])
      }
    } catch (error) {
      console.error("Error loading data from session storage:", error)
    }
  }, [])

  const saveToSessionStorage = (schema: SchemaField[], data: DataRow[]) => {
    try {
      sessionStorage.setItem("dataPlayground", JSON.stringify({ schema, data }))
    } catch (error) {
      console.error("Error saving to session storage:", error)
    }
  }

  return (
    <DataStoreContext.Provider
      value={{
        schema,
        data,
        setSchema,
        setData,
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
