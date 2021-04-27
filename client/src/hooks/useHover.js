import {useState, useEffect, useRef} from "react"

function useHover() {
    const [hovered, setHovered] = useState(false)
    const ref = useRef(null)
    
    function enter() {
        setHovered(true)
    }
    
    function leave() {
        setHovered(false)
    }
    
    useEffect(() => {
        let current = ref.current

        current.addEventListener("mouseenter", enter)
        current.addEventListener("mouseleave", leave)
        
        return () => {    
            current.removeEventListener("mouseenter", enter)
            current.removeEventListener("mouseleave", leave)
        }
    }, [])
    
    return [hovered, ref]
}

export default useHover