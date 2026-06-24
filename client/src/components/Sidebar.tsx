import { ActivityIcon, HomeIcon, MoonIcon, PersonStandingIcon, SunIcon, UserIcon, UtensilsIcon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/food", label: "Food", icon: UtensilsIcon },
    { path: "/activity", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];

  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="hidden lg:flex flex-col w-64 bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border-r border-slate-200/60 dark:border-white/[0.06] p-6 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <PersonStandingIcon className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">
          FitPulse
        </h1>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1.5">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-violet-500/10 to-cyan-500/10 dark:from-violet-500/15 dark:to-cyan-500/15 border border-violet-500/20 dark:border-violet-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`size-5 transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-violet-600 dark:text-violet-400' : ''}`} />
                <span className={`text-base flex-1 font-medium ${isActive ? 'gradient-text' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-6 border-t border-slate-200/60 dark:border-white/[0.06]">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
        >
          {theme === "light" ? (
            <MoonIcon className="size-5" />
          ) : (
            <SunIcon className="size-5" />
          )}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
