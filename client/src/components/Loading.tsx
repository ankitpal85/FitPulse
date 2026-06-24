import { Loader2Icon } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 blur-xl opacity-30 animate-pulse" />
          <Loader2Icon className="h-10 w-10 animate-spin text-violet-500 relative" />
        </div>
        <p className="text-sm font-medium gradient-text animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
