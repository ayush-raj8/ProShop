import React from 'react'
import {isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from '../config'
import { useNavigate } from 'react-router-dom';

function LoggedIn() {
    const navigate = useNavigate();
    const handleSignInWithEmailLink = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = localStorage.getItem('emailForSignIn');
          if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again.
            email = window.prompt('Please provide your email for confirmation');
          }
      
          try {
            // The client SDK will parse the code from the link for you.
            const result = await signInWithEmailLink(auth, email, window.location.href);
            console.log("Result",result)
            alert(result)
            localStorage.setItem("Result",result)
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            //await addUserIfMissing(result.user);
            alert('Logged In');
            navigate(`/`);
            
          } catch (error) {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be an invalid email and invalid or expired OTPs.
          }
        }
      };
      handleSignInWithEmailLink()
  return (
    <div>
      
    </div>
  )
}

export default LoggedIn
