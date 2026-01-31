import React, { useState } from 'react'
import { Toaster } from "react-hot-toast"
import { PersonStanding, ScaleIcon, User2Icon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import Input from "../components/ui/Input"
const OnBoarding = () => {
    const [step, setStep] = useState(2);
    const totalSteps = 3
    const { user, setOnBoardingCompleted, fetchUser } = useAppContext()
    const [formData, setFormData] = useState({
        age: 0,
        weight: 0,
        height: 0,
        goal: "maintain",
        dailyCalorieIntake: 2000,
        dailyCalorieBurn: 400

    })
    const updateFields = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }
    return (
        <>
            <Toaster />
            <div className='onboarding-container'>
                {/*Header*/}
                <div className='pt-12 p-6 onboarding-wrapper'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center'>
                            <PersonStanding className='h-6 w-6 text-white' />
                        </div>
                        <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>FitTrack</h1>
                    </div>
                    <p className='text-slate-500 dark:text-slate-400 mt-4'>Let's personalize your experience</p>
                </div>
                {/*progress Bars*/}
                <div className='mx-6 mb-8 onboarding-wrapper'>
                    <div className='flex gap-2 max-w-2xl'>
                        {[1, 2, 3].map((s) => (
                            <div className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        ))}
                    </div>
                    <p className='text-sm text-slate-400 mt-3'>Step {step} of {totalSteps}</p>
                </div>
                {/*Forms*/}
                <div className='flex-1 onboarding-wrapper px-6'>
                    {step === 1 && (
                        <div className='space-y-6'>
                            <div className='flex items-center mb-8 gap-4'>
                                <div className='size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/90
                                border border-emerald-100 dark:border-emerald-800  flex items-center justify-center'>
                                    <User2Icon className='size-6 text-emerald-600 dark:text-emerald-400' />
                                </div>
                                <div>
                                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>How old are you?</h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400 '>This help us to calculate your need</p>
                                </div>
                            </div>
                            <Input label="Age" type="number" className='max-w-2xl'
                                value={formData.age} onChange={(v) => updateFields("age", v)}
                                placeholder='Enter your age' min={13} max={120} required />
                        </div>
                    )}
                    {step === 2 && (
                        <div className='space-y-6 onboarding-wrapper'>
                            <div className='flex items-center mb-8 gap-4'>
                                <div className='size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/90
                                border border-emerald-100 dark:border-emerald-800  flex items-center justify-center'>
                                    <ScaleIcon className='size-6 text-emerald-600 dark:text-emerald-400' />
                                </div>
                                <div>
                                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>Your measurment</h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400 '>Help us to track your progress</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4  max-w-2xl'>
                                <Input label="Weight (kg)" type="number" className='max-w-2xl'
                                    value={formData.weight} onChange={(v) => updateFields("weight", v)}
                                    placeholder='Enter your weight' min={30} max={300} required />
                                <Input label="height (cm) - Optional" type="number" className='max-w-2xl'
                                    value={formData.height} onChange={(v) => updateFields("height", v)}
                                    placeholder='Enter your height' min={100} max={250} required />

                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}

export default OnBoarding