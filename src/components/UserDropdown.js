import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config';
import { clearCartAction } from '../redux/actions/cartAction';
import { useSelector,useDispatch } from 'react-redux';

function UserDropdown({ show, onHide }) {
    const { currentUser } = useAuth();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
          await auth.signOut();
          const clearCart = () => {
            dispatch(clearCartAction());
          };
          clearCart()
          // The user is now logged out. You can also add additional cleanup or redirect logic if needed.
        } catch (error) {
          console.error('Error during logout:', error.message);
        }
      };

  const handleProfile = () => {
    // Implement your profile page navigation logic here
    window.open('#/profile', '_blank', 'noopener noreferrer');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{currentUser.displayName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="link" onClick={handleProfile} style={{ textDecoration: 'none', color: 'inherit' }}>
          Profile
        </Button>
        <Button variant="link" onClick={handleLogout} style={{ textDecoration: 'none', color: 'inherit' }}>
          Logout
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default UserDropdown
