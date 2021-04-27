import React, {useContext} from "react"

import {Context} from "../Context"
import Login from "./Login"
import Dashboard from "./Dashboard"

export default function App(){
    const {id, setId, pageMask} = useContext(Context)
    
    return (
        <>
            {id === null ? 
            <Login setId={(newId) => setId(newId)}/> : 
            <Dashboard />}

            {pageMask && <div id="pageMask"></div>}
        </>
    )
}