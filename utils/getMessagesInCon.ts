import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../config/firebase"

export const generateQueryMessages = (conversationId?: string) => {
    return query(collection(db, "messages"), where('conversation_id', '==', conversationId), orderBy("send_at", "asc"))
}