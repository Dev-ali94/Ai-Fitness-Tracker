import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from '../config/api'
import { useNavigate } from "react-router-dom"
import mockApi from "../assets/mockApi"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem("token") ? true : false)
    const [onBoardingCompleted, setOnBoardingCompleted] = useState(false)
    const [allFoodLogs, setAllFoodLogs] = useState([])
    const [allActivities, setAllActivities] = useState([])
    // signup function
    const signup = async (credentials) => {
        try {
            const { data } = await api.post("/api/auth/local/register", credentials)
            setUser({ ...data.user, token: data.jwt })
            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnBoardingCompleted(true)
            }
            localStorage.setItem("token", data.jwt)
            api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }

    }
    // login function
    const login = async (credentials) => {
        try {
            const { data } = await api.post("/api/auth/local", { identifier: credentials.email, password: credentials.password })
            setUser({ ...data.user, token: data.jwt })
            if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
                setOnBoardingCompleted(true)
            }
            localStorage.setItem("token", data.jwt)
            api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }

    }
    // logout function
    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setOnBoardingCompleted(false)
        api.defaults.headers.common["Authorization"] = ""
        navigate("/")
    }
    // fetch user function
    const fetchUser = async (token) => {
        try {
            const { data } = await api.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
            setUser({ ...data, token })
            if (data?.age && data?.weight && data?.goal) {
                setOnBoardingCompleted(true)
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
        setIsUserFetched(true)
    }
    // fetch activity log function
    const fetchFoodLog = async (token) => {
        try {
            const { data } = await api.get("/api/food-logs", { headers: { Authorization: `Bearer ${token}` } })
            setAllFoodLogs(data)
            console.log(data);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }


    // fetch activity log function
    const fetchActiviteLog = async (token) => {
        try {
            const { data } = await api.get("/api/activity-logs", { headers: { Authorization: `Bearer ${token}` } })
            setAllActivities(data)

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || error?.message)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            (async () => {
                await fetchUser(token)
                await fetchFoodLog(token)
                await fetchActiviteLog(token)
            })()
        } else {
            setIsUserFetched(true)
        }
    }, [])
    const value = {
        user, setUser, isUserFetched, fetchUser, signup, login, logout, onBoardingCompleted, setOnBoardingCompleted
        , allFoodLogs, setAllFoodLogs, allActivities, setAllActivities
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)