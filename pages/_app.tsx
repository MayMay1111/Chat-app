import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import Login from './login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, error] = useAuthState(auth);

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string), {
          email: loggedInUser?.email,
          lastSeen: serverTimestamp(),
          photoURL: loggedInUser?.photoURL,
        }, { merge: true }
        )
      } catch (error) {
        console.log("DB error");
      }
    }

    if (loggedInUser) {
      setUserInDb();
    }
  })


  if (!loggedInUser) {
    return <Login />
  }
  return <Component {...pageProps} />
}
