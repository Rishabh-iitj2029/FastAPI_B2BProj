import React from 'react'
import {Link} from "react-router-dom"
import { SignedIn,SignedOut,useOrganization, CreateOrganization } from '@clerk/clerk-react'
const HomePage = () => {
    const {organization} = useOrganization()
    return (
    <div className={"home-container"}>
        <h1 className= {"home-tite"}>
        Team Task Management <br/>
        <span className= {"home-title-accent"}>Made Simple</span>
        </h1>
        <p className= {"home-subtitle"}>
        Organize your team's work with powerful task board.
        create, assign, and track tasks across your oranizations
        </p>

        <SignedOut>
            <div className= {"home-buttons"}>
                <Link to={"/sign-up"} className={"btn btn-primary btn-lg"}>
                Get started for free
                </Link>
                <Link to={"/sign-in"} className={"btn btn-outline btn-lg"}>
                Sign In
                </Link>
            </div>
        </SignedOut>
        <SignedIn>
            {organization ? (
                <Link to={"/dashboard"} className={"btn btn-primary btn-lg"}>
                    Go the Dashborad
                </Link>
            ):(
                <div className= {"home-create-org"}>
                    <CreateOrganization afterCreateOrganizationUrl={"/dashboard"}/>
                </div>
            )}
        </SignedIn>
    </div>
  )
}

export default HomePage
