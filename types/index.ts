import { Timestamp } from "firebase/firestore"

export interface Conversation {
    users: string[]
}

export interface AppUser {
    email: string,
    lastSeen: Timestamp,
    photoURL: string,
}

export interface IMessages {
    id: string,
    conversation_id: string,
    user: string,
    text: string,
    send_at: string | null,
}