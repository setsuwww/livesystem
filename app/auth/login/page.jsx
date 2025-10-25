"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Label } from "@/_components/ui/Label"
import { Input } from "@/_components/ui/Input"
import { Button } from "@/_components/ui/Button"
import { Checkbox } from "@/_components/ui/Checkbox"
import AuthForm from "../AuthForm"
import AuthLink from "../AuthLink"
import { api } from "@/_lib/api"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) { setError("Both fields are required")
      return
    }

    setIsSubmitting(true)
    try { const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true })

      if (data.success) { if (data.role === "ADMIN") router.push("/admin/dashboard")
        else if (data.role === "USER") router.push("/user/dashboard")
        else if (data.role === "COORDINATOR") router.push("/coordinator/dashboard")
        else if (data.role === "EMPLOYEE") router.push("/employee/dashboard")
      }
    } 
    catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } 
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthForm headers="Login">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} className="h-10"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {error && !email && (
            <p className="text-xs text-rose-500">Email is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} className="h-10"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error && !password && (
            <p className="text-xs text-rose-500">Password is required</p>
          )}
        </div>

        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={rememberMe} className="border-slate-400"
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <Label htmlFor="remember" className="text-sm text-slate-500">
              Remember Me
            </Label>
          </div>
          <AuthLink href="/forgot-password" link="Forgot Password?" question=""/>
        </div>

        <Button type="submit" className="w-full text-base font-semibold inset-shadow-sky-200 from-sky-600 to-sky-500 hover:inset-shadow-sky-300 hover:from-sky-700 hover:to-sky-600" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      {error && <p className="text-rose-500 mt-2 text-center">{error}</p>}
    </AuthForm>
  )
}

export default LoginPage
