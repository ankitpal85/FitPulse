import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import type { ProfileFormData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, MoonIcon, Scale, SunIcon, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import api from "../configs/api";
import toast from "react-hot-toast";


const Profile = () => {

  const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400
  })

  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user?.age || 0,
        weight: user?.weight || 0,
        height: user?.height || 0,
        goal: user?.goal || 'maintain',
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400,
      })
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user])

  const handleSave = async () => {
    try {
      const updates = {
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal,
        dailyCalorieIntake: formData.dailyCalorieIntake,
        dailyCalorieBurn: formData.dailyCalorieBurn,
      };

      await api.put(`/api/users/${user?.id}`, updates)
      await fetchUser(user?.token || '')
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error?.message || 'Failed to update profile');
    }
  }

  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;
    return { totalFoodEntries, totalActivities }
  }

  const stats = getStats();

  if (!user || !formData) return null

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your settings</p>
      </div>

      <div className="profile-content">
        {/* Left col */}
        <Card>
          {/* Card title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{user?.username || 'Your Profile'}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Member since {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 animate-fade-in">
              <Input label="Age" type="number" value={formData.age}
                onChange={(v) => setFormData({ ...formData, age: Number(v) })}
                min={13} max={120} />

              <Input label="Weight (kg)" type="number" value={formData.weight}
                onChange={(v) => setFormData({ ...formData, weight: Number(v) })}
                min={20} max={300} />

              <Input label="Height (cm)" type="number" value={formData.height}
                onChange={(v) => setFormData({ ...formData, height: Number(v) })}
                min={100} max={250} />

              <Select label="Fitness Goal" value={formData.goal as string}
                onChange={(v) => setFormData({ ...formData, goal: v as 'lose' | 'maintain' | 'gain' })}
                options={goalOptions} />

              <Input label="Daily Calorie Intake (kcal)" type="number" value={formData.dailyCalorieIntake}
                onChange={(v) => setFormData({ ...formData, dailyCalorieIntake: Number(v) })}
                min={1000} max={5000} />

              <Input label="Daily Calorie Burn Goal (kcal)" type="number" value={formData.dailyCalorieBurn}
                onChange={(v) => setFormData({ ...formData, dailyCalorieBurn: Number(v) })}
                min={100} max={3000} />

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1"
                  onClick={() => {
                    setIsEditing(false)
                    fetchUserData()
                  }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 stagger-children">
                {/* Age */}
                <div className="profile-info-row">
                  <div className="size-10 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/15 flex items-center justify-center">
                    <Calendar className="size-4.5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{user.age || 'Not set'} {user.age ? 'years' : ''}</p>
                  </div>
                </div>

                {/* Weight */}
                <div className="profile-info-row">
                  <div className="size-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center">
                    <Scale className="size-4.5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{user.weight || 'Not set'} {user.weight ? 'kg' : ''}</p>
                  </div>
                </div>

                {/* Height */}
                {user.height !== undefined && user.height !== 0 && (
                  <div className="profile-info-row">
                    <div className="size-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center">
                      <User className="size-4.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{user.height} cm</p>
                    </div>
                  </div>
                )}

                {/* Goal */}
                <div className="profile-info-row">
                  <div className="size-10 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center">
                    <Target className="size-4.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {goalLabels[user?.goal || 'maintain']}
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="secondary" onClick={() => setIsEditing(true)} className="w-full mt-4">
                Edit Profile
              </Button>
            </>
          )}
        </Card>

        {/* Right col */}
        <div className="space-y-4">
          {/* Stats Card */}
          <Card>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-violet-500/10 dark:bg-violet-500/10 rounded-xl border border-violet-500/10">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.totalFoodEntries}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Food entries</p>
              </div>
              <div className="text-center p-4 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-xl border border-cyan-500/10">
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalActivities}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Activities</p>
              </div>
            </div>
          </Card>

          {/* Theme toggle for mobile */}
          <div className="lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/[0.05] hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-all duration-300 cursor-pointer">
              {theme === 'light' ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
              <span className="text-base">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Logout button */}
          <Button variant="danger" onClick={logout} className="w-full">
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
