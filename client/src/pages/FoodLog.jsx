import React, { useEffect, useRef, useState } from 'react'
import api from "../config/api"
import { toast } from "react-hot-toast"
import { useAppContext } from "../context/AppContext"
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from "../components/ui/Input"
import Select from '../components/ui/Select'
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from '../assets/assets'
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon } from 'lucide-react'
import mockApi from '../assets/mockApi'

const FoodLog = () => {
    const { allFoodLogs, setAllFoodLogs } = useAppContext()
    const [entries, setEntries] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ name: "", calories: "", mealType: "" })
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)
    const today = new Date().toISOString().split('T')[0]

    const loadEntries = () => {
        const todayEntries = (allFoodLogs || []).filter(
            (entry) => entry?.createdAt?.split('T')[0] === today
        )
        setEntries(todayEntries)
    }
    const totalCalories = entries.reduce((total, entry) => total + (Number(entry.calories) || 0), 0)
    const handleQuickAdd = (activityName) => {
        setFormData({ ...formData, mealType: activityName })
        setShowForm(true)
    }
    const groupedEntries = entries.reduce((acc, entry) => {
        const key = entry.mealType || "other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {});

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.calories || !formData.mealType) {
            return toast.error("Please fill valid data")
        }
        try {
            const { data } = await api.post("/api/food-logs", { data: formData })
            setAllFoodLogs(prev => [...prev, data])
            setFormData({ name: "", calories: 0, mealType: "" })
            setShowForm(false)
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    const handleDelete = async (documentId) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this entry?")
            if (!confirm) return
            await api.delete(`/api/food-logs/${documentId}`)
            setAllFoodLogs((prev) => prev.filter((entry) => entry.documentId !== documentId))
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    useEffect(() => {
        (() => {
            loadEntries()
        })()
    }, [allFoodLogs])
    return (
        <div className='page-container'>
            {/*Header*/}
            <div className='page-header'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold  text-slate-800 dark:text-white'>Food Logs</h2>
                        <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Track Your Daily Intake</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>Today's Intake</p>
                        <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{totalCalories} kcal</p>
                    </div>
                </div>
            </div>
            <div className='page-content-grid'>
                {/*Quick Add Section*/}
                {!showForm && (
                    <div className='space-y-4'>
                        <Card>
                            <h3 className='font-semibold text-slate-700 dark:text-slate-200 mb-3'>Quick Add</h3>
                            <div className='flex flex-wrap gap-2'>
                                {quickActivitiesFoodLog.map((activity) => (
                                    <button
                                        onClick={() => handleQuickAdd(activity.name)}
                                        className='px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 transition-colors duration-300'
                                        key={activity.name}>
                                        {activity.emoji} {activity.name}
                                    </button>
                                ))}
                            </div>
                        </Card>
                        <Button className='w-full' onClick={() => setShowForm(true)}>
                            <PlusIcon className='size-5' />
                            Add Food Entry
                        </Button>
                        <input type='file' ref={inputRef} accept='image/*' hidden />
                        {loading && (
                            <div className='fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-centerz-100'>
                                <Loader2Icon className='size-8 text-emerald-600 dark:text-emerald-400 animate-spin' />
                            </div>
                        )}
                    </div>
                )}
                {showForm && (
                    <Card className='border-2 border-emerald-200 dark:border-emerald-800'>
                        <h2 className='font-semibold  text-shadow-slate-800 dark:text-white mb-4'>New Food Entry</h2>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })} placeholder='e.g,Grilled Chicken Salad' required />
                            <Input label="Calories" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} placeholder='e.g,350g' required min={1} />
                            <Select label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: v.toString() })} options={mealTypeOptions} required placeholder='Select Meal Type' />
                            <div className='flex gap-3 mt-2'>
                                <Button type="button" className="flex-1" variant="secondary" onClick={() => { setShowForm(false); setFormData({ name: "", calories: 0, mealType: "" }) }}>
                                    cancel
                                </Button>
                                <Button type='submit' className='flex-1'>
                                    Add Entry
                                </Button>
                            </div>
                        </form>

                    </Card>
                )}
                {/*Entries List */}
                {entries.length === 0 ? (
                    <Card className='text-center py-12'>
                        <div className='w-16 h-16 rounnded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4'>
                            <UtensilsCrossedIcon className='size-8 text-slate-400 dark:text-slate-500' />
                        </div>
                        <h3 className='font-semibold  text-slate-700  dark:text-slate-200 mb-2 '>No Food Logged Today</h3>
                        <p className='text-slate-500 dark:text-slate-400 text-sm'>Start tracking your food intake to get accurate results</p>
                    </Card>
                ) : (
                    <div className='space-y-4'>
                        {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
                            const mealTypeKey = groupedEntries[mealType] ? mealType : "other";
                            if (!groupedEntries[mealTypeKey]) return null;
                            const MealIcon = mealIcons[mealTypeKey]
                            const mealCalories = groupedEntries[mealTypeKey].reduce((total, entry) => total + entry.calories, 0)
                            return (
                                <Card key={mealType}>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex items-center gap-3'>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
                                                <MealIcon className="size-5" />
                                            </div>
                                            <div>
                                                <h3 className='font-semibold text-slate-800 dark:text-white capitalize'>{mealType}</h3>
                                                <p className='text-sm text-slate-500 dark:text-slate-400'>{groupedEntries[mealTypeKey].length} items</p>
                                            </div>
                                        </div>
                                        <p className='font-semibold text-slate-700 dark:text-slate-200'>{mealCalories} kcal</p>
                                    </div>
                                    <div className='space-y-2'>
                                        {groupedEntries[mealTypeKey].map((entry) => (
                                            <div key={entry.id} className='food-entry-item'>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-700 dark:text-slate-200">{entry.name}</p>
                                                    <p className='text-sm text-slate-400'></p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-sm font-medium  text-slate-600 dark:text-slate-300'>{entry.calories} kcal</span>
                                                    <button onClick={() => handleDelete(entry?.documentId || "")} className='p-2 tex-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'>
                                                        <Trash2Icon className='w-4 h-4' />
                                                    </button>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            );
                        })}

                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodLog