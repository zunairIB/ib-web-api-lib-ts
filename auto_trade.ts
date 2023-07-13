import axios from 'axios'
import {    
        DEFAULT_ORDER,
        MktDataRequest,
        MktDataRes,
        OrderArr,
        PriceTracker, 
        SecdefSearchParams, 
        Tracker,    
        sleep} from './cp_api_util';
import { MarketDataWebsocket } from './websocket_md';

const base_url = 'https://localhost:5000/v1/api'

// Auth Status api call
async function authStatus(){
    await axios.get(`${base_url}/iserver/auth/status`).then((response) => {
        console.log(response.data)
    })
}

async function getAccountId() {
    const response = await axios.get(`${base_url}/iserver/accounts`)
    const accountId: string = response.data.accounts[0]
    return accountId
}

// Secdef Search for Conid
async function getConId(SecdefSearchParams: SecdefSearchParams) {
    const response = await axios.post(`${base_url}/iserver/secdef/search`, SecdefSearchParams)
    const conid = response.data[0].conid
    
    return conid
}

// Mkt Data Snapshot needs to be called twice
async function getMktDataSnap(mktDataRequest: MktDataRequest){
    var mktData = await axios.get(`${base_url}/iserver/marketdata/snapshot`, { params: mktDataRequest })
    mktData = await axios.get(`${base_url}/iserver/marketdata/snapshot`, { params: mktDataRequest })
    return mktData.data
}

async function populatePriceTracker( mktData: MktDataRes){
    var priceTracker: PriceTracker = {}
    for (let i = 0; i < mktData.length; i++){
        var tracker: Tracker = {
            "last": Number(mktData[i][31]),
            "ask":Number(mktData[i][86]),
            "bid":Number(mktData[i][84]),
        }
        priceTracker[mktData[i].conid.toString()] =  tracker
    }
    return priceTracker
}

async function getNumPositions( accountId: string , conid: string) {
    await axios.get(`${base_url}/portfolio/accounts`)
    var posRes = await axios.get(`${base_url}/portfolio/${accountId}/position/${conid}`)
    return posRes.data[0].position
}

//Assuming 1 account, get account summary object
async function portfolioMonitor(accountId: string) {
    const response = await axios.get(`${base_url}/portfolio/${accountId}/summary`)
                        
    return response.data
}

async function getSessionId() {
    const response = await axios.get(`${base_url}/tickle`)
    return response.data.session
}

async function placeOrder(acctId: string, order: OrderArr) {
    const orderRes = await axios.post(`${base_url}/iserver/account/${acctId}/orders`, order)
    console.log(orderRes.data)            
    return orderRes.data
}

async function getOrderReply(replyId:string) {
    const orderReplyRes = await axios.post(`${base_url}/iserver/reply/${replyId}`, {"confirmed":true})

    return orderReplyRes.data
}

async function runTradeStrat(accountId:string, balance: number, conids: Array<string>, oldX : PriceTracker, curr: PriceTracker) {
    for (var contract in oldX){
        const conid = conids[conids.indexOf(contract)]

        var last = curr[contract].last
        var bid = curr[contract].bid
        var ask = curr[contract].ask
        var oldLast = oldX[contract].last
        var oldAsk = oldX[contract].ask
        var oldBid = oldX[contract].bid

        if (balance >= 10000){
            if (((bid > (oldBid + 0.02)) && ((ask + 0.02) > oldAsk)) || (last > (oldLast + 0.02))){
                const order: OrderArr = DEFAULT_ORDER
                order.orders[0].conid = Number(conid)
                order.orders[0].side = "BUY"
                order.orders[0].price = bid

                const orderId = await placeOrder(accountId, order)
                
                //const reply = (await getOrderReply(orderId.toString()))
                //console.log(reply)
            }
        }

        // We only want to sell if we have position - we do not want to short in this scenario.
        const pos = await getNumPositions(accountId, conid)
        
        try{
            if (pos >= 10) {
                if (((bid < (oldBid - 0.02)) && ((ask - 0.02) < oldAsk)) || last < (oldLast - 0.02)){
                    const order: OrderArr = DEFAULT_ORDER
                    order.orders[0].side = "Sell"
                    order.orders[0].price = ask
                    order.orders[0].conid = Number(conid)
                
                    const orderId = await placeOrder(accountId, order)
                    //const reply = (await getOrderReply(orderId.toString()))
                    //console.log(reply)
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}

async function main(){
    // log auth status
    authStatus()

    //get account ID, assuming 1 account
    const accountId: string = await getAccountId()

    const balance = (await portfolioMonitor(accountId)).availablefunds.amount

    // input tickers list
    const tickers = ["AAPL","NVDA","F"]
    let conidsArr: string[] = []

    // request conids for symbols in ticker array and request market data snapshot
    var conids:string=""

    for (var i of tickers){
        const params = {"symbol":i, "name":false, "secType":"STK"}

        var conid: string = await getConId(params)

        conidsArr.push(conid)

        if (tickers.indexOf(i) === tickers.length-1) {
            conids+=conid
        } else {
            conids+= conid+','
        }
    }

    // init mktsnap
    var mktDataRes: MktDataRes
    mktDataRes = await getMktDataSnap({conids: conids, fields : "31,84,86"})
    
    MarketDataWebsocket(accountId,conidsArr)

    var oldX = {}
    let curr = {}
    
    // Call Market Data Snapshot every 5 seconds
    const inter = setInterval(async ()=>{

        oldX = curr
        mktDataRes = await getMktDataSnap({conids: conids, fields : "31,84,86"})
        curr = await populatePriceTracker( mktDataRes)
        // console.log("old: ", oldX)
        // console.log("curr: ", curr)
        
        if (Object.keys(oldX).length != 0 ){
            runTradeStrat(accountId, balance, conidsArr, oldX, curr)
        }
    }, 5000)

    setTimeout(()=>{clearInterval(inter)},600000) 
}

export default main()
