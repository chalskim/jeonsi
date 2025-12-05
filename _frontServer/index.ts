import { registerRootComponent } from 'expo'
import App from './App'

const storageAvailable = (type: 'localStorage' | 'sessionStorage') => {
  try {
    const s = (window as any)[type] as Storage
    const k = '__jeonsi_storage_test__'
    s.setItem(k, k)
    s.removeItem(k)
    return true
  } catch {
    return false
  }
}

if (!storageAvailable('localStorage')) {
  const store = new Map<string, string>()
  const mem = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v))
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => {
      store.clear()
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  try {
    const ls: any = (window as any).localStorage
    ls.getItem = mem.getItem
    ls.setItem = mem.setItem
    ls.removeItem = mem.removeItem
    ls.clear = mem.clear
    ls.key = mem.key
    Object.defineProperty(ls, 'length', { get: () => mem.length })
  } catch {
    try {
      Object.defineProperty(window as any, 'localStorage', {
        value: {
          getItem: mem.getItem,
          setItem: mem.setItem,
          removeItem: mem.removeItem,
          clear: mem.clear,
          key: mem.key,
          get length() {
            return mem.length
          },
        },
        configurable: true,
      })
    } catch {}
  }
}

if (!storageAvailable('sessionStorage')) {
  const store = new Map<string, string>()
  const mem = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v))
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => {
      store.clear()
    },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  try {
    const ss: any = (window as any).sessionStorage
    ss.getItem = mem.getItem
    ss.setItem = mem.setItem
    ss.removeItem = mem.removeItem
    ss.clear = mem.clear
    ss.key = mem.key
    Object.defineProperty(ss, 'length', { get: () => mem.length })
  } catch {
    try {
      Object.defineProperty(window as any, 'sessionStorage', {
        value: {
          getItem: mem.getItem,
          setItem: mem.setItem,
          removeItem: mem.removeItem,
          clear: mem.clear,
          key: mem.key,
          get length() {
            return mem.length
          },
        },
        configurable: true,
      })
    } catch {}
  }
}

registerRootComponent(App)
