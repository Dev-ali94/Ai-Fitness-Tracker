import React, { Activity, useEffect, useState } from 'react'
import { useAppContext } from "../context/AppContext"
import { ActivityIcon, FlameIcon, HamburgerIcon, Ruler, ScaleIcon, TrendingUp, ZapIcon } from 'lucide-react'
import { assets, getMotivationalMessage } from '../assets/assets'
import Card from '../components/ui/Card'
import ProgressBar from "../components/ui/ProgressBar"
import CaloriesChart from '../components/CaloriesChart'
const Dashboard = () => {
    const { user, allFoodLogs, allActivities } = useAppContext()
    const [todayFood, setTodayFood] = useState([])
    const [todayActivity, setTodayActivity] = useState([])
    const DAILY_CALORIE_LIMIT = user?.dailyCalorieIntake || 2000
    const loadUserData = () => {
        const today = new Date().toISOString().split("T")[0]
        const foodData = allFoodLogs.filter((f) => f.createdAt?.split("T")[0] === today)
        setTodayFood(foodData)
        const ActivityData = allActivities.filter((a) => a.createdAt?.split("T")[0] === today)
        setTodayActivity(ActivityData)
    }
    useEffect(() => {
        (() => { loadUserData() })()
    }, [allFoodLogs, allActivities])
    const totalCalories = todayFood.reduce((sum, items) => sum + items.calories, 0)
    const remaningCalories = DAILY_CALORIE_LIMIT - totalCalories
    const totalActivityMinutes = todayActivity.reduce((sum, items) => sum + items.duration, 0)
    const totalBurned = todayActivity.reduce((sum, items) => sum + (items.calories || 0), 0)
    const motivation = getMotivationalMessage(totalCalories, totalActivityMinutes, DAILY_CALORIE_LIMIT)

    return (
        <div className='page-container'>
            {/*Header*/}
            <div className='dashboard-header'>
                <p className='text-emerald-100 text-sm font-medium'>Welcome Back</p>
                <div className='flex items-center space-x-1'>
                    <h2 className='text-2xl font-bold mt-1'>Hi there</h2>
                    <img src={assets.welcome_icon} className='h-7 w-7' alt='welcome' />
                    <h1 className='text-2xl font-bold mt-1'>{user?.username}</h1>
                </div>
                {/*motivational card*/}
                <div className='mt-6 bg-white/20  backdrop-blur-sm rounded-2xl  p-4'>
                    <div className='flex items-center gap-3'>
                        <span className='text-3xl'>{motivation.emoji}</span>
                        <p className='text-white font-medium'>{motivation.text}</p>
                    </div>
                </div>
            </div>
            {/*Main Content*/}
            <div className='dashboard-grid'>
                <Card className='col-span-2 shadow-lg'>
                    {/*caloresIntake Bar*/}
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                            <div className='h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                                <HamburgerIcon className='w-6 h-6 text-orange-500' />
                            </div>
                            <div >
                                <p className='text-sm text-slate-500 dark:text-slate-400'>Calories Consume</p>
                                <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalCalories}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Limit</p>
                            <p className='text-2xl font-bold text-slate-800 dark:text-white'>{DAILY_CALORIE_LIMIT}</p>
                        </div>
                    </div>
                    <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
                    <div className='flex items-center justify-between mt-4'>
                        <div className={`px-3 py-1.5 rounded-lg ${remaningCalories >= 0 ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 " : "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400"}`}>
                            <span className='text-sm font-medium'>{totalCalories >= 0 ? `${remaningCalories} kcal remaining` : `${Math.abs(remaningCalories)} kcal over`}</span>
                        </div>
                        <span className='text-sm text-slate-500'>{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%</span>
                    </div>
                    <div className='border-t border-slate-100 dark:border-slate-800 my-4' />
                    {/*CaloresBurn Bar*/}
                    <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                            <div className='h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                                <FlameIcon className='w-6 h-6 text-orange-500' />
                            </div>
                            <div >
                                <p className='text-sm text-slate-500 dark:text-slate-400'>Calories Burned</p>
                                <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalBurned}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Goal</p>
                            <p className='text-2xl font-bold text-slate-800 dark:text-white'>{user?.dailyCalorieBurn}</p>
                        </div>
                    </div>
                    <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
                </Card >
                {/*Stats Row*/}
                <div className='dashboard-card-grid'>
                    {/*Active Minute*/}
                    <Card className=''>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center'>
                                <ActivityIcon className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className='text-sm text-slate-500'>Activity</p>
                        </div>
                        <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalActivityMinutes}</p>
                        <p className='text-sm text-slate-400'>Minute</p>
                    </Card>
                    {/*Active Card*/}
                    <Card className=''>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center'>
                                <ZapIcon className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className='text-sm text-slate-500'>Workouts</p>
                        </div>
                        <p className='text-2xl font-bold text-slate-800 dark:text-white'>{todayActivity.length}</p>
                        <p className='text-sm text-slate-400'>Activity logged</p>
                    </Card>
                </div>
                {user && (
                    <Card>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center'>
                                <TrendingUp className='h-5 w-5  text-emerald-400' />
                            </div>
                            <div>
                                <p className='text-sm text-slate-400'>Goal</p>
                                <p className='text-white font-semibold capitalize'>
                                    {user.goal === "lose" && "Lose Weight"}
                                    {user.goal === "maintain" && "Maintain Weight"}
                                    {user.goal === "gain" && "Gain Weight"}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
                {/*Body matrix card*/}
                {user && user.weight && (
                    <Card>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='w-12 h-12 flex items-center  justify-center rounded-xl bg-indigo-100'>
                                <ScaleIcon className='w-6 h-6 text-indigo-400' />
                            </div>
                            <div>
                                <h1 className='font-semibold text-slate-800 dark:text-white'>Mody Matric</h1>
                                <p className='text-slate-500 text-sm'>Your Stats</p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800'>
                                        <ScaleIcon className='w-4 h-4 text-slate-500' />
                                    </div>
                                    <span className='text-sm text-slate-500 dark:text-slate-400'>Weight</span>
                                </div>
                                <span className='text-slate-700 font-semibold dark:text-slate-200'>{user.weight}Kg</span>
                            </div>
                            {user.height && (
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-2'>
                                        <div className='p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800'>
                                            <Ruler className='w-4 h-4 text-slate-500' />
                                        </div>
                                        <span className='text-sm text-slate-500 dark:text-slate-400'>Height</span>
                                    </div>
                                    <span className='text-slate-700 font-semibold dark:text-slate-200'>{user.height}cm</span>
                                </div>
                            )}
                            {user.height && (
                                <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>BMI</span>
                                        {(() => {
                                            const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                                            const getStaus = (b) => {
                                                if (b < 18.5) return {
                                                    color: "text-blue-500",
                                                    bg: "bg-blue-500"
                                                }
                                                if (b < 25) return {
                                                    color: "text-emerald-500",
                                                    bg: "bg-emerald-500"
                                                }
                                                if (b < 30) return {
                                                    color: "text-orange-500",
                                                    bg: "bg-orange-500"
                                                }
                                                return {
                                                    color: "text-red-500",
                                                    bg: "bg-red-500"
                                                }
                                            }
                                            const stats = getStaus(Number(bmi))
                                            return <span className={`text-lg font-bold ${stats.color}`}>{bmi}</span>
                                        })()}
                                    </div>
                                    <div className='h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex'>
                                        <div className='flex-1 bg-blue-400 opacity-30' />
                                        <div className='flex-1 bg-emerald-400 opacity-30' />
                                        <div className='flex-1 bg-orange-400 opacity-30' />
                                        <div className='flex-1 bg-red-400 opacity-30' />
                                    </div>

                                    <div className='flex justify-between mt-1 text-[10px] text-slate-400'>
                                        <span>18.5</span>
                                        <span>25</span>
                                        <span>30</span>
                                    </div>

                                </div>
                            )}
                        </div>
                    </Card>
                )}
                {/*Quick Start*/}
                <Card>
                    <h3 className='font-semibold text-slate-800 dark:text-white mb-4'>Quick Summary</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800'>
                            <span className='text-slate-500 dark:text-slate-400'>Meal's logged</span>
                            <span className='font-bold text-slate-700 dark:text-slate-200'>
                                {todayFood.length}
                            </span>
                        </div>
                        <div className='flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800'>
                            <span className='text-slate-500 dark:text-slate-400'>Total Calories</span>
                            <span className='font-bold text-slate-700 dark:text-slate-200'>
                                {totalCalories} kcl
                            </span>
                        </div>
                        <div className='flex items-center justify-between py-2'>
                            <span className='text-slate-500 dark:text-slate-400'>Active Time</span>
                            <span className='font-bold text-slate-700 dark:text-slate-200'>
                                {totalActivityMinutes} min
                            </span>
                        </div>
                    </div>
                </Card>
                {/*Activity & Intake graph*/}
                <Card>
                    <div className='col-span-2'>
                        <h3 className='font-semibold text-slate-800 dark:text-white mb-2'>This week's progress</h3>
                        <CaloriesChart />
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard