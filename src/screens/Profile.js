import React from 'react';
import { Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector, useDispatch } from 'react-redux';
import Address from '../components/Address';

const Profile = () => {
  const { currentUser } = useAuth();
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  if (!currentUser) {
    return <p>No user logged in</p>;
  }

  const { displayName, email  } = currentUser;

  return (
    <>
    <Table variant={isDarkModeOn?"dark":"light"} striped bordered hover>
      <thead>
        <tr>
          <th>User Data</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Display Name</td>
          <td>{displayName}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{email}</td>
        </tr>
        <tr>
          <td>Email Verified</td>
          <td>True</td>
        </tr>
        {/* Add more rows for other user properties if needed */}
      </tbody>
    </Table>
    <div hidden>
    <Address  />
    </div >
    </>
  );
};

export default Profile;
