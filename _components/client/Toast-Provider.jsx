"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/_lib/utils"

const ToastContext = createContext()

const toastVariants = {
  success: {
    icon: <CheckCircle className="text-emerald-500" size={20} />,
    title: "Success",
    border: "border-l-4 border-emerald-500",
    bg: "bg-gradient-to-r from-emerald-100 to-transparent border-emerald-100",
  },
  error: {
    icon: <XCircle className="text-rose-500" size={20} />,
    title: "Error",
    border: "border-l-4 border-rose-500",
    bg: "bg-gradient-to-r from-rose-100 to-transparent border-rose-100",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500" size={20} />,
    title: "Warning",
    border: "border-l-4 border-yellow-500",
    bg: "bg-gradient-to-r from-yellow-100 to-transparent border-yellow-100",
  },
  info: {
    icon: <Info className="text-sky-500" size={20} />,
    title: "Info",
    border: "border-l-4 border-sky-500",
    bg: "bg-gradient-to-r from-sky-100 to-transparent border-sky-100",
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now()
    const newToast = {
      id,
      title: options.title || toastVariants[options.type || "info"].title,
      description: message,
      type: options.type || "info",
      duration: options.duration || 4000,
    }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => { setToasts((prev) => prev.filter((t) => t.id !== id))
    }, newToast.duration)
  }, [])

  const removeToast = useCallback((id) => { setToasts((prev) => prev.filter((t) => t.id !== id))}, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col gap-3 z-[9999] w-[360px] max-w-[90vw]">
        {toasts.map((toast) => {
          const variant = toastVariants[toast.type] || toastVariants.info
          return (
            <div key={toast.id} className={cn(
                "relative flex items-start gap-3 bg-white border-0 border-l-4 shadow-lg rounded-r-sm p-4 pr-6 w-full animate-slide-in backdrop-blur-sm",
                variant.border
              )}
            >
              {/* Icon */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full border ${variant.bg}`}>
                  {variant.icon}
                </div>
                <div className="">
                  <p className="font-semibold text-slate-800">{toast.title}</p>
                  <p className="text-sm text-slate-500">{toast.description}</p>
                </div>
              </div>

              {/* Close */}
              <button onClick={() => removeToast(toast.id)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>

              <div
                className={cn( "absolute bottom-0 left-0 h-[1px] rounded-bl-xl rounded-br-xl",
                    toast.type === "success" ? "bg-emerald-500"
                    : toast.type === "error" ? "bg-rose-500"
                    : toast.type === "warning" ? "bg-yellow-500"
                    : "bg-sky-500"
                )}
                style={{ width: "100%", animation: `progress ${toast.duration}ms linear forwards`}}
              />
            </div>
          )
        })}
      </div>

      {/* Animations */}
      <style jsx global>
      {`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}
      </style>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
