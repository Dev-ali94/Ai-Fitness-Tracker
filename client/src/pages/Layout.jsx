import React from 'react'
import { Outlet } from "react-router-dom"
import OnBoarding from './OnBoarding'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
const Layout = () => {
    return (
        <div className='layout-container'>
            <Sidebar />
            <div className='flex-1 overflow-y-scroll'>
                <Outlet />
            </div>
            <MobileNav />
        </div>
    )
}

export default Layout