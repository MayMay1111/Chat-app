import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import LogoutIcon from '@mui/icons-material/Logout'
import Button from '@mui/material/Button'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useAuthState } from 'react-firebase-hooks/auth';
import React from 'react'
import { useState } from 'react'
import * as EmailValidator from 'email-validator'
import { collection, addDoc, query, where, doc, getDoc } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Conversation } from '../../types'
import ConversationSelectors from './conversation'

const StyledContainer = styled.div`
    background-color: #fff;
    min-width:300px;
    max-width:350px;
    height: 100vh;
    border-right:1px solid whitesmoke;
`

const StyledHeader = styled.div`
    display:flex;
    position: sticky;
    top:0;
    left:0;
    background-color: #fff;
    z-index: 1;
    justify-content: space-between;
    padding:15px;

`

const StyledSearch = styled.div`
    display: flex;
    justify-items: center;
    padding:15px;
    color: #000;
`

const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    background: transparent;
    color:#000;
`

const StyledSidebarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    font-size: 12px;
`

const StyledUserAvatar = styled(Avatar)`
    cursor:pointer;
    :hover{
        opacity:0.5;
    }
`

const Sidebar = () => {
    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    }

    const [loggedInUser] = useAuthState(auth);

    const [recipientEmail, setRecipientEmail] = useState('')

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const currentUser = query(collection(db, 'conversations'), where('users', 'array-contains', loggedInUser?.email))
    const [conversationsSnapshot, loading, error] = useCollection(currentUser)

    const conIsAlreadyExisted = (recipientEmail: string) => {
        return conversationsSnapshot?.docs.find(conversation => {
            return (conversation.data() as Conversation).users.includes(recipientEmail)
        }
        )
    }

    const userIsExisted = async (email: string) => {
        const docRef = doc(db, 'users', email);
        const docSnap = await getDoc(docRef)
        return docSnap.data()
    }

    const handleAdd = async () => {
        const autism: boolean = recipientEmail === loggedInUser?.email;
        if (!recipientEmail) return;
        const addedUser = await userIsExisted(recipientEmail)
        if (EmailValidator.validate(recipientEmail) && !conIsAlreadyExisted(recipientEmail) && !autism && addedUser) {
            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientEmail],
            })
        }
        handleClose();
    }

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip title={loggedInUser?.email as string} placement='right'>
                    <StyledUserAvatar src={loggedInUser?.photoURL || ''} />
                </Tooltip>

                <div>
                    <IconButton onClick={logOut}>
                        <LogoutIcon />
                    </IconButton>
                </div>

            </StyledHeader>

            <StyledSearch>
                <SearchIcon />
                <StyledSearchInput placeholder="Search" />
            </StyledSearch>

            <StyledSidebarButton onClick={handleClickOpen}>Start new conversation</StyledSidebarButton>

            {/* List of friend */}
            {conversationsSnapshot?.docs.map(conversation => (
                <ConversationSelectors key={conversation.id} id={conversation.id} conversationUsers={(conversation.data() as Conversation).users} />
            ))
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Start a conversation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter email that you want to start a new conversation
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={!recipientEmail} onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </StyledContainer >
    )
}

export default Sidebar