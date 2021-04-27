import React, {useContext, useState} from "react"

import {Context} from "../Context"
import RecipientItem from "./RecipientItem"

export default function NewConversation(props){
    const {contacts, conversations, setConversations} = useContext(Context)
    const [inputValue, setInputValue] = useState("")

    const [recipientsError, setRecipientsError] = useState("")

    const [recipients, setRecipients] = useState([])

    const recipientItems = recipients.map((recipient, idx) => (
        <RecipientItem removeItem={removeItem} key={idx} value={recipient} />
    ))

    function changeHandler(e){
        setInputValue(e.target.value)
    }

    function handleFormSubmit(e){
        e.preventDefault()

        setRecipientsError("")

        // add new recipient
        let addRecipient = false
        // if the contact name is entered in lowercase it's updated to the actual name
        let correctedInputValue = "";
        contacts.forEach(([contact]) => {
            // check if the input value is an existing contact
            if (contact.toLowerCase() === inputValue.toLowerCase()){
                correctedInputValue = contact
                // check if the recipient was already added to the List
                if (!recipients.find(recipient => recipient.toLowerCase() === correctedInputValue.toLowerCase())) {
                    addRecipient = true
                }
            }
        })
        // contact doesn't exist
        if (correctedInputValue === "") return setRecipientsError("This Contact does not exist!")

        // recipient already in list
        if (!addRecipient) return setRecipientsError("This Contact is already added to the conversation!")

        // add recipient
        setRecipients(prevRecipients => [...prevRecipients, correctedInputValue]) 
        
        setInputValue("")
    }

    function removeItem(item) {
        setRecipients(prevRecipients => {
            let newRecipients = prevRecipients.filter(recipient => recipient !== item)
            return newRecipients
        })
    }

    function createNewConversation(e){
        // check if there are any recipients
        if (!recipients.length > 0) {
            setRecipientsError("Please enter some recipients!")
            props.swiggleEffect(e.target)
            return
        }

        // create an array with the contact id's instead of the contact names
        let recipientsId = recipients.map(recipient =>{
            let contact = contacts.find(([contactName]) => contactName === recipient)
            return contact[1]
        })

        // check if the conversation already exists
        if (conversations.find(({recipients}) => {
            // check if the recipients in the current conversation equals the recipientsId array
            // (the order could be different)
            let equal = !recipients.find(recipient => !recipientsId.includes(recipient)) && recipients.length === recipientsId.length
            return equal
        })){
            setRecipientsError("That Conversation already exists!")
            props.swiggleEffect(e.target)
            return
        }

        // create the conversation
        setConversations(prevConversations => [...prevConversations, {
            recipients: recipientsId,
            messages: []
        }])

        // close the window
        props.setWindow("none")
    }

    return (
        <section>
            <h1>
                Recipients
                <div className="errorMessage">{recipientsError}</div>
            </h1>
            <form onSubmit={handleFormSubmit}>
                <input  
                    onChange={changeHandler} 
                    value={inputValue}
                    list="recipient-list" 
                    type="text" 
                    placeholder="select"
                />
                <datalist id="recipient-list">
                    {contacts.map(([name], idx) => <option key={idx} value={name} />)}
                </datalist>
            </form>
            <div id="selectedRecipients">
                {recipientItems}
            </div>
            <button onClick={createNewConversation} className="createNewConversation">Create</button>
        </section>
    )
}