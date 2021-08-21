const http = require("http")
const crypto = require("crypto")
const app = require("express")()
app.listen(8080,() => {
    console.log("Listening... on 8080!")
})
const websocketServer = require("websocket").server 
const httpServer = http.createServer()

httpServer.listen(9090, () => console.log("Listening... on 9090!"))

app.get("/",async (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

// create a hashmap for the client
const clients = {}

const wsServer = new websocketServer({
    "httpServer": httpServer
})

wsServer.on("request",request => {
    const connection = request.accept(null,request.origin)
    connection.on("open",() => console.log("opened!"))
    connection.on("close",() => console.log("closed!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        // Here i have reveived a message from the client
        console.log(result)
    })

    const clientId = e1()
    console.log("clientId: ",clientId)
    clients[clientId] = {
        connection
    }

    const payload = {
        "method": "connect",
        "clientId": clientId
    }
    // send back the client connect
    connection.send(JSON.stringify(payload))

})

function e1() {
    let u='',i=0;
    while(i++<36) {
        let c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
        u+=(c=='-'||c=='4')?c:v.toString(16)
    }
    return u;
}
