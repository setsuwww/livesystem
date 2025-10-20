'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now()
    const newToast = {
      id,
      message,
      type: options.type || 'info', // 'success' | 'error' | 'info'
      duration: options.duration || 3000,
    }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, newToast.duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col gap-3 z-[9999]">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border
              ${toast.type === 'success' ? 'bg-green-100/80 border-green-300 text-green-800' :
                toast.type === 'error' ? 'bg-rose-100/80 border-rose-300 text-rose-800' :
                'bg-sky-100/80 border-sky-300 text-sky-800'}
              animate-slide-in`}
          >
            <span className="font-medium text-sm">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-500 hover:text-slate-700">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
