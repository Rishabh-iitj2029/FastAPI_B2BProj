import React from 'react'
import {useOrganization} from "@clerk/clerk-react"
import {PricingTable, CreateOrganization} from "@clerk/clerk-react"

const PricingPage = () => {
  const {organization, membership} = useOrganization()
  const isAdmin = membership?.role === "org:admin"

  if(!organization){
    return <div className={"pricing-container"}>
      <div className={"no-org-container"}>
          <h1 className={"no-org-title"}> View Pricing</h1>
            <p className= {"no-org-text"}>
                Create or join an organization to view pricing palns
            </p>
            <CreateOrganization afterCreateOrganizationUrl={"/pricing"}/>
      </div>
    </div>
  }
  return (
    <div className={'pricing-container'}>
      <div className={"pricing-header"}>
            <h1 className={'pricing-title'}>Simple, Transparent Pricing</h1>
            <p>
              Start free with up to 2 members, Upgrade to pro for unlimited members
            </p>
      </div>

      {!isAdmin? (
        <p className='text-muted pricing-admin-note'>
          Contact your organization admin for managing the subscription
        </p>
      ):(
        <PricingTable for={"organization"}/>
      )}
    </div>
  )
}

export default PricingPage
