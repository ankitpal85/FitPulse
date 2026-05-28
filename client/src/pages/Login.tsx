import { AtSignIcon, EyeOffIcon, EyeIcon, MailIcon, LockIcon } from "lucide-react"
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"

const Login = () => {
  const [state, setState] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      setIsSubmitting(false)
      return
    }

    if (state === 'signup' && (!username || username.length < 3)) {
      toast.error("Username must be at least 3 characters")
      setIsSubmitting(false)
      return
    }

    try {
      if (state === 'login') {
        await login({ email, password })
        toast.success("Welcome back 👋")
      } else {
        await signup({ username, email, password })
        toast.success("Account created 🎉")
      }
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.message || "Something went wrong"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleState = (newState: 'login' | 'signup') => {
    setState(newState)
    setUsername('')
    setEmail('')
    setPassword('')
    setShowPassword(false)
  }

  return (
    <main className="login-page-container">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          {state === 'login' ? "Sign In" : "Sign up"}
        </h2>

        <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
          {state === 'login'
            ? 'Please enter email and password to access.'
            : 'Please enter your details to create an account.'}
        </p>

        {/* Username */}
        {state !== 'login' && (
          <div className="mt-4 relative">
            <label htmlFor="username" className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Username
            </label>
            <AtSignIcon className="absolute left-3 top-10 text-gray-400 size-4.5" />
            <input
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Enter a username"
              className="login-input pl-10"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mt-4 relative">
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300" htmlFor="email">
            Email
          </label>
          <MailIcon className="absolute left-3 top-10 text-gray-400 size-4.5" />
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="login-input pl-10"
            required
          />
        </div>

        {/* Password */}
        <div className="mt-4 relative">
          <label htmlFor="password" className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Password
          </label>
          <LockIcon className="absolute left-3 top-10 text-gray-400 size-4.5" />
          <input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="login-input pl-10 pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="login-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing...</span>
          ) : state === "login" ? "Login" : "Sign up"}
        </button>

        {/* Toggle */}
        {state === 'login' ? (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => toggleState('signup')}
              className="ml-1 text-green-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
            <button
              type="button"
              onClick={() => toggleState('login')}
              className="ml-1 text-green-600 hover:underline"
            >
              Login
            </button>
          </p>
        )}
      </form>
    </main>
  )
}

export default Login