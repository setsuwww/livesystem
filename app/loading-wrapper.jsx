'use client'

import { useState, useEffect, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import GlobalLoading from "./loading"

export default function LoadingWrapper({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [pathname])

  useEffect(() => {
    if (!isPending) {
      const t = setTimeout(() => setLoading(false), 300)
      return () => clearTimeout(t)
    }
  }, [isPending])

  useEffect(() => {
    const handleClick = e => {
      const link = e.target.closest("a")
      if (!link) return
      const href = link.getAttribute("href")
      if (href && href.startsWith("/") && !href.startsWith("//") && href !== pathname) {
        e.preventDefault()
        setLoading(true)
        startTransition(() => {
          router.push(href)
        })
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [router, pathname])

  return (
    <>
      {loading && <GlobalLoading />}
      <div className={`${loading ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"} transition-all duration-300`}>
        {children}
      </div>
    </>
  )
}
