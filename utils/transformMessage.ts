import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore"
import { db } from "../config/firebase"
import { IMessages } from "../types"

const convertFirestoreTimestampToString = (time: Timestamp) => {
    return new Date(time.toDate().getTime()).toLocaleString()
}

const transformMessage = (doc: QueryDocumentSnapshot<DocumentData>): IMessages => {
    return {
        id: doc.id,
        ...doc.data(),
        send_at: doc.data().send_at ? convertFirestoreTimestampToString(doc.data().send_at as Timestamp) : null
    } as IMessages
}

export default transformMessage