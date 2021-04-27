import React, {useContext} from "react" 

import useHover from "../hooks/useHover"
import { Context } from "../Context"

export default function ConversationsListItem({recipients, index}){
    const [iconHover, iconRef] = useHover()
    const {removeConversation, activeConversation, contacts} = useContext(Context)
    
    let recipientNames = recipients.map((recipient) => {
        let name = contacts.find(contact => contact[1] === recipient)
        return name !== undefined ? name[0] : recipient
    })
    const recipientsString = recipientNames.map((recipient, idx) => recipient + (idx < recipients.length - 1 ? ", " : ""))
    
    let active = activeConversation === recipients

    return (
        <li className={active ? "listItemActive" : ""} key={index}>
            {recipientsString}
            <section
                 ref={iconRef} 
                 style={{display: (active ? "block" : "none")}}
                 onClick={() => removeConversation(recipients)}
            >
                {
                    iconHover ?
                    <i className="fas fa-trash-alt"></i> :
                    <i className="far fa-trash-alt"></i>
                }
            </section>
        </li>
    )
}