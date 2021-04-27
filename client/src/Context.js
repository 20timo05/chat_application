import { useState, createContext, useEffect } from "react"

import useLocalStorage from "./hooks/useLocalStorage"
import io from 'socket.io-client'

const Context = createContext()

function ContextProvider({children}){
    const [id, setId] = useLocalStorage("id")
    
    const [socket, setSocket] = useState() 

    const [conversations, setConversations] = useState([])
    const [contacts, setContacts] = useState([])

    const [activeConversation, setActiveConversation] = useState()
    const [activeContact, setActiveContact] = useState()
    
    // when a message is received from socket.io, only the context rerenders
    // (due to the changes in the conversations state variable)
    // but the children using context don't
    const [rerender, setRerender] = useState(0)

    const [pageMask, setPageMask] = useState(false)
    
    function removeConversation(recipients){
        setRerender((prev) => prev + 1)
        
        setConversations(prevConversations => {
            let updatedConversations = prevConversations.filter(conversation => {
                return JSON.stringify(conversation.recipients) !== JSON.stringify(recipients)
            })
            setActiveConversation(conversations.length > 0 ? conversations[0].recipients : [])
            return updatedConversations
        })
    }
    function removeContact(id){
        setContacts(prevContacts => prevContacts.filter(contact => contact[1] !== id))
        setActiveContact(contacts.length > 0 ? contacts[0][1] : "")
        
        setRerender((prev) => prev + 1)
    }
    
    function addMessage(recipients, message){
        setConversations(prevConversations => {
            let conversationAlreadyExists = false

            prevConversations.forEach(conversation => {
                if (JSON.stringify(conversation.recipients) === JSON.stringify(recipients)){
                    conversationAlreadyExists = true
                    conversation.messages.push(message)
                }
            })
            if (!conversationAlreadyExists) {
                prevConversations.push({recipients, messages: [message]})
            }
            return prevConversations
        })
        setRerender((prev) => prev + 1)
    }
    function sendMessage(message, recipients){
        socket.emit("sendMessage", { message, recipients } )
    }
    
    useEffect(() => {
        let newSocket = io('http://localhost:3001', { query: { id }})
        setSocket(newSocket)

        newSocket.on("storedData", data => {
            let parsedData = JSON.parse(data)
            
            setConversations(parsedData.conversations)
            setContacts(parsedData.contacts)
            if (parsedData.conversations.length > 0) setActiveConversation(parsedData.conversations[0].recipients)
            if (parsedData.contacts.length > 0) setActiveContact(parsedData.contacts[0][1])
        })

        newSocket.on("newMessage", ({message, conversationName}) => {
            addMessage(conversationName, message)
        })
    }, [id])

    useEffect(() => {
        if (socket !== undefined) {
            socket.emit("dataUpdate", {conversations, contacts})
        }
    }, [rerender])

    function createUser(id){
        socket.emit("createUser", id)
    }

    function contactCreated(id){
        socket.emit("contactCreated", id)
    }

    return (
        <Context.Provider
            value={{
                conversations,
                contacts,
                setConversations,
                setContacts,
                setActiveConversation,
                setActiveContact,
                activeConversation,
                activeContact,
                removeConversation,
                removeContact,
                addMessage,
                sendMessage,
                createUser,
                contactCreated,
                id,
                setId,
                rerender,
                pageMask,
                setPageMask
            }}
        >
            {children}
        </Context.Provider>
    )
}

export {ContextProvider, Context}