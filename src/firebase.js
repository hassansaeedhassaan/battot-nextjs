import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from 'firebase/messaging'
import { useStoreFcm } from './hooks/react-query/push-notification/usePushNotification'

const firebaseConfig = {
    apiKey: "AIzaSyDg1XekhWMXZXcegefqVIaqJo4ZMBtpWYw",
    authDomain: "battot-3a933.firebaseapp.com",
    projectId: "battot-3a933",
    storageBucket: "battot-3a933.appspot.com",
    messagingSenderId: "160972959650",
    appId: "1:160972959650:web:a994bab0bb70c31b0dccfb",
    measurementId: "G-LE204S3NPN",
}
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const messaging = (async () => {
    try {
        const isSupportedBrowser = await isSupported()
        if (isSupportedBrowser) {
            return getMessaging(firebaseApp)
        }

        return null
    } catch (err) {
        return null
    }
})()

export const fetchToken = async (setTokenFound, setFcmToken) => {
    return getToken(await messaging, {
        vapidKey:
            'BFA9Ale5ub9Owv3mzmfSg2J_ODKKHWbD2KPcpLa9Vt8D97xPTTO0tEnp6YU1AyISczZ_4vdC8U8Lof2aPVEjd5Y',
    })
        .then((currentToken) => {
            if (currentToken) {
                setTokenFound(true)
                setFcmToken(currentToken)

                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
            } else {
                setTokenFound(false)
                setFcmToken()
                // shows on the UI that permission is required
            }
        })
        .catch((err) => {
            console.error(err)
            // catch error while creating client token
        })
}

export const onMessageListener = async () =>
    new Promise((resolve) =>
        (async () => {
            const messagingResolve = await messaging
            onMessage(messagingResolve, (payload) => {
                resolve(payload)
            })
        })()
    )
