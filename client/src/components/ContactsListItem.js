import React, {useContext} from "react" 

import useHover from "../hooks/useHover"
import { Context } from "../Context"

export default function ContactsListItem({item: [header, footer], index}){
    const [iconHover, iconRef] = useHover()
    const {removeContact, activeContact} = useContext(Context)
    
    let active = activeContact === footer

    return (
        <li className={active ? "listItemActive" : ""}>
            <header>{header}</header>
            <section
                 ref={iconRef} 
                 style={{display: (active ? "block" : "none")}}
                 onClick={() => removeContact(footer)}
            >
                {
                    iconHover ?
                    <i className="fas fa-trash-alt"></i> :
                    <i className="far fa-trash-alt"></i>
                }
            </section>
            <footer>{footer}</footer>
        </li>
    )
}