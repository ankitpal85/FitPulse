import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { ProfileFormData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import api from "../configs/api"
import { goalOptions, ageRanges } from "../assets/assets"
import Slider from "../components/ui/Slider"


const Onboarding = () => {

  const [step, setStep] = useState(1)
  const { user, setOnboardingCompleted, fetchUser } = useAppContext()
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  })

  const totalSteps = 3;

  const updateField = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleNext = async () => {
    // Step 1 validation
    if (step === 1) {
      if (!formData.age || formData.age < 13 || formData.age > 120) {
        return toast.error("Enter a valid age between 13–120");
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
        return toast.error("Enter valid weight (20–300 kg)");
      }
    }

    // Step 3 validation
    if (step === 3) {
      if (!formData.goal) {
        return toast.error("Please select a goal");
      }
    }

    // Navigation
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        const userData = {
          age: formData.age,
          weight: formData.weight,
          height: formData.height > 0 ? formData.height : null,
          goal: formData.goal,
          dailyCalorieIntake: formData.dailyCalorieIntake,
          dailyCalorieBurn: formData.dailyCalorieBurn,
        };

        const targetId = user?.documentId || user?.id;
        await api.put(`/api/users/${targetId}`, userData);

        toast.success("Profile updated successfully");
        setOnboardingCompleted(true);
        await fetchUser(user?.token || "");
      } catch (error: any) {
        console.error("Onboarding error:", error);
        toast.error(error?.response?.data?.error?.message || "Failed to save profile");
      }
    }
  };

  return (
    <div className="onboarding-container">
      {/* Header */}
      <div className="p-6 pt-12 onboarding-wrapper">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <PersonStanding className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            FitPulse
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-4">Let's personalize your experience</p>
      </div>

      {/* Progress indicator */}
      <div className="px-6 mb-8 onboarding-wrapper">
        <div className="flex gap-2 max-w-2xl">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-slate-200 dark:bg-white/[0.08]"}`} />
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-3">Step {step} of {totalSteps}</p>
      </div>

      {/* Form content */}
      <div className="flex-1 px-6 onboarding-wrapper">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 dark:border-violet-500/20 flex items-center justify-center">
                <User className="size-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">How old are you?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">This helps us calculate your needs</p>
              </div>
            </div>
            <Input label="Age" type="number"
              className="max-w-2xl" value={formData.age}
              onChange={(v) => updateField('age', Number(v))}
              placeholder="Enter your age"
              min={13} max={120} required />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 onboarding-wrapper animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/20 flex items-center justify-center">
                <ScaleIcon className="size-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your measurements</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Help us track your progress</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 max-w-2xl">
              <Input label="Weight (kg)" type="number"
                value={formData.weight}
                onChange={(v) => updateField('weight', Number(v))}
                placeholder="Enter your weight"
                min={20} max={300} required />

              <Input label="Height (cm) - optional" type="number"
                value={formData.height}
                onChange={(v) => updateField('height', Number(v))}
                placeholder="Enter your height"
                min={100} max={250} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 onboarding-wrapper animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20 flex items-center justify-center">
                <Target className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">What's your goal?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">We'll tailor your experience</p>
              </div>
            </div>

            {/* Goal Options */}
            <div className="space-y-4 max-w-lg">
              {goalOptions.map((option) => (
                <button type="button"
                  key={option.value}
                  onClick={() => {
                    const age = Number(formData.age);
                    const range = ageRanges.find((r) => age <= r.max) || ageRanges[ageRanges.length - 1];

                    let intake = range.maintain;
                    let burn = range.burn;

                    if (option.value === "lose") {
                      intake -= 400;
                      burn += 100;
                    } else if (option.value === "gain") {
                      intake += 500;
                      burn -= 100;
                    }

                    setFormData({
                      ...formData,
                      goal: option.value as 'lose' | 'maintain' | 'gain',
                      dailyCalorieIntake: intake,
                      dailyCalorieBurn: burn,
                    });
                  }}
                  className={`onboarding-option-btn ${formData.goal === option.value ? 'ring-2 ring-violet-500 dark:ring-violet-400' : ''}`}
                >
                  <span className="text-base text-slate-700 dark:text-slate-200">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-white/[0.08] my-6 max-w-lg">
              {/* Daily targets */}
              <div className="space-y-8 max-w-lg">
                <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4 mt-6">
                  Daily Targets
                </h3>
                <div className="space-y-6">
                  <Slider label="Daily Calorie Intake" min={1200} max={4000} step={50}
                    value={formData.dailyCalorieIntake}
                    onChange={(v) => updateField('dailyCalorieIntake', v)}
                    unit="kcal" infoText="The total calories you plan to consume each day." />

                  <Slider label="Daily Calorie Burn" min={100} max={2000} step={50}
                    value={formData.dailyCalorieBurn}
                    onChange={(v) => updateField('dailyCalorieBurn', v)}
                    unit="kcal" infoText="The total calories you aim to burn through exercise and activity each day." />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="p-6 pb-10 onboarding-wrapper">
        <div className="flex gap-3 lg:justify-end">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className="max-lg:flex-1 lg:px-10">
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back
              </span>
            </Button>
          )}
          <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
            <span className="flex items-center justify-center gap-2">
              {step === totalSteps ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
