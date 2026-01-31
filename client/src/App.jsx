import React from 'react'
import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import ActivityLog from './pages/ActivityLog'
import Profile from './pages/Profile'
import Login from "./pages/Login"
import Loading from "./components/ui/Loading"
import { useAppContext } from "./context/AppContext"
import OnBoarding from './pages/OnBoarding'
const App = () => {
  const { user, isUserFetched, onBoardingCompleted } = useAppContext()
  if (!user) {
    return isUserFetched ? <Login /> : <Loading />
  }
  if (!onBoardingCompleted) {
    return <OnBoarding />
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Dashboard />} />
        <Route path="food" element={<FoodLog />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
