import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import BottomNav from "../components/BottomNav"

const Layout = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export default Layout