//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({path: path.resolve('./.env')})

export default {
    fileSystem: {
        path: process.env.FS_PATH || 'DB'
    },
    mongodb: {
        //url: 'mongodb://localhost:27017/ecommerce',
        url: process.env.MONGO_URL || 'mongodb+srv://admin:PASS@XXX.mongodb.net/ecommerce',
        options: {
            serverSelectionTimeoutMS: process.env.MONGO_TO || 5000
        }
    },
    firebase: {
        serviceAccount: {
            "type": process.env.FIREBASE_TYPE ||"service_account",
            "project_id": process.env.FIREBASE_PROJECT_ID ||"basefirebase-XXX",
            "private_key_id": process.FIREBASE_PRIVATE_KEY_ID || "XXX",
            "private_key": process.env.FIREBASE_PRIVATE_KEY || "XXX\n-----END PRIVATE KEY-----\n",
            "client_email": process.env.FIREBASE_CLIENT_EMAIL || "XXX@appspot.gserviceaccount.com",
            "client_id": process.env.FIREBASE_CLIENT_ID || "XXX",
            "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
            "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.FIREBASE_AUTH_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/basefirebase-XXX%40appspot.gserviceaccount.com"
          },
        url: process.env.FIREBASE_URL || "https://basefirebase-XXX.firebaseio.com"
    },
    adminAccount: {
        "mail": process.env.ADMIN_MAIL || 'XXX@ethereal.email',
        "pass": process.env.ADMIN_MAIL_PASS || 'XXX',
        "accountSid": process.env.ADMIN_ACCOUNT_SID || 'XXX',
        "authToken": process.env.ADMIN_AUTH_TOKEN || 'XXX',
        "smsPhone": process.env.ADMIN_SMS_PHONE || '++XXX',
        "wpPhone": process.env.ADMIN_WP_PHONE ||'+XXX',
        "phone": process.env.ADMIN_CEL ||'+XX'
    }
}