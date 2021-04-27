import React from "react"

import useHover from "../hooks/useHover"

export default function RecipientItem({value, removeItem}) {
    const [hovered, ref] = useHover()

    return (
        <div ref={ref} style={{
            backgroundColor: hovered ? '#11405f' : '#2980b9',
            cursor: hovered ? 'auto' : 'pointer'
        }}>
            <i onClick={() => removeItem(value)} style={{display: hovered ? 'block' : 'none'}} className="fas fa-times"></i>
            <span style={{visibility: !hovered ? 'visible' : 'hidden'}}>
                {value}
            </span>
        </div>
    )
}