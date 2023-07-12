import axios from "axios"
import WebSocket from "ws"

//remove

// Tickle get request for session id
async function getSessionId() {
    const response = await axios.get('https://localhost:5000/v1/api/tickle')
    return response.data.session
}

export const sleep = (ms : number) => new Promise(r => setTimeout(r, ms));

export async function MarketDataWebsocket(acctId: string, conids: string[]) {

    // New Websocket Client
    const socket = new WebSocket('wss://localhost:5000/v1/api/ws');

    // Function on connection open
    socket.on('open', ()=> {
        //for (var i in conids){
            sleep(3000)
            socket.send('smd+4815747+{"fields":["31","84","86"]}')
        //    sleep(1000)
        //}
    })

    // Function on message receipt from server
    socket.on('message', (data) => {
        console.log('message: ', data.toString())
    })

    // Function on connection close
    socket.on('close', (code, reason)=> {
        console.log('Connection closed:', code, reason)
    })

    // Function for error handling
    socket.on('error', (error) => {
        console.error('Websocket error: ', error)
    })
    
}