import { Conversation, AppUser } from "../types";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRecipientEmail } from "../utils/getRecipientEmail";
import { collection, query, where } from 'firebase/firestore'
import { db } from "../config/firebase";
import { useCollection } from 'react-firebase-hooks/firestore'

export const useRecipient = (conversationUsers: Conversation['users']) => {
    const [loggedInUser, loading, error] = useAuthState(auth)

    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)

    const queryGetRecipient = query(collection(db, 'users'), where('email', '==', recipientEmail))

    const [recipientSnapshot, _loading, _error] = useCollection(queryGetRecipient)

    const recipient = recipientSnapshot?.docs[0]?.data() as AppUser | undefined

    return {
        recipient
    }
}