import React, { useEffect, useState } from 'react'
import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [state, setState] = useState("Sign In")
    const [username, setUsename] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassowrd] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { login, signup, user } = useAppContext()
    const naviagte = useNavigate()
    useEffect(() => {
        if (user) {
            naviagte("/")
        }
    }, [user, naviagte])
    return (
        <div className='flex items-center justify-center pt-35'>
            <form className='login-form '>
                <h2 className='text-3xl font-medium font-gray-900 dark:text-white'>{state === "Sign In" ? "Sign In" : "Sign Up"}</h2>
                <p className='mt-2 text-sm text-gray-500/90 dark:text-gray-400'>{state === "Sign In" ? "Please enter email and password for login" : "Please enter your details to create account"}</p>
                {state !== "Sign In" && (
                    <div className='mt-4'>
                        <label className='font-medium text-sm text-gray-700 dark:text-gray-400'>Username</label>
                        <div className='relative mt-2'>
                            <AtSignIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
                            <input placeholder='Enter your Username' onChange={(e) => setUsename(e.target.value)} value={username} className='login-input' type="text" />
                        </div>
                    </div>
                )}
                <div className='mt-4'>
                    <label className='font-medium text-sm text-gray-700 dark:text-gray-400'>Email</label>
                    <div className='relative mt-2'>
                        <MailIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
                        <input placeholder='Enter your Email' onChange={(e) => email(e.target.value)} value={email} className='login-input' type="email" />
                    </div>
                </div>
                <div className='mt-4'>
                    <label className='font-medium text-sm text-gray-700 dark:text-gray-400'>Password</label>
                    <div className='relative mt-2'>
                        <LockIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
                        <input placeholder='Enter your Password' onChange={(e) => setPassowrd(e.target.value)} value={password} className='login-input' type={showPassword ? "password" : "text"} />
                        <button onClick={() => setShowPassword((p) => !p)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600' type='button'>{showPassword ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-5' />}</button>
                    </div>
                </div>

                <button type='button' className='login-button' disabled={isSubmitting}>
                    {isSubmitting ? "Signing In.... " : state === "Sign In" ? "Sign In" : "Sign Up"}
                </button>
                {state === "Sign In" ?
                    (
                        <p className='text-center py-6 text-sm text-gray-500 dark:text-gray-600'>Don't have an account? <button type='button' className='ml-1 cursor-pointer text-green-500 dark:text-gray-400 hover:underline' onClick={() => setState("Sign Up")}>Sign Up</button></p>
                    )
                    :
                    (
                        <p className='text-center py-6 text-sm text-gray-500 dark:text-gray-600' >Already have an account? <button type='button' className='ml-1 cursor-pointer text-green-500 dark:text-gray-400 hover:underline' onClick={() => setState("Sign In")}>Sign In</button></p>

                    )
                }
            </form>
        </div>
    )
}

export default Login