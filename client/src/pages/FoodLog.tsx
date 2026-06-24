import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { FoodEntry } from "../types";
import Card from "../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import Button from "../components/ui/Button";
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import api from "../configs/api";
import { toast } from "react-hot-toast";


const FoodLog = () => {

  const { allFoodLogs, setAllFoodLogs } = useAppContext()

  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    calories: 0,
    mealType: ''
  })

  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0];

  const loadEntries = () => {
    const todaysEntries = allFoodLogs.filter((e: FoodEntry) => e.createdAt?.split('T')[0] === today)
    setEntries(todaysEntries)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.post("/api/food-logs", { data: formData })
      const newEntry = Array.isArray(data) ? data[0] : (data.data || data);
      setAllFoodLogs(prev => [...prev, newEntry])
      setFormData({ name: '', calories: 0, mealType: '' })
      setShowForm(false)
      toast.success("Food entry added!")
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error?.message || "Failed to add food entry")
    }
  }

  const handleDelete = async (documentId: string) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this entry?');
      if (!confirm) return;
      await api.delete(`/api/food-logs/${documentId}`)
      setAllFoodLogs(prev => prev.filter((e) => e.documentId !== documentId))
      toast.success("Entry deleted")
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.error?.message || 'Failed to delete food entry')
    }
  }

  const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0)

  // Group entries by meal type
  const groupEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) acc[entry.mealType] = [];
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)

  const handleQuickAdd = (mealType: string) => {
    setFormData({ ...formData, mealType })
    setShowForm(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('image', file)

      const { data } = await api.post("/api/image-analysis", formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const result = data.data || data;
      if (result?.name && result?.calories) {
        setFormData({
          name: result.name,
          calories: Math.round(result.calories),
          mealType: formData.mealType || 'snack'
        })
        setShowForm(true)
        toast.success(`Detected: ${result.name} (${Math.round(result.calories)} kcal)`)
      } else {
        toast.error("Could not analyze image. Please enter details manually.")
        setShowForm(true)
      }
    } catch (error: any) {
      console.error("Image analysis error:", error)
      toast.error(error?.response?.data?.error?.message || "Image analysis failed. Please try manually.")
      setShowForm(true)
    } finally {
      setLoading(false)
      // Reset file input
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  useEffect(() => {
    loadEntries();
  }, [allFoodLogs])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Food Log</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your daily intake</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today's Total</p>
            <p className="text-xl font-bold gradient-text">{totalCalories} kcal</p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick Add Section */}
        {!showForm && (
          <div className="space-y-4 animate-fade-in">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Quick Add</h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map((activity) => (
                  <button
                    onClick={() => handleQuickAdd(activity.name)}
                    className="px-4 py-2 bg-slate-100 dark:bg-white/[0.05] hover:bg-violet-500/10 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-300 border border-transparent hover:border-violet-500/20"
                    key={activity.name}>
                    {activity.emoji} {activity.name}
                  </button>
                ))}
              </div>
            </Card>

            <Button className="w-full" onClick={() => setShowForm(true)}>
              <PlusIcon className="size-5" />
              Add Food Entry
            </Button>

            <Button className="w-full" onClick={() => { inputRef.current?.click() }}>
              <SparkleIcon className="size-5" />
              AI Food Snap
            </Button>
            <input onChange={handleImageChange} type="file"
              accept="image/*" hidden ref={inputRef} />
            {loading && (
              <div className="fixed inset-0 bg-slate-100/50 dark:bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 blur-xl opacity-30 animate-pulse" />
                    <Loader2Icon className="size-8 text-violet-500 animate-spin relative" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <Card className="border-violet-500/30 dark:border-violet-500/30 animate-fade-in">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">New Food Entry</h3>
            <form className="space-y-4" onSubmit={handleSubmit} >
              <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })}
                placeholder="e.g., Grilled Chicken Salad" required />

              <Input label="Calories" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })}
                placeholder="e.g., 350" required min={1} />

              <Select label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: v.toString() })}
                options={mealTypeOptions} placeholder="Select meal type"
                required />

              <div className="flex gap-3 pt-2">
                <Button className="flex-1" type="button" variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', calories: 0, mealType: "" })
                  }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Entry
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Entries List */}
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">No food logged today</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Start tracking your meals to stay on target</p>
          </Card>
        ) : (
          <div className="space-y-4 stagger-children">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const mealTypeKey = mealType as keyof typeof groupEntries;
              if (!groupEntries[mealTypeKey]) return null;

              const MealIcon = mealIcons[mealTypeKey];
              const mealCalories = groupEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0);

              return (
                <Card key={mealType}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
                        <MealIcon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white capitalize">{mealType}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{groupEntries[mealTypeKey].length} items</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{mealCalories} kcal</p>
                  </div>

                  <div className="space-y-2">
                    {groupEntries[mealTypeKey].map((entry) => (
                      <div key={entry.id} className="food-entry-item">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{entry.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.calories} kcal</span>
                          <button
                            onClick={() => handleDelete(entry?.documentId || '')}
                            className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all duration-300">
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodLog
