import { doc, getDoc, getDocs } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { transform } from 'typescript'
import { auth, db } from '../../config/firebase'
import { Conversation, IMessages } from '../../types'
import { generateQueryMessages } from '../../utils/getMessagesInCon'
import { getRecipientEmail } from '../../utils/getRecipientEmail'
import transformMessage from '../../utils/transformMessage'
import ConversationText from '../components/ConversationText'
import Sidebar from '../components/Sidebar'

const StyledContainer = styled.div`
    display: flex;
    background: #fff;
    color: #000;
    width: 100vw;
    height: 100vh;
    &::-webkit-scrollbar {
        display: none;
    }
`

const StyledConversationContainer = styled.div`
    width: 100%;
	::-webkit-scrollbar {
		display: none;
	}
    -ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`

interface Props {
    conversation: Conversation,
    messages: IMessages[],
}

const ConversationBox = ({ conversation, messages }: Props) => {
    const [loggedInUser, loading, error] = useAuthState(auth)

    return (
        <StyledContainer>
            <Head>
                <title>{getRecipientEmail(conversation.users, loggedInUser)}</title>
            </Head>

            <Sidebar />

            <StyledConversationContainer>
                <ConversationText conversation={conversation} messages={messages} />
            </StyledConversationContainer>
        </StyledContainer>
    )
}

export default ConversationBox

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async context => {
    const conversationId = context.params?.id

    // get conversation

    const conRef = doc(db, 'conversations', conversationId as string)
    const conSnapshot = await getDoc(conRef)

    //get messages
    const queryMessages = generateQueryMessages(conversationId)

    const messSnapshot = await getDocs(queryMessages)

    const messages = messSnapshot.docs.map(doc => transformMessage(doc))

    return {
        props: {
            conversation: conSnapshot.data() as Conversation,
            messages
        }
    }
}