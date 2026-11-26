import { useEffect, useState } from 'react'
import { read, save } from '../services/storageServices'
import type { StorageKey } from '../services/storageKeys'

export function useLocalStorage<T>(key: StorageKey, initialValue: T) {
  const [value, setValue] = useState<T>(() => read(key, initialValue))

  useEffect(() => {
    save(key, value)
  }, [key, value])

  return [value, setValue] as const
}
