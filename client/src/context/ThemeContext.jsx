import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme")
        || (window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"))
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("dark", "light")
        root.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])
    const toggleThem = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleThem }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(params) {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context
}