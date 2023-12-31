import React, { useEffect, useState } from 'react';
import { readDocument, saveDocument, updateDocumentFields, deleteDocument } from '../utils/firebaseUtils';
import { useAuth } from '../context/AuthContext';
import { Button, Form , Card, ButtonGroup} from 'react-bootstrap';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector,useDispatch } from 'react-redux';
import { Trash, Pencil } from 'react-bootstrap-icons';

function Address() {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    Name: '',
    Building: '',
    Street: '',
    Landmark: '',
    City: '',
    Zip: '',
    State: '',
    Country: '',
    PhoneNumber:'',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        const userAddresses = await readDocument('USERS', userId);
        setAddresses(userAddresses?.Addresses || []);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleInputChange = (key, value) => {
    setNewAddress((prevAddress) => ({ ...prevAddress, [key]: value }));
  };

  const addAddress = async () => {
    if (!userId) return;

    const updatedAddresses = [...addresses, newAddress];
    await saveDocument('USERS', userId, { Addresses: updatedAddresses });
    setAddresses(updatedAddresses);
    setNewAddress({
      Name: '',
      Building: '',
      Street: '',
      Landmark: '',
      City: '',
      Zip: '',
      State: '',
      Country: '',
      PhoneNumber:'',
    });
  };

  const updateAddress = async (index) => {
    if (!userId) return;
    if (!newAddress.Name){
      return
    }
    
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = newAddress;
    await updateDocumentFields('USERS', userId, { Addresses: updatedAddresses });
    setAddresses(updatedAddresses);
    setNewAddress({
      Name: '',
      Building: '',
      Street: '',
      Landmark: '',
      City: '',
      Zip: '',
      State: '',
      Country: '',
      PhoneNumber:'',
    });
    cancelEdit()
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const editAddress = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    console.log(isEditing,editingIndex)
    // Set the newAddress state with the values of the selected address
    const selectedAddress = addresses[index];
    setNewAddress({
      Name: selectedAddress.Name,
      Building: selectedAddress.Building,
      Street: selectedAddress.Street,
      Landmark: selectedAddress.Landmark,
      City: selectedAddress.City,
      Zip: selectedAddress.Zip,
      State: selectedAddress.State,
      Country: selectedAddress.Country,
      PhoneNumber: selectedAddress.PhoneNumber,
    });
    
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setNewAddress({
      Name: '',
      Building: '',
      Street: '',
      Landmark: '',
      City: '',
      Zip: '',
      State: '',
      Country: '',
      PhoneNumber: '',
    });
  };

  const deleteAddress = async (index) => {
    if (!userId) return;

    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    console.log(updatedAddresses)
    await updateDocumentFields('USERS', userId, { Addresses: updatedAddresses });
    setAddresses(updatedAddresses);
  };

  const generateInputFormControls = () => {
    return Object.keys(newAddress).map((key) => (
      <Form.Group key={key} controlId={key}>
        <Form.Label>{key}</Form.Label>
        <Form.Control
          type="text"
          value={newAddress[key]}
          onChange={(e) => handleInputChange(key, e.target.value)}
          style={{backgroundColor:isDarkModeOn?'#D6DADA' : '#D6DADA', color:isDarkModeOn?'black' : 'black'}}
          required
        />
      </Form.Group>
    ));
  };


  return (
    <div>
      <h1 style={{ color:isDarkModeOn?'white' : 'black'}}>Addresses</h1>
      {addresses.map((address, index) => (
        <Card
          key={index}
          style={{
            marginBottom: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s',
          }}
          bg={isDarkModeOn?"dark":"light"}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
        >
          <Card.Body>
            <Card.Title>{` ${address.Name}`}</Card.Title>
            <Card.Text style={{ color:isDarkModeOn?'white' : 'black'}}>{`${address.Building}, ${address.Street}, ${address.City}, ${address.State}, ${address.Country}`}</Card.Text>
            <Card.Text style={{ color:isDarkModeOn?'white' : 'black'}}>Zip/Pincode: {`${address.Zip}`}</Card.Text>
            <Card.Text style={{ color:isDarkModeOn?'white' : 'black'}}>Contact: {`${address.PhoneNumber}`}</Card.Text>
            <ButtonGroup>
              <Button variant="danger" onClick={() => deleteAddress(index)}>
                Delete
              </Button>
              <Button variant="info" onClick={() => editAddress(index)}>
                Edit
              </Button>
            </ButtonGroup>
          </Card.Body>
        </Card>
      ))}
      <h2 style={{ color:isDarkModeOn?'white' : 'black'}}>{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
      <Form  onSubmit={(e) => {e.preventDefault()}} >
        <Card style={{backgroundColor:isDarkModeOn?'#36454F' : '', color:isDarkModeOn?'white' : 'black'}}>
          <Card.Body style={{backgroundColor:isDarkModeOn?'#36454F' : '', color:isDarkModeOn?'white' : 'black'}}>
        {generateInputFormControls()}
        {isEditing && (
          <>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={() => updateAddress(editingIndex)}>
              Update
            </Button>
          </>
        )}
        {!isEditing && (
          <Button type="button" onClick={addAddress}>
            Add Address
          </Button>
        )}
        </Card.Body>
        </Card>
      </Form>
    </div>
  );
}

export default Address;
