// ProductForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config'; // Adjust the path
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';


const handleProfilePictureChange = async (file, entityId) => {
   
    console.log("Inside handleProfilePictureChange")
    try {
      // Delete old files in the storage folder
      const storageFolder = 'PRODUCTIMAGES'; // Replace with your desired storage folder name
      const folderPath = `${storageFolder}/${entityId}`;
      const storageRef = ref(storage, folderPath);
      console.log("handleProfilePictureChange ",storageFolder,folderPath)
  
      const itemsToDelete = await listAll(storageRef);
      itemsToDelete.items.forEach(async (itemRef) => {
        await deleteObject(itemRef);
      });
  
      // Upload the new file
      const fileRef = ref(storage, `${folderPath}/${file.name}`);
      await uploadBytes(fileRef, file);
  
      // Get the updated download URL for the uploaded image
      const imageUrl = await getDownloadURL(fileRef);
  
      // Return the profile picture URL
      return imageUrl;
    } catch (error) {
      console.error('Error handling profile picture:', error);
      throw error; // Propagate the error up
    }
  };


function ProductForm({ productId, onUpdate,product }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [sizePriceMap, setSizePriceMap] = useState({ S: 0, M: 0, L: 0 });
  const [quantity, setQuantity] = useState(0);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationTextCharges, setAnnotationTextCharges] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  useEffect(() => {
    // Update form fields when the product prop changes
    if (product) {
      setName(product.name || '');
      setSizePriceMap(product.sizePriceMap || {});
      setQuantity(product.quantity || 0);
      setAnnotationText(product.annotationText || '');
      setAnnotationTextCharges(product.annotationTextCharges || 0);
      // Add other fields as needed
    }
  }, [product]);
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImgFile(e.target.files[0]);
      // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSizePriceChange = (size, value) => {
    setSizePriceMap((prevMap) => ({ ...prevMap, [size]: value }));
  };

  const handleAddRow = () => {
    setSizePriceMap((prevMap) => ({
      ...prevMap,
      [String.fromCharCode(Object.keys(prevMap).length + 65)]: 0,
    }));
  };

  const handleDeleteRow = (size) => {
    const { [size]: deletedSize, ...rest } = sizePriceMap;
    setSizePriceMap(rest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Add product data to Firestore without the image
    const productDataWithoutImage = {
      name,
      sizePriceMap,
      annotationText,
      annotationTextCharges,
    };
  
    let docRef;
  
    if (productId) {
      // If updating, update the existing document
      
      await updateDoc(doc(db, 'PRODUCTS', productId),{
        name:name,
        sizePriceMap:sizePriceMap,
        annotationText:annotationText,
        annotationTextCharges:annotationTextCharges,
        createdBy:currentUser.uid,
        } );
      onUpdate();
    } else {
      // If creating, add a new document and obtain the product ID
      console.log("Hii")
      docRef = await addDoc(collection(db, 'PRODUCTS'), {
        name:name,
        sizePriceMap:sizePriceMap,
        annotationText:annotationText,
        annotationTextCharges:annotationTextCharges,
        createdBy:currentUser.uid,
    });
    }
  
    // Upload image to Firebase Storage using the obtained product ID
    if (imgFile && docRef && docRef.id ) {
        const imageUrl = await handleProfilePictureChange(imgFile, docRef.id);
        console.log('Profile picture uploaded:', imageUrl);
        alert("Uploaded")
    }

  };
  

  return (
    <Form onSubmit={handleSubmit} >
      <Form.Group controlId="productName" >
        <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black'}}>Product Name</Form.Label>
        <Form.Control
        style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Table striped bordered hover variant={ isDarkModeOn ? 'dark' : 'light'}  >
        <thead>
          <tr>
            <th>Size</th>
            <th>Price</th>
            <th hidden>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sizePriceMap).map((size) => (
            <tr key={size}>
              <td  >{size}</td>
              <td>
                <Form.Control
                style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
                  type="text"
                  placeholder={`Enter price for size ${size}`}
                  value={sizePriceMap[size]}
                  onChange={(e) => handleSizePriceChange(size, e.target.value)}
                />
              </td>
              <td hidden>
                <Button variant="danger" onClick={() => handleDeleteRow(size)}>
                  Delete
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={handleAddRow}>
        Add Row
      </Button>

      <Form.Group controlId="productImage">
        <Form.Label>Product Image</Form.Label>
        <Form.Control
         style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewImage && (
    <img
      src={previewImage}
      alt="Product Preview"
      style={{ marginTop: '10px', maxWidth: '100%' }}
    />
  )}
      </Form.Group>

      <Button variant="primary" type="submit">
        {productId ? 'Update Product' : 'Create Product'}
      </Button>
    </Form>
  );
}

export default ProductForm;
