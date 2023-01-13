import Head from 'next/head'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
import { setDoc } from 'firebase/firestore'

const StyledContainer = styled.div`
    background-color: #fff;
    width:100vw;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right:1px solid whitesmoke;
`

const StyledLoginContainer = styled.div`
    border: 1px solid #000;
    border-radius: 6px;
`

const Login = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    const signIn = () => {
        signInWithGoogle();
    }

    return (
        <StyledContainer>
            <Head>
                <title>Login</title>
            </Head>
            <StyledLoginContainer>
                <Button onClick={signIn}>Login with Google</Button>
            </StyledLoginContainer>
        </StyledContainer>
    )
}

export default Login