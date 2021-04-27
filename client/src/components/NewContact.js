import React, {useState, useContext} from "react"

import {Context} from "../Context"
import {validate as validateUUID} from "uuid"

export default function NewContact(props){
    const [usernameValue, setusernameValue] = useState("")
    const [idValue, setIdValue] = useState("")

    const [usernameError, setUsernameError] = useState("")
    const [idError, setIdError] = useState("")
    

    const {contacts, setContacts, contactCreated} = useContext(Context)

    function handleFormSubmit(e){
        e.preventDefault()
    }

    function createNewContact(e){
        setUsernameError("")
        setIdError("")
        // check if both username and id are entered
        let [checkUsername, checkId] = [usernameValue.length > 0, idValue.length > 0]

        if (!(checkUsername && checkId)){
            // error messages
            if (!checkUsername) setUsernameError("Please enter an Username!")
            if (!checkId) setIdError("Please enter an Id!")
            
            props.swiggleEffect(e.target)

            return
        }
        
        // check if the id is valid
        if (!validateUUID(idValue)) return setIdError("Please enter a valid Id!")

        // check if contact name or id already exist
        let contact = contacts.find(([contactName, contactId]) => contactName === usernameValue || contactId === idValue)
        if (contact !== undefined){
            if (contact[0] === usernameValue) setUsernameError("This Username is already in use!")
            if (contact[1] === idValue) setIdError("This Id is already in use!")

            props.swiggleEffect(e.target)

            return
        }

        // create the contact
        setContacts(prevContacts => [...prevContacts, [
            usernameValue,
            idValue
        ]])

        contactCreated(idValue)

        props.setWindow("none")
    }

    return (
        <section>
            <form onSubmit={handleFormSubmit}>
                <h1>
                    Username
                    <div className="errorMessage">{usernameError}</div>
                </h1>
                <input  
                    onChange={e => setusernameValue(e.target.value)} 
                    value={usernameValue}
                    type="text" 
                    placeholder="Enter username"
                />
                <h1>
                    Identification
                    <div className="errorMessage">{idError}</div>
                </h1>
                <input  
                    onChange={e => setIdValue(e.target.value)}
                    value={idValue} 
                    type="text" 
                    placeholder="Enter Id"
                />
            </form>
            
            <button
                onClick={createNewContact}
                className="createNewConversation"
            >
                Create
            </button>
        </section>
    )
}