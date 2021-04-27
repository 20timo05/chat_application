import React, { useState, useRef, useEffect, useContext } from "react" 

import { Context } from "../Context"

function Chat(){
    const [inputText, setInputText] = useState("")
    const inputRef = useRef(null)

    const messagesList = useRef(null)

    const { conversations, activeConversation, addMessage, id, contacts, sendMessage, rerender } = useContext(Context)
   
    function changeHandler(e){
        e.preventDefault()
        setInputText(e.target.value)
    }

    useEffect(() => {
        let item = messagesList.current
        item.scrollTop = item.scrollHeight
    }, [rerender])

    const activeChat = conversations.find(item => item.recipients === activeConversation)
    
    let messageListItems = activeChat === undefined ? "" : 
        activeChat.messages.map(({sender, time, text}, index) => {
            let senderName = contacts.find((contact) => contact[1] === sender)
            
            return (
                <li key={index} className={sender === id ? "messageRight" : "messageLeft"}>
                    <header>{senderName !== undefined ? senderName[0] : (sender === id ? "Me" : sender)}</header>
                    <section>{text}</section>
                    <footer>{time}</footer>
                </li>
            )
        })
        

    function submitHandler(e){
        e.preventDefault()

        if (inputText.length > 0){
            let time = new Date()
            time = `${time.getHours()}:${time.getMinutes()}`

            let message = {
                sender: id,
                time,
                text: inputText
            }

            addMessage(activeConversation, message)
            sendMessage(message, activeConversation)
        }

        setInputText("")
        inputRef.current.focus()
    }

    return (
        <section id="chatWrapper">
            <section id="chatDisplay">
                <ul ref={messagesList} id="messagesList">
                    {messageListItems}
                </ul>
            </section>
            <form onSubmit={submitHandler} id="chatInput">
                <input ref={inputRef} type="text" value={inputText} onChange={changeHandler} />
                <button type="submit">Send</button>
            </form>
        </section>
    )
}

export default Chat