const fs = require('fs')
const path = require('path')

function setUserData(user, data) {
    let userPath = path.join(__dirname, '/../.data/', `${user}.json`);
    
    fs.stat(userPath, function(err, stat) { 
        let flag = !err ? 'r+' : (err.code == 'ENOENT' ? 'wx' : "")
        // if the file doesn't exist (flag wx) than it get's created
        fs.open(userPath, flag, (err, fileDescriptor) => {
            if (!err && fileDescriptor){
                if (flag === 'r+'){
                    // clear the file (it already exists)
                    fs.ftruncateSync(fileDescriptor)
                }
                // write to the file
                let stringData = JSON.stringify(data)
                fs.writeFile(fileDescriptor, stringData, err => {
                    if (!err){
                        //console.log(user, data.conversations[0].messages)
                        // close the file
                        fs.close(fileDescriptor, err => {
                            if (err) console.log("could not close the file")
                        })
                    } else{
                        console.log("could not write to file")
                    }
                })
            } else {
                console.log("could not open the file")
            }
        }) 
      });
    
}

function getUserData(user, callback) {
    let userPath = path.join(__dirname, '/../.data/', `${user}.json`);

    fs.readFile(userPath, (err, data) => {
        if(err) {
            callback(true, err)
        } else{
            callback(false, data.toString())
        }
    })
}

function clearChat(user, callback) {
    getUserData(user, (err, data) => {
        if (!err){
            let parsedData = JSON.parse(data)
            let clearedData = {...parsedData, conversations: 
                parsedData.conversations.map(conversation => ({
                    ...conversation,
                    messages: []
                }))
            }
            setUserData(user, clearedData)
        } else{
            callback(true, data)
        }
    })
}

function saveChanges({receiver, message, conversationName}){
    getUserData(receiver, (err, data) => {
        if (!err){
            let parsedData = JSON.parse(data)

            let conversationAlreadyExists = false
            parsedData.conversations.forEach(con => {
                if (JSON.stringify(con.recipients) === JSON.stringify(conversationName)){
                    conversationAlreadyExists = true
                    con.messages.push(message)
                }
            })
            if (!conversationAlreadyExists) {
                console.log("test")
                parsedData.conversations.push({
                    recipients: conversationName,
                    messages: [message]
                })
            }

            setUserData(receiver, parsedData)
        } else{
            console.log("could not get user data while storing data")
        }
    })
}

module.exports = {setUserData, getUserData, clearChat, saveChanges}