import {Routes,Route} from "react-router-dom"
import { SignedIn,SignedOut,RedirectToSignIn,} from "@clerk/clerk-react"
import SignInPage from "./pages/SignInPage"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import SignUpPage from "./pages/SignUp"
import PricingPage from "./pages/PricingPage"
import Layout from "./components/Layout"

function ProtectedRoute({children}){
  return<>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn/>
    </SignedOut>
  </>
}

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Layout/>} >
        <Route index element={<HomePage/>}/>
        <Route path={"sign-in/*"} element={<SignInPage/>} />
        <Route path={"sign-up/*"} element={<SignUpPage/>} />
        <Route path={"pricing"} element={<PricingPage/>} />
        <Route path={"dashboard"} 
        element={
        
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>} 
        />
      </Route>
    </Routes>
  )
}

export default App
