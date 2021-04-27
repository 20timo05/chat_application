const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

const {setUserData, getUserData, saveChanges} = require('./lib/data')


let onlineSockets = []

io.on("connection", socket => {
    const id = socket.handshake.query.id

    if (id === "null") return

    socket.join(id)
    onlineSockets.push(id)
    
    getUserData(id, (err, data) => {
        if (!err) {
            socket.emit("storedData", data)
        } else{
            console.log(err, data, "\n The Account which you are currently logged in with might have been deleted.")
        }
    })

    socket.on("sendMessage", ({message, recipients}) => {
        recipients.forEach((receiver, index) => {
            // calculate the name of the conversation (even though it's the same group, the name is different)
            let conversationName = [...recipients]
            if (!recipients.includes(id)) conversationName.push(id)

            conversationName.splice(recipients.indexOf(receiver), 1)

            if (receiver !== id) {
                let payload = {message, conversationName}
                // check if the user is online (otherwise store the data in .data folder)
                if (!onlineSockets.includes(receiver)) return saveChanges({...payload, receiver})

                socket.broadcast.to(receiver).emit("newMessage", payload)
            }
        })
    })

    socket.on("dataUpdate", (data) => {
        setUserData(id, data)
    })

    const createUser = id => setUserData(id, {
        conversations: [],
        contacts: []
    })

    socket.on("createUser", createUser)

    socket.on("contactCreated", id => {
        // check if the user already exits
        getUserData(id, err => {
            if (err) createUser(id)
        })
    })

    socket.on("disconnect", () => onlineSockets.splice(onlineSockets.indexOf(id), 1))
})

server.listen(3001, () => {
    console.log("Socket io Server runs on Port 3001")
})