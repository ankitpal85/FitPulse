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
    <nav className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center">
          <PersonStandingIcon className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          FitPulse
        </h1>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 border-l-4 transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-medium border-emerald-500 translate-x-1"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 border-transparent"
              }`
            }
          >
            <Icon className="size-5 transition-transform group-hover:scale-110" />
            <span className="text-base flex-1">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all duration-200 active:scale-95"
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
