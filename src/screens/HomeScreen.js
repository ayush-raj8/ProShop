import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import {doc,getDoc,updateDoc,collection,where,query,getDocs} from 'firebase/firestore';
import { db } from '../config';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';
import { selectCart } from '../redux/selectors/cartSelector';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const cart = useSelector(selectCart);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRef = collection(db, 'PRODUCTS');
        const productsSnapshot = await getDocs(productsRef);
    
        let productsData = [];
        productsSnapshot.forEach((doc) => {
          const product = {
            id: doc.id,
            ...doc.data(),
          };
        
          // Check if the product's id is not "Default" before adding it to productsData
          if (product.id !== "Default") {
            productsData.push(product);
          }
        });
    
        setProducts(productsData);
        console.log(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Handle the error
      }
    };
    

    fetchData();
  }, []);

  return (
    <div >
    <h1 style={{color:isDarkModeOn?"white":"black"}}>Products</h1>
    <Row>
      {products.map((product, index) => (
        product.id !== "Default" && (
          <Col key={product.id} xs={12} sm={6} md={4} >
            <ProductCard product={product}  quantitySent={cart?(cart[product.id]?cart[product.id]:0):0} />
            {(index + 1) % 3 !== 0 && <div className="mr-3" />}
          </Col>
        )
      ))}
    </Row>
  </div>
  
  );
};

export default HomeScreen;
