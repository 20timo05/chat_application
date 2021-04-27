export default function getData(id){
    let conversationsData = [
        {
            recipients: [
                (id === "cd2adaad-6d20-4fb0-ab65-403ba8a2a4ba") ?
                    "d2a5a533-2d1a-4bee-9733-fd04400494aa" :
                    "cd2adaad-6d20-4fb0-ab65-403ba8a2a4ba"
            ],
            messages: []
        }
    ]
    
    let contactsData = [
        ["Right", "d2a5a533-2d1a-4bee-9733-fd04400494aa"],
        ["Left", "cd2adaad-6d20-4fb0-ab65-403ba8a2a4ba"]
    ]
    return {conversationsData, contactsData}
}
