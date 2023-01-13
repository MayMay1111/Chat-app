import { User } from "firebase/auth"
import { IMessages } from "../../types"
import styled from 'styled-components'

const StyledMessage = styled.div`
    width: fit-content;
    word-break: break-all;
    max-width: 90%;
    min-width: 30%;
    padding: 15px 15px 30px;
    border-radius: 8px;
    margin:0px;
    position: relative;
    margin:10px 0;
`

const StyledSenderMessage = styled(StyledMessage)`
    background-color: #fff;
`

const StyledReceiverMessage = styled(StyledMessage)`
    margin-left: auto;
    background-color: #89f3b9;
`

const StyledTime = styled.div`
    position:absolute;
    right: 0;
    bottom: 0;
    padding: 10px;
    font-size: 12px;
    color:#726868;
`

const Message = ({ message, loggedInUser }: { message: IMessages, loggedInUser: User }) => {

    const MessageType = loggedInUser?.email === message.user ? StyledReceiverMessage : StyledSenderMessage

    return (
        <MessageType>
            {message.text}
            <StyledTime>{message.send_at}</StyledTime>
        </MessageType>
    )
}

export default Message