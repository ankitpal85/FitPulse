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
    <main className="login-page-container relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

      <form onSubmit={handleSubmit} className="relative z-10 animate-fade-in">
        <h2 className="text-3xl font-bold gradient-text">
          {state === 'login' ? "Welcome Back" : "Get Started"}
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {state === 'login'
            ? 'Sign in to continue your fitness journey.'
            : 'Create your account to start tracking.'}
        </p>

        {/* Username */}
        {state !== 'login' && (
          <div className="mt-5 relative">
            <label htmlFor="username" className="font-medium text-sm text-slate-700 dark:text-slate-300">
              Username
            </label>
            <AtSignIcon className="absolute left-3 top-10 text-slate-400 size-4.5" />
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
        <div className="mt-5 relative">
          <label className="font-medium text-sm text-slate-700 dark:text-slate-300" htmlFor="email">
            Email
          </label>
          <MailIcon className="absolute left-3 top-10 text-slate-400 size-4.5" />
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
        <div className="mt-5 relative">
          <label htmlFor="password" className="font-medium text-sm text-slate-700 dark:text-slate-300">
            Password
          </label>
          <LockIcon className="absolute left-3 top-10 text-slate-400 size-4.5" />
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
            className="absolute right-3 top-10 text-slate-400 hover:text-violet-400 transition-colors"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="login-button"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing...</span>
          ) : state === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Toggle */}
        {state === 'login' ? (
          <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => toggleState('signup')}
              className="ml-1 text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?
            <button
              type="button"
              onClick={() => toggleState('login')}
              className="ml-1 text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </form>
    </main>
  )
}

export default Login