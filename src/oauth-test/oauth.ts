import { axiosObj } from "../util/cp_api_util"
import { randomBytes } from "crypto"

interface LstParams{
    oauth_consumer_key          :   String
    oauth_token                 :   String
    oauth_signature_method      :   String
    oauth_signature             :   String
    oauth_timestamp             :   String
    oauth_nonce                 :   String
    diffie_hellman_challenge    :   String
}

function convertPkcs1ToPkcs8( pkcs1PemString: string ) : Promise<CryptoKey> {
    const base64: string = pkcs1PemString
        .replace("-----BEGIN DH PARAMETERS-----",'')
        .replace("-----END DH PARAMETERS-----",'')
        .replace(/\s+/g,'');

    

}

async function getLST(dhRandom: Int8Array, ){
    var liveSessionToken = await axiosObj.get()
    return liveSessionToken
}

async function calcDHChallenge(){

    const dhParam = 

    const dhRandom = randomBytes(256).readInt16LE(0);
    
    const dh_challenge = Math.pow(2, dhRandom) % dhParam.n

    return dhChallenge
}

function initBrokerageSession(): boolean {

    // TODO: Obtain an LST

    // TODO: 

    return true;
}