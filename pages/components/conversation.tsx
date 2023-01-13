import React, { useState } from 'react'
import { Conversation } from '../../types';
import styled from 'styled-components'
import { getRecipientEmail } from '../../utils/getRecipientEmail';
import { useRecipient } from '../../hooks/useRecipient';
import Recipient from './Recipient';
import { useRouter } from 'next/router';

const StyledConversation = styled.div`
    display:flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-around;
    word-break: break-all;
    color: #000;

    :hover{
        background-color: #e9eaeb;
    }
`

const ConversationSelectors = ({ id, conversationUsers }: { id: string; conversationUsers: Conversation['users'] }) => {

    const router = useRouter()

    const selectConversation = () => {
        router.push(`/conversations/${id}`)
    }

    const { recipient } = useRecipient(conversationUsers)
    return (
        <StyledConversation onClick={selectConversation}>
            <Recipient recipient={recipient} />
        </StyledConversation>
    )
}

export default ConversationSelectors