import { Activity, Home, User, Utensils } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/food", label: "Food", icon: Utensils },
    { path: "/activity", label: "Activity", icon: Activity },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-white/80 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-2xl px-2 lg:hidden transition-all duration-300 z-40 shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`size-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
