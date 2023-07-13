import axios from "axios"
import WebSocket from "ws"
import { sleep } from "./cp_api_util";

//remove

// Tickle get request for session id
async function getSessionId() {
    const response = await axios.get('https://localhost:5000/v1/api/tickle')
    return response.data.session
}

export async function MarketDataWebsocket(acctId: string, conids: string[]) {

    // New Websocket Client
    const socket = new WebSocket('wss://localhost:5000/v1/api/ws');

    async function waitForOpenSocket(socket: WebSocket) {
        return new Promise<void>((resolve) => {
          if (socket.readyState !== socket.OPEN) {
            socket.addEventListener("open", (_) => {
              resolve();
            })
          } else {
            resolve();
          }
        });
    }

      const sendMessage = async (socket: WebSocket, msg:string) => {
        if (socket.readyState !== socket.OPEN) {
            try {
                console.log('this should work')
                await waitForOpenSocket(socket)
                socket.send(msg)
            } catch (err) { console.error(err) }
        } else {
            socket.send(msg)
        }
    }

    // Function on connection open
    socket.on('open', async ()=> {
        socket.send(await getSessionId())
        sendMessage(socket, 'smd+'+'265598'+'+{"fields":["31","84","86"]}')

        for (var i in conids){
            sendMessage(socket, 'smd+'+conids[i]+'+{"fields":["31","84","86"]}')
        }
    })

    
    // Function on message receipt from server
    socket.on('message', (data) => {
        var msg = JSON.parse(data.toString())
        var msg_topic = msg.topic
        if (msg_topic.includes('smd')){
            //for(var i in conids){
                console.log('message: ', msg);
                ('31' in msg) && console.log(msg['31']);
                ('84' in msg) && console.log(msg['84']);
                ('86' in msg) && console.log(msg['86'])
            //}
        }
    })

    // Function on connection close
    socket.on('close', (code, reason)=> {
        console.log('Connection closed:', code, reason.toString())
    })

    // Function for error handling
    socket.on('error', (error) => {
        console.error('Websocket error: ', error)
    })

    return socket
    
}