import { Conversation, IMessages } from "../../types"
import { useRecipient } from '../../hooks/useRecipient'
import styled from 'styled-components'
import { Avatar, IconButton } from "@mui/material"
import { useRouter } from "next/router"
import { generateQueryMessages } from "../../utils/getMessagesInCon"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../config/firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import transformMessage from "../../utils/transformMessage"
import Message from "./Message"
import { User } from "firebase/auth"
import SendIcon from '@mui/icons-material/Send'
import { KeyboardEventHandler, useRef, useState, MouseEventHandler } from "react"
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore"

const StyledConversationHeader = styled.div`
    position:sticky;
    background-color: #fff;
    z-index: 100;
    top:0;
    border-bottom:1px solid whitesmoke;
    min-width:100vh;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 10px;
    margin: 0;
`

const StyledMessagesContainer = styled.div`
    padding: 16px;
    background: #e7ecd5;
    max-width:100%;
    min-height: calc(100% - 120px);
    margin: 0;
`

const StyledInputContainer = styled.div`
    position: sticky;
    width:100%;
    height: 50px;
    bottom: 0;
    padding: 10px;
    background: #fff;
    z-index: 100;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

const EndOfMessageForAutoScroll = styled.div`
    margin-bottom: 30px;
`

const StyledInput = styled.input`
    border: none;
    outline: none;
    background: #d1cfcf;
    color: #000;
    width: 98%;
    height: 30px;
    border-radius: 10px;
    padding: 10px;
`

const ConversationText = ({ conversation, messages }: { conversation: Conversation, messages: IMessages[] }) => {

    const [mess, setMess] = useState('')

    const [loggedInUser, _loading, _error] = useAuthState(auth)

    const { recipient } = useRecipient(conversation.users)

    const router = useRouter()
    const conversationId = router.query.id

    const queryMessages = generateQueryMessages(conversationId as string)

    const [messagesSnapshot, loading, error] = useCollection(queryMessages)

    const showMessages = () => {
        if (loading) {
            return messages.map((message, index) => (
                <Message key={index} message={message} loggedInUser={loggedInUser as User}></Message>
            ))
        }
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message, index) => {
                return (
                    <Message key={index} message={transformMessage(message)} loggedInUser={loggedInUser as User}></Message >
                )
            })
        }
        return null
    }

    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const addMessageToDB = async () => {
        await addDoc(collection(db, 'messages'), {
            conversation_id: conversationId,
            send_at: serverTimestamp(),
            text: mess,
            user: loggedInUser?.email,
        })
        scrollToBottom()
        setMess('')
    }

    const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = e => {
        if (!mess) {
            return
        }
        addMessageToDB()
    }

    const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (!mess) {
                return
            }
            addMessageToDB()
        }
    }

    return (
        <>
            <StyledConversationHeader>
                <Avatar src={recipient?.photoURL} />
                <div>{recipient?.email}</div>
            </StyledConversationHeader>

            <StyledMessagesContainer>
                {showMessages()}
                <EndOfMessageForAutoScroll ref={endOfMessagesRef} />
            </StyledMessagesContainer>

            {/* Sending message */}

            <StyledInputContainer>
                <StyledInput placeholder="Input message" value={mess} onChange={(e) => setMess(e.target.value)} onKeyDown={sendMessageOnEnter} />
                <IconButton onClick={sendMessageOnClick} disabled={!mess} >
                    <SendIcon />
                </IconButton>
            </StyledInputContainer>
        </>
    )
}

export default ConversationText
