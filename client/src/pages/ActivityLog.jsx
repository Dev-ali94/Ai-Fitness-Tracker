import React, { useState, useEffect, act } from 'react'
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import Button, { } from "../components/ui/Button"
import Input from "../components/ui/Input"
import { quickActivities } from '../assets/assets'
import { ActivityIcon, DumbbellIcon, PlusIcon, TimerIcon, Trash2Icon } from 'lucide-react'
import { toast } from "react-hot-toast"
import mockApi from '../assets/mockApi'
import { PrefetchPageLinks } from 'react-router-dom'

const ActivityLog = () => {
    const { allActivities, setAllActivities } = useAppContext()
    const [activity, setActivity] = useState([])
    const [showForm, setShowForm] = useState(false)
    const today = new Date().toISOString().split('T')[0]
    const [formData, setFormData] = useState({ name: "", duration: 0, calories: "" })
    const [error, setError] = useState("")

    const loadActivities = () => {
        const todayActivities = (allActivities || []).filter(
            (a) => a?.createdAt?.split('T')[0] === today
        )
        setActivity(todayActivities)
    }
    const totalMinutes = activity.reduce((sum, a) => sum + a.duration, 0)
    const handelAddQuick = (act) => {
        setFormData({ name: act.name, duration: 30, calories: 30 * act.rate })
        setShowForm(true)
    }
    const handelDurationChange = (val) => {
        const duration = Number(val)
        const activity = quickActivities.find(a => a.name === formData.name)
        const calories = formData.calories
        if (activity) {
            calories = duration * activity.rate
        }
        setFormData({ ...formData, duration, calories })
    }
    const handelSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim() || formData.duration <= 0) {
            toast.error("Plase enter valid data")
        }
        try {
            const { data } = await mockApi.allActivities.create({ data: formData })
            setActivity(prev => [...prev, data])
            setFormData({ name: "", duration: 0, calories: 0 })
            setShowForm(false)
        } catch (error) {
            console.log(error);
            toast.error("Something want wrong")

        }
    }
    const handleDelete = async (documentId) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this Activity?")
            if (!confirm) return

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        (() => {
            loadActivities()
        })()
    }, [allActivities])

    return (
        <div className='page-container'>
            {/*Header*/}
            <div className='page-header'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold  text-slate-800 dark:text-white'>Activity Logs</h2>
                        <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Track Your Warkout</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>Active Today</p>
                        <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>{totalMinutes} min</p>
                    </div>
                </div>
            </div>
            {/*Main content*/}
            <div className='page-content-grid'>
                {/*Forms*/}
                {!showForm && (
                    <div className='space-y-4'>
                        <Card>
                            <h3 className='font-semibold text-slate-700 dark:text-slate-200 mb-3'>Quick Add</h3>
                            <div className='flex flex-wrap gap-2'>
                                {quickActivities.map((act) => (
                                    <button onClick={() => handelAddQuick(act)} key={act.name} className='px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 transition-colors duration-300'>
                                        {act.emoji} {act.name}
                                    </button>
                                ))}
                            </div>
                        </Card>
                        <Button className='w-full' onClick={() => setShowForm(true)}>
                            <PlusIcon className='size-5' />
                            Add Custom Activity
                        </Button>
                    </div>
                )}
                {/*Form*/}
                {showForm && (
                    <Card className='border-2 border-blue-200 dark:border-blue-800'>
                        <h3 className='font-semibold text-slate-800 mb-4 dark:text-white'>New Activity</h3>
                        <form className='space-y-4' onSubmit={handelSubmit}>
                            <Input label="Activity Name" placeholder='Morning Walk' required value={formData.name}
                                onChange={(v) => setFormData({ ...formData, name: v.toString() })} />
                            <div className='flex gap-3'>
                                <Input label="Duration (min)" type='number' placeholder='e.g.,30 (min)' className='flex-1' min={1} max={300}
                                    required value={formData.duration}
                                    onChange={handelDurationChange} />
                                <Input label="Calories Burn" type='number' placeholder='e.g.,300 (kcal)' className='flex-1' min={1} max={4000}
                                    required value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} />
                                {error && (<p className='text-red-500 text-sm'>{error}</p>)}
                            </div>
                            <div className='flex gap-3 pt-2'>
                                <Button
                                    onClick={() => {
                                        setShowForm(false)
                                        setError("")
                                        setFormData({ name: "", calories: 0, duration: 0 })
                                    }}
                                    type='button' variant='secondary' className='flex-1'>
                                    Cancel
                                </Button>
                                <Button type='submit' className='flex-1'>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
                {/*Activity List*/}
                {activity.length === 0 ? (
                    <Card className='text-center py-12'>
                        <div className='w-16 h-16 rounnded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4'>
                            <DumbbellIcon className='size-8 text-slate-400 dark:text-slate-500' />
                        </div>
                        <h3 className='font-semibold  text-slate-700  dark:text-slate-200 mb-2 '>No Activity Logged Today</h3>
                        <p className='text-slate-500 dark:text-slate-400 text-sm'>Start moving and track your progress</p>
                    </Card>
                ) : (
                    <Card>
                        <div className='flex items-center mb-4 gap-3'>
                            <div className='h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center'>
                                <ActivityIcon className='w-5 h-5 text-blue-500' />
                            </div>
                            <div>
                                <h3 className='font-semibold text-slate-800  dark:text-white'>Today Activity</h3>
                                <p className='text-sm text-slate-500 dark:text-slate-400'>{activity.length}</p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            {activity.map((act) => (
                                <div key={act.id} className='activity-entry-item'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10  rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center'>
                                            <TimerIcon className='text-blue-500 dark:text-blue-400 size-5' />
                                        </div>
                                        <div >
                                            <p className='font-medium text-slate-700 dark:text-slate-200'>{act.name}</p>
                                            <p className='text-sm text-slate-400'>
                                                {new Date(act?.createdAt || "").toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className='text-right'>
                                            <p className='font-semibold text-slate-700 dark:text-slate-200'>{act.duration} min</p>
                                            <p className='text-xs text-slate-400'>{act.calories} kcal</p>
                                        </div>
                                        <button onClick={() => handleDelete(act?.documentId || "")} className='p-2 tex-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'>
                                            <Trash2Icon className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
                            <span className='text-slate-500 dark:text-slate-400'>Total Activity Time</span>
                            <span className='text-lg font-bold text-blue-600 dark:text-blue-500'>{totalMinutes} minutes</span>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
export default ActivityLog
