"use client"

import { useToast } from "@/_components/client/Toast-Provider"

export default function ToastPlayground() {
  const { addToast } = useToast()

  return (
    <div className="p-6 flex items-center flex-col gap-3 wax-w-sm">
      <button
        onClick={() =>
          addToast("User created successfully", {
            type: "success",
            title: "Success",
            description: "Your user was added to the system.",
          })
        }
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        Show Success Toast
      </button>

      <button
        onClick={() =>
          addToast("Something went wrong", {
            type: "error",
            title: "Error",
            description: "Please check your input and try again.",
          })
        }
        className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
      >
        Show Error Toast
      </button>

      <button
        onClick={() =>
          addToast("We are processing your request", {
            type: "info",
            title: "Info",
            description: "This might take a few seconds.",
          })
        }
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Show Info Toast
      </button>
    </div>
  )
}
