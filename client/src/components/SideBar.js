import React, { useState, useContext, useEffect } from "react" 

import {Context} from "../Context"

import ConversationsListItem from "./conversationsListItem"
import ContactsListItem from "./ContactsListItem" 

import NewConversation from "./NewConversation"
import NewContact from "./NewContact"

function SideBar(){
    const {conversations, contacts, setActiveConversation, setActiveContact, id, setPageMask} = useContext(Context)
    
    const [conversationsTab, setConversationsTab] = useState(true)

    const [window, setWindow] = useState("none")
    useEffect(() => {
        setPageMask(window !== "none")
    }, [window, setPageMask])

    function listClickHandler(e){
        let target = e.target
        if (target.tagName.toLowerCase() !== "li") target = target.parentNode
        if (target.tagName.toLowerCase() === "section") return;
        let parent = target.parentNode
        
        for (let i = 0; i < parent.childElementCount; i++){
            parent.children[i].classList.remove("listItemActive")
        }
        
        target.classList.add("listItemActive")
        
        if (parent.id === "conversationsList"){
            for (let i = 0; i < parent.childElementCount; i++){
                if (parent.children[i] === target) setActiveConversation(conversations[i].recipients)
            }
        } else if (parent.id === "contactsList"){
            let contactId = target.querySelector("footer").innerHTML
            
            setActiveContact(contactId)
        }
    }

    function swiggleEffect(target){
        // button swiggle Effect
        target.style.animation = "0.35s ease-out swiggle";
        setTimeout(() => target.style.animation = "", 350)
    }

    const conversationListItems = conversations.map(({recipients}, index) => (
        <ConversationsListItem recipients={recipients} index={index} key={index} />
    ))
    
    const contactListItems = contacts.map((item, index) => (
        <ContactsListItem item={item} key={index} index={index} />
    ))

    return (
        <aside id="sideBarWrapper">
            <header>
                <div 
                    onClick={() => setConversationsTab(true)} 
                    className={`tab ${conversationsTab ? "tabActive" : ""}`}
                >
                    Conversations
                </div>
                <div 
                    onClick={() => setConversationsTab(false)} 
                    className={`tab ${!conversationsTab ? "tabActive" : ""}`}
                >
                    Contacts
                </div>

            </header>
            <section>
                {
                    conversationsTab ?
                        <ul onClick={listClickHandler} id="conversationsList">
                            {conversationListItems}
                        </ul> :
                        <ul onClick={listClickHandler} id="contactsList">
                            {contactListItems}
                        </ul>
                }
                <div id="idDisplay">
                    <strong>Your Id: </strong>
                    {id}
                </div>
                {
                    conversationsTab ?
                    <button onClick={() => setWindow("conversation")}>New Conversation</button> :
                    <button onClick={() => setWindow("contact")}>New Contact</button>
                }
            </section>
            {
                window !== "none" &&

                <div id="createWindow">
                    <header>
                        <h1>
                            {window === "conversation" ? "Create Conversation" : "Create Contact"}
                        </h1>
                        <i onClick={() => setWindow("none")} className="fas fa-times"></i>
                    </header>
                    {
                        window === "conversation" ? 
                        <NewConversation 
                            setWindow={setWindow}
                            swiggleEffect={swiggleEffect}
                        /> :
                        <NewContact 
                            setWindow={setWindow}
                            swiggleEffect={swiggleEffect}
                        />
                    }
                </div>
            }
        </aside>
    )
}

export default SideBar