"use client"

import { useState, useTransition, useActionState} from "react"

import { Label } from "@/_components/ui/Label"
import { Input } from "@/_components/ui/Input"
import { Button } from "@/_components/ui/Button"
import { Checkbox } from "@/_components/ui/Checkbox"
import AuthForm from "../AuthForm"
import AuthLink from "../AuthLink"
import { AuthAction } from "./action"
import { Loader2 } from "lucide-react"

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false)
  const [pending, startTransition] = useTransition()
  const [state, formAction] = useActionState(AuthAction, { error: "" })

  return (
    <AuthForm headers="Login">
      <form action={(formData) => startTransition(() => formAction(formData))} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email"
            className="h-10"
            placeholder="Enter your email"
          />
          {state?.error && !state?.email && (
            <p className="text-xs font-semibold text-rose-500">Email is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password"
            className="h-10"
            placeholder="Enter your password"
          />
          {state?.error && !state?.password && (
            <p className="text-xs font-semibold text-rose-500">Password is required</p>
          )}
        </div>

        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              className="border-slate-400"
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <Label htmlFor="remember" className="text-sm text-slate-500">
              Remember Me
            </Label>
          </div>
          <AuthLink href="/forgot-password" link="Forgot Password?" />
        </div>

        <Button type="submit" disabled={pending} className="w-full text-base font-semibold inset-shadow-sky-200 from-sky-600 to-sky-500 hover:inset-shadow-sky-300 hover:from-sky-700 hover:to-sky-600">
          {pending 
            ? (
                <div className="flex items-center space-x-1 gap-x-1">
                  <Loader2 className="animate-spin"/>Logging in...
                </div>
              ) 
            : "Login"
          }
        </Button>

        <div className="text-center text-xs italic text-slate-400 font-semibold">
          <span>Liveshift presented</span>
        </div>
      </form>

      {state?.error && (
        <p className="text-rose-500 mt-2 text-center">{state.error}</p>
      )}
    </AuthForm>
  )
}

export default LoginPage
