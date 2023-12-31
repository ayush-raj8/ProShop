import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {doc,getDoc,updateDoc,collection,where,query,getDocs} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm'; // Adjust the path
import { db } from '../config'; // Adjust the path
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';

function Seller() {
  const { currentUser } = useAuth();
  const [productsList, setProductsList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const fetchData = async () => {
    try {
      const productsRef = collection(db,'PRODUCTS');
      const q = query(productsRef, where('createdBy', '==',currentUser.uid));
      const productsSnapshot = await getDocs(q);

      let productsData = []
      productsSnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
  
      setProductsList(productsData);
      console.log(productsData)
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle the error
    }
  };
  

  useEffect(() => {
    // Fetch the products listed by the current user
    

    fetchData();
  }, [currentUser]);

  const handleEdit = (productId) => {
    // Set the selected product ID to trigger the form update
    setSelectedProductId(productId);
  };

  const handleUpdate = () => {
    // Clear the selected product ID to close the form
    setSelectedProductId(null);

    // Trigger a re-fetch of the product list
    fetchData();
  };

  return (
    <Container style={{backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black'}}>
      <Row >
        <Col >
          <Card className="mb-2"  border={ isDarkModeOn ? 'info' : 'secondary'} bg={isDarkModeOn ? 'dark' : 'light'} text={isDarkModeOn ? 'white' : 'dark'} >
            <Card.Body >
            <Card.Title >{selectedProductId ? 'Edit Product' : 'Add Products'}</Card.Title>
            <Card.Subtitle >{selectedProductId ? selectedProductId: ''}</Card.Subtitle>
              <ProductForm productId={selectedProductId} onUpdate={handleUpdate} product={productsList.find((product) => product.id === selectedProductId)}/>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
      
      <Row>
        
      <Col >
          {productsList.length>0?(productsList.map((product) => (
            <Card  className="mb-2" border={ isDarkModeOn ? 'info' : 'secondary'}  bg={isDarkModeOn ? 'dark' : 'light'} text={isDarkModeOn ? 'white' : 'dark'} key={product.id} >
              <Card.Body >
                <Card.Text >Name: {product.name}</Card.Text>
                <Card.Text >Id {product.id}</Card.Text>
                
                <Button onClick={() => handleEdit(product.id)}>Edit</Button>
              </Card.Body>
            </Card>
          ))):"No data"}
        </Col>
      </Row>
    </Container>
  );
}

export default Seller
