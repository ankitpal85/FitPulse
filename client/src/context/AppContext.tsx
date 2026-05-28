import { createContext, useContext, useEffect, useState } from "react"
import type { FoodEntry, ActivityEntry, User, Credentials, AppContextType } from "../types"
import { useNavigate } from "react-router-dom"
import api from "../configs/api"

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [isUserFetched, setIsUserFetched] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

  const signup = async (credentials: Credentials) => {
    const { data } = await api.post("/api/auth/local/register", {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    })

    const userWithToken: User = { ...data.user, token: data.jwt }
    setUser(userWithToken)
    localStorage.setItem("token", data.jwt)

    const isOnboarded = data.user?.age && data.user?.weight && data.user?.goal
    setOnboardingCompleted(!!isOnboarded)

    navigate(isOnboarded ? "/" : "/onboarding")
  }

  const login = async (credentials: Credentials) => {
    const { data } = await api.post("/api/auth/local", {
      identifier: credentials.email,
      password: credentials.password,
    })

    const userWithToken: User = { ...data.user, token: data.jwt }
    setUser(userWithToken)
    localStorage.setItem("token", data.jwt)

    const isOnboarded = data.user?.age && data.user?.weight && data.user?.goal
    setOnboardingCompleted(!!isOnboarded)

    navigate(isOnboarded ? "/" : "/onboarding")
  }

  const fetchUser = async (token: string) => {
    try {
      localStorage.setItem("token", token)
      const { data } = await api.get("/api/users/me")
      // Strapi /api/users/me returns user object directly
      setUser({ ...data, token })

      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true)
      }
    } catch (err) {
      console.error("Fetch user error:", err)
      localStorage.removeItem("token")
    } finally {
      setIsUserFetched(true)
    }
  }

  const fetchFoodLogs = async () => {
    try {
      const { data } = await api.get("/api/food-logs")
      // Strapi v5 custom controller returns array directly
      setAllFoodLogs(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      console.error("Fetch food logs error:", err)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const { data } = await api.get("/api/activity-logs")
      setAllActivityLogs(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      console.error("Fetch activity logs error:", err)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setOnboardingCompleted(false)
    setAllFoodLogs([])
    setAllActivityLogs([])
    navigate("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      (async () => {
        await fetchUser(token)
        await Promise.all([fetchFoodLogs(), fetchActivityLogs()])
      })()
    } else {
      setIsUserFetched(true)
    }
  }, [])

  const value: AppContextType = {
    user,
    setUser,
    isUserFetched,
    onboardingCompleted,
    setOnboardingCompleted,
    signup,
    login,
    logout,
    fetchUser,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
    refreshFoodLogs: fetchFoodLogs,
    refreshActivityLogs: fetchActivityLogs,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider")
  }
  return context
}