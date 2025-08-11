import { create } from "zustand"

type User = {
  id: number
  name: string
  email: string
  role: string
}

type UserState = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))
