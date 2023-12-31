import React,{useState} from 'react'
import {Button,Box,Card,Col,Row} from 'react-bootstrap'
import { auth, provider,db } from '../config'
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../constants';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';

const actionCodeSettings = {
  // URL for localhost development. Update the port as needed.
  url: 'http://localhost:3000',
  // This must be true.
  handleCodeInApp: true,
  // Other settings...
};


function LoginPage() {

  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  localStorage.clear();

  const addUserIfMissing = async (user) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log('User already exists.');
      } else {
        console.log('User not found. Adding user...');
        await setDoc(userRef, {
          Name: user.displayName,
          Email: user.email,
          DoB: null, // You may want to add the user's date of birth here
          UserId: user.uid,
          ProductsListed: [],
          ProductsOrdered: [],
          Cart: {},
          Seller: false,
          KycIdList: {},
          TransactionIDs: [],
          Addresses: [],
          recentlyWatched: { 0: '', 1: '', 2: '', 3: '', 4: '' },
        });
        console.log('User added successfully');
      }
      console.log("User data",userSnap.data())
      localStorage.setItem('cart',JSON.stringify(userSnap.data().Cart));
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const sendEmailLink = async (e) => {
    e.preventDefault();
    try {
      console.log("EMail link", email)
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      console.log("Email sent at", email)
      alert("Email Sent at ", String(email))
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode," : ",errorMessage)
    }
  };

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
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        await addUserIfMissing(result.user);
        alert('Logged In');
        navigate(`/`);
        
      } catch (error) {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be an invalid email and invalid or expired OTPs.
      }
    }
  };


  const signin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      setIsLoggedIn(true);

      await addUserIfMissing(user);
      
      alert("Logged In")
      //localStorage.setItem('cart', JSON.stringify(newCartState));
      navigate(`/`);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setLoginFailed(true);
    }
  };



  return (
    
    <Card  border={ isDarkModeOn ? 'info' : 'secondary'} className="mx-auto" style={{  width: '30rem', alignItems: 'center', backgroundColor: isDarkModeOn ? 'black' : 'white' }}>
      <br></br>
      <Card.Title>Login Methods</Card.Title>
      <Col>
      <Row>
        <Card.Text>Login via link</Card.Text>
        <Form onSubmit={sendEmailLink}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll send a login link to this email address.
            </Form.Text>
          </Form.Group>
          <Button style={{backgroundColor: isDarkModeOn ? '#892CDC' : 'black'}} type="submit">Send Login Link</Button>
        </Form>
      </Row>
      <hr />
      <Row>
      <Card.Text>Login via Google</Card.Text>
      <Form
        style={{ alignItems: 'center' }}
        onSubmit={(e) => {
          e.preventDefault();
          signin();
        }}
      >
        <Button
          type="submit"
          style={{
            backgroundColor: isDarkModeOn ? '#892CDC' : 'black',
            color: 'white',
            border: 'none',
            boxShadow: 'none',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            textTransform: 'none',
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Icon"
            style={{ marginRight: '10px', height: '20px' }}
          />
          Sign In with Google
        </Button>
      </Form>
      </Row>
      </Col>
      <br></br>
    </Card>

  )
}

export default LoginPage
