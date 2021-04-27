import React, { useState, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import {Context} from "../Context"

console.log(uuidv4())

function Login(props){
    const [inputValue, setInputValue] = useState("")

    const {createUser} = useContext(Context)

    function submitHandler(e){
        e.preventDefault()
        props.setId(inputValue)
    }

    function clickHandler(){
        let id = uuidv4()
        props.setId(id)

        // create new data file (in .data storage)
        createUser(id)
    }

    return (
        <div id="loginWrapper">
            <form onSubmit={submitHandler}>
                <p>Enter Your Id</p>
                <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                <br />
                <button style={{backgroundColor: "#3498db", marginRight: "15px"}} type="submit">Login</button>
                <button onClick={clickHandler} style={{backgroundColor: "#474747"}}>Create A New Id</button>

            </form>
        </div>
    )
}

export default Login