import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import mockApi from "../assets/mockApi"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isUserFetched, setIsUserFetched] = useState(false)
    const [onBoardingCompleted, setOnBoardingCompleted] = useState(false)
    const [allFoodLogs, setAllFoodLogs] = useState([])
    const [allActivities, setAllActivities] = useState([])
    const signup = async (credentials) => {
        const { data } = await mockApi.auth.register(credentials)
        setUser(data.user)
        if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
            setOnBoardingCompleted(true)
        }
        localStorage.setItem("token", data.jwt)
    }
    const login = async (credentials) => {
        const { data } = await mockApi.auth.login(credentials)
        setUser({ ...data.user, token: data.jwt })
        if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
            setOnBoardingCompleted(true)
        }
        localStorage.setItem("token", data.jwt)
    }
    const fetchUser = async (credentials) => {
        const { data } = await mockApi.user.me(credentials)
        setUser({ ...data, token })
        if (data?.age && data?.weight && data?.goal) {
            setOnBoardingCompleted(true)
        }
        setIsUserFetched(true)
    }
    const fetchFoodLog = async (credentials) => {
        const { data } = await mockApi.foodLogs.list()
        setAllFoodLogs(data)
    }
    const fetchActiviteLog = async (credentials) => {
        const { data } = await mockApi.activityLogs.list()
        setAllActivities(data)
    }
    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setOnBoardingCompleted(false)
        navigate("/")
    }
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            (async () => {
                await fetchUser(token)
                await fetchFoodLog()
                await fetchActiviteLog()
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