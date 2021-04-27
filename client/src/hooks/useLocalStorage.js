import { useState, useEffect } from "react"

const PREFIX = "react-chat-application_"

function useLocalStorage(key, initialValue = null) {
    const prefixedKey = PREFIX + key

    const [value, setValue] = useState(() => {
        const lsValue = localStorage.getItem(prefixedKey)

        if (lsValue != null) return JSON.parse(lsValue)

        if (typeof initialValue === "function") return initialValue()
        return initialValue
    })

    useEffect(() => localStorage.setItem(prefixedKey, JSON.stringify(value)), [prefixedKey, value])

    return [value, setValue]
}

export default useLocalStorage