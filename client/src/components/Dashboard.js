import React from "react"

import SideBar from "./SideBar"
import Chat from "./Chat"

function Dashboard(){
    return(
        <div id="DashboardWrapper">
            <SideBar />
            <Chat />
        </div>
    )
}

export default Dashboard