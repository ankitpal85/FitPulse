import { Loader2Icon } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="flex flex-col items-center gap-3">
        <Loader2Icon className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
