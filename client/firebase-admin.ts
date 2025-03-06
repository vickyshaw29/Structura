// Import the functions you need from the SDKs you need
import { initializeApp, getApps, App, getApp, cert} from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore'


const serviceKey = require("./service_key.json");

let app: App;

if(getApps().length === 0 ){
    app = initializeApp({
        credential: cert(serviceKey)
    });
}else{
    app = getApp();
}

const adnminDb = getFirestore(app);

export { app as adminApp, adnminDb };