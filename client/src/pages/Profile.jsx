import React, { useState, useEffect } from 'react'
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import { Calendar, LogOutIcon, MoonIcon, Ruler, Scale, SunIcon, Target, UserIcon } from "lucide-react"
import toast, { } from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"
import { goalLabels, goalOptions } from '../assets/assets'
import mockApi from '../assets/mockApi'
const Profile = () => {
    const { user, allFoodLogs, allActivities, fetchUser, logout } = useAppContext()
    const { theme, toggleTheme } = useTheme()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ age: 0, weight: 0, height: 0, goal: "maintain", dailyCalorieBurn: 200, dailyCalorieIntake: 2000 })
    const fetchUserData = () => {
        if (user) {
            setFormData({
                age: user?.age,
                weight: user?.weight,
                height: user?.height,
                goal: user?.goal,
                dailyCalorieBurn: user?.dailyCalorieBurn,
                dailyCalorieIntake: user?.dailyCalorieIntake
            })
        }
    }
    const handelSave = async () => {
        try {
            const update = { ...formData, goal: formData.goal.toString() || "" }
            await mockApi.user.update(user?.token || "", update)
            await fetchUser(user?.token || "")
            setIsEditing(false)
            toast.success("Profile updated successfully")

        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile")

        }
    }
    const getStats = () => {
        const AllFoodEntries = allFoodLogs.length || 0
        const AllActivitiesEntries = allActivities.length || 0
        return { AllFoodEntries, AllActivitiesEntries }
    }
    const stats = getStats()
    useEffect(() => {
        (() => {
            fetchUserData()
        })()
    }, [user])
    if (!user || !formData) return null
    return (
        <div className='page-container'>
            <div className='page-header'>
                <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Profile</h1>
                <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Manage your profile</p>
            </div>
            <div className='profile-content'>
                {/*left content*/}
                <Card>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600
                    flex items-center justify-center'>
                            <UserIcon className='size-6 text-white' />
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold text-slate-800 dark:text-white'>Your Profile</h2>
                            <span className='text-slate-500 dark:text-slate-400 text-xs'>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    {isEditing ? (
                        <div className='space-y-4'>
                            <Input label="Age" type="number" value={formData.age} onChange={(v) => setFormData({ ...formData, age: Number(v) })} min={13} max={120} />
                            <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v) => setFormData({ ...formData, weight: Number(v) })} min={30} max={300} />
                            <Input label="Heignt (cm)" type="number" value={formData.height} onChange={(v) => setFormData({ ...formData, height: Number(v) })} min={100} max={300} />
                            <Select label="Fitness Goal" value={formData.goal} onChange={(v) => setFormData({ ...formData, goal: v.toString() })} options={goalOptions} required placeholder='Select your new goal' />
                            <div className='flex gap-3 mt-2'>
                                <Button type="button" className="flex-1" variant="secondary" onClick={() => { setIsEditing(false); setFormData({ age: Number(user?.age), weight: Number(user?.weight), height: Number(user?.height), goal: user?.goal, dailyCalorieBurn: Number(user?.dailyCalorieBurn), dailyCalorieIntake: Number(user?.dailyCalorieIntake) }) }}>
                                    cancel
                                </Button>
                                <Button onClick={handelSave} type='submit' className='flex-1'>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='space-y-4'>
                                {/*age*/}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-300">
                                    <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                        <Calendar className='size-5 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Age</p>
                                        <p className='font-semibold text-slate-800 dark:text-white mt-1'>{user?.age} Years</p>
                                    </div>
                                </div>
                                {/*weight*/}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-300">
                                    <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                        <Scale className='size-5 text-purple-600 dark:text-purple-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Weight</p>
                                        <p className='font-semibold text-slate-800 dark:text-white mt-1'>{user?.weight} Kg</p>
                                    </div>
                                </div>
                                {/*height*/}
                                {user.height !== 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-300">
                                        <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                            <Ruler className='size-5 text-green-600 dark:text-green-400' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Height</p>
                                            <p className='font-semibold text-slate-800 dark:text-white mt-1'>{user?.height} cm</p>
                                        </div>
                                    </div>
                                )}
                                {/*goal*/}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-300">
                                    <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                        <Target className='size-5 text-orange-600 dark:text-orange-400' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Goal</p>
                                        <p className='font-semibold text-slate-800 dark:text-white mt-1'>{goalLabels[user?.goal || "maintain"]}</p>
                                    </div>
                                </div>
                            </div>

                            <Button variant='secondary' onClick={() => setIsEditing(true)} className='w-full mt-4'>
                                Edit Profile
                            </Button>
                        </>
                    )
                    }
                </Card>

                {/*right content*/}
                <div className='space-y-4'>
                    <Card>
                        <h3 className='font-semibold  tex-slate-800 dark:text-white mb-4'>Your Stats</h3>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='text-center p-4 bg-emerald-50 dark:bg-emerald-900/10  rounded-xl'>
                                <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{stats.AllFoodEntries}</p>
                                <p className='text-sm text-slate-500 dark:text-slate-400'>Food Entries</p>
                            </div>
                            <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/10  rounded-xl'>
                                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{stats.AllActivitiesEntries}</p>
                                <p className='text-sm text-slate-500 dark:text-slate-400'>Activities Entries</p>
                            </div>
                        </div>
                    </Card>
                    <div className='lg:hidden'>
                        <button onClick={toggleTheme} className='flex items-center justify-center gap-3 px-4 py-2.5 w-full text-slate-500 
            dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200
            transition-colors duration-300 cursor-pointer border-2 border-slate-200 dark:border-slate-700 rounded-xl'>
                            {theme === "light" ? (
                                <>
                                    <SunIcon className="size-5" />
                                    <span className="text-base">Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="size-5" />
                                    <span className="text-base">Dark Mode</span>
                                </>
                            )}

                        </button>
                    </div>
                    <Button className='w-full ring-red-300 hover:ring-2' variant='danger' onClick={logout}>
                        <LogOutIcon className='size-4' />
                        Logout
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default Profile