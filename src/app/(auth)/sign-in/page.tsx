import { signIn } from 'next-auth/react'
import React from 'react'

function SignIn() {
  return (
    <>
        <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default SignIn