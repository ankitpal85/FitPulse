import { lazy, Suspense } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { useAppContext } from "./context/AppContext"
import Loading from "./components/Loading"
import ErrorBoundary from "./components/ErrorBoundary"
import { Toaster } from "react-hot-toast"

// Lazy load pages for code splitting
const Layout = lazy(() => import("./pages/Layout"))
const Login = lazy(() => import("./pages/Login"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const FoodLog = lazy(() => import("./pages/FoodLog"))
const Activity = lazy(() => import("./pages/Activity"))
const Profile = lazy(() => import("./pages/Profile"))

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) return <Loading />

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />

      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />

            <Route
              path="/onboarding"
              element={user && !onboardingCompleted ? <Onboarding /> : <Navigate to="/" />}
            />

            <Route
              path="/"
              element={user ? (onboardingCompleted ? <Layout /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />}
            >
              <Route index element={<Dashboard />} />
              <Route path="food" element={<FoodLog />} />
              <Route path="activity" element={<Activity />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App