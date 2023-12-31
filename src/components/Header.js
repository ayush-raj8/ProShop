import React, { useState } from 'react'
import { Container,Navbar,Nav,Form,Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { darkModeAction } from '../redux/actions/darkModeAction'; 
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import { selectCart } from '../redux/selectors/cartSelector';
import ShoppingCartIcon from './ShoppingCartIcon';

function Header() {
  const dispatch = useDispatch();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const cart = useSelector(selectCart);
  console.log("From header",cart," length: ", Object.keys(cart).length)
  const handleToggleDarkMode = () => {
    dispatch(darkModeAction()); // Dispatch the action using useDispatch
  };

  //const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  console.log(currentUser)

  const [showDropdown, setShowDropdown] = useState(false);

  const handleUserIconClick = () => {
    setShowDropdown(true);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <Navbar bg={isDarkModeOn ? 'dark' : 'light'} variant={isDarkModeOn ? 'dark' : 'light'} expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/">ProShop </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {
              currentUser?( <>
                   <Nav.Link href="/cart">
                    <ShoppingCartIcon cart={cart}/>
                  </Nav.Link>
                   </>):(<>
                  <Nav.Link href="/cart" ><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                </>)
            }
            
            {currentUser? (
              <> 
              <Nav.Link onClick={handleUserIconClick} style={{ display: 'flex', alignItems: 'center' }}>
              <img src={currentUser.photoURL} style={{ height: '1.5rem', borderRadius: '50%', marginRight: '0.5rem' }} alt="Profile" />
              </Nav.Link>
              <UserDropdown show={showDropdown} onHide={handleCloseDropdown} />
              </>
            
            ) : (<Nav.Link href="/login">
              <i className="fas fa-user">
                </i>Login </Nav.Link>)}
            
            <Button variant="outline-light" onClick={handleToggleDarkMode}
              style={{
                border: 'none',          // Remove border
                fontSize: '1.5rem',      // Adjust font size to match other icons
                background: 'transparent' // Set background to transparent
              }}
            >
              {isDarkModeOn ? '🌞' : '🌚'}
            </Button>
          </Nav>
          <Form className="d-flex ms-auto">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link to={`/search/${searchQuery}`} onClick={(e) => {
              if (searchQuery.trim() === '') {
                console.log("Empty Search...")
                e.preventDefault();
              }
            }}>
            <Button variant="outline-success">Search</Button>
            </Link>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
