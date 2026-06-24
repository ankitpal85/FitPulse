import { useEffect, useState } from "react"
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { Activity, FlameIcon, UtensilsIcon, Ruler, ScaleIcon, TrendingUpIcon, ZapIcon } from "lucide-react"
import CaloriesChart from "../components/CaloriesChart"


const Dashboard = () => {

  const { user, allActivityLogs, allFoodLogs } = useAppContext()
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([])
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([])

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  const loadUserData = () => {
    const today = new Date().toISOString().split('T')[0];
    const foodData = allFoodLogs.filter((f: FoodEntry) => f.createdAt?.split('T')[0] === today)
    setTodayFood(foodData)
    const activityData = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today)
    setTodayActivities(activityData)
  }

  useEffect(() => {
    loadUserData();
  }, [allActivityLogs, allFoodLogs, user])

  const totalCalories: number = todayFood.reduce(
    (sum, item) => sum + (item.calories || 0),
    0
  )

  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;

  const totalActiveMinutes: number = todayActivities.reduce((sum, item) => sum + (item.duration || 0), 0)

  const totalBurned: number = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)

  const caloriePercentage = Math.round((totalCalories / (DAILY_CALORIE_LIMIT || 1)) * 100);

  const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_CALORIE_LIMIT)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="gradient-bg-animated text-white p-6 pt-12 pb-20 rounded-b-3xl relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />

        <p className="text-white/70 text-sm font-medium relative z-10">
          Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1 relative z-10">{`Hi there! 👏 ${user?.username || ''}`}</h1>

        {/* Motivation Card */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="text-white/90 font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid stagger-children">
        {/* Calories Card */}
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 flex items-center justify-center">
                <UtensilsIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Consumed</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalCalories}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Limit</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{DAILY_CALORIE_LIMIT}</p>
            </div>
          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />

          <div className="mt-4 flex justify-between items-center">
            <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
              <span className="text-sm font-medium">
                {remainingCalories >= 0
                  ? `${remainingCalories} kcal remaining`
                  : `${Math.abs(remainingCalories)} kcal over`}
              </span>
            </div>
            <span className="text-sm text-slate-400">{caloriePercentage}%</span>
          </div>

          <div className="border-t border-slate-100 dark:border-white/[0.06] my-4"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 flex items-center justify-center">
                <FlameIcon className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Burned</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalBurned}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{user?.dailyCalorieBurn || 400}</p>
            </div>
          </div>
          <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
        </Card>

        {/* Stats Row */}
        <div className="dashboard-card-grid">
          {/* Active Minutes */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalActiveMinutes} </p>
            <p className="text-sm text-slate-400">minutes today</p>
          </Card>

          {/* Activities Count */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Workouts</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{todayActivities.length} </p>
            <p className="text-sm text-slate-400">activities logged</p>
          </Card>
        </div>


        {/* Goal Card */}
        {user && (
          <Card className="bg-gradient-to-r from-violet-600/90 to-cyan-500/90 dark:from-violet-600/80 dark:to-cyan-500/80 border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Your Goal</p>
                <p className="text-white font-semibold capitalize">
                  {user.goal === 'lose' && 'Lose Weight'}
                  {user.goal === 'maintain' && 'Maintain Weight'}
                  {user.goal === 'gain' && 'Gain Muscle'}
                  {!user.goal && 'Not set'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Body Metrics Card */}
        {user && user.weight && (
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center mb-4">
                <ScaleIcon className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Body Metrics</h3>
                <p className="text-slate-500 text-sm">Your stats</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06]">
                    <ScaleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Weight</span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{user.weight} kg</span>
              </div>

              {user.height && user.height > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06]">
                      <Ruler className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Height</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{user.height} cm</span>
                </div>
              )}

              {user.height && user.height > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">BMI</span>
                    {(() => {
                      const bmi = (user.weight! / Math.pow(user.height! / 100, 2)).toFixed(1);
                      const getStatus = (b: number) => {
                        if (b < 18.5) return { color: 'text-cyan-500' };
                        if (b < 25) return { color: 'text-emerald-500' };
                        if (b < 30) return { color: 'text-amber-500' };
                        return { color: 'text-rose-500' };
                      }
                      const status = getStatus(Number(bmi));
                      return <span className={`text-lg font-bold ${status.color}`}>{bmi}</span>
                    })()}
                  </div>

                  {/* BMI Scale */}
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-cyan-400 opacity-30"></div>
                    <div className="flex-1 bg-emerald-400 opacity-30"></div>
                    <div className="flex-1 bg-amber-400 opacity-30"></div>
                    <div className="flex-1 bg-rose-400 opacity-30"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quick Summary */}
        <Card>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/[0.06]">
              <span className="text-slate-500 dark:text-slate-400">Meals logged</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{todayFood.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/[0.06]">
              <span className="text-slate-500 dark:text-slate-400">Total Calories</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{totalCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 dark:text-slate-400">Active time</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{totalActiveMinutes} min</span>
            </div>
          </div>
        </Card>

        {/* Activity & Intake Graph */}
        <Card className="col-span-2">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">This Week's Progress</h3>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
