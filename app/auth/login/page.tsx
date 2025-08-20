// /app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import AuthForm from "@/app/auth/AuthForm"
import AuthLink from "@/app/auth/AuthLink"
import { api } from "@/lib/api"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) { setError("Both fields are required")
      return
    }

    setIsSubmitting(true)
    try { const { data } = await api.post("/auth/login", { email, password })

      if (data.success) { if (data.role === "ADMIN") router.push("/admin/dashboard")
        else if (data.role === "USER") router.push("/user/dashboard")
        else if (data.role === "MANAGER") router.push("/manager/dashboard")
      }
    } 
    catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
    } 
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthForm headers="Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {error && !email && (
            <p className="text-xs text-red-500">Email is required</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error && !password && (
            <p className="text-xs text-red-500">Password is required</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <Label htmlFor="remember" className="text-sm text-gray-500">
              Remember Me
            </Label>
          </div>

          <AuthLink href="/forgot-password" link="Forgot Password?" question=""/>
        </div>

        {/* Button */}
        <Button type="submit" className="w-full text-base font-semibold bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <AuthLink question="Don't have an account?" link="Register" href="/auth/register" className="text-sm mt-4"/>
    </AuthForm>
  )
}

export default LoginPage
