import { AppUser } from "../../types"
import Avatar from "@mui/material/Avatar"
import { useRecipient } from "../../hooks/useRecipient"
import styled from 'styled-components'

type Props = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)``

const StyledUserContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 10px;
    align-items: center;
`

const StyledName = styled.div`
    padding-left: 10px;
`

const Recipient = ({ recipient }: Props) => {
    return (
        <StyledUserContainer>
            <StyledAvatar src={recipient?.photoURL || ''} />
            <StyledName>{recipient?.email}</StyledName>
        </StyledUserContainer>
    )
}

export default Recipient