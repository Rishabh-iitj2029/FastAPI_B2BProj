import React from 'react'
import {SignIn} from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <div>
      <div className={"auth-container"}>
        <SignIn routing={'path'} path={"/sign-in"} signUpUrl={"/sign-up"}/>
      
    </div>
    </div>
  )
}

export default SignInPage
