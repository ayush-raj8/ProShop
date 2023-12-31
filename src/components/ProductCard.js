import React,{useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { selectCart } from '../redux/selectors/cartSelector'; // Import the cart selector
import { updateCartAction } from '../redux/actions/cartAction'; // Import the action to update the cart
import { useSelector,useDispatch } from 'react-redux';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config';
import './ProductCard.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProductCard ({ product, quantitySent=0 }){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const { currentUser } = useAuth();
    const userId = currentUser? currentUser.uid : null
    const cart = useSelector(selectCart);
    const productId = product.id
    const [productUrl,setProductUrl] = useState(null)
    const [quantity, setQuantity] = useState(quantitySent);

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
        setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };
    useEffect(() => {
        // Fetch and set the studio icon URL using productId
        if (productId) {
          const storagePath = `PRODUCTIMAGES/${productId}`;
          const folderRef = ref(storage, storagePath);
    
          try {
            listAll(folderRef)
              .then((result) => {
                if (result.items.length > 0) {
                  const firstFileRef = result.items[0];
                  getDownloadURL(firstFileRef)
                    .then((url) => {
                      setProductUrl(url);
                    })
                    .catch((error) => {
                      console.error('Error fetching studio icon:', error);
                    });
                } else {
                  console.log('No files found in the folder.');
                }
              })
              .catch((error) => {
                console.error('Error listing files in the folder:', error);
              });
          } catch (error) {
            console.error('Error fetching studio icon:', error);
          }
        }
      }, [productId,quantity]);
      
      const addToCart = () => {
        if(quantity===0){
          alert("No items selected for cart")
          return
        }
        cart[productId] =quantity
        const updatedCart = cart
        console.log("Product Card ",updatedCart,cart)
        if(userId){
        dispatch(updateCartAction(updatedCart,userId));
        }else{
          navigate('/login');
        }
      };

      const removeFromCart = () => {
        //const removeFromCart = () => {
          const updatedCart = { ...cart }; 
          delete updatedCart[productId];

          if (userId) {
            dispatch(updateCartAction(updatedCart, userId));
            setQuantity(0);
          } else {
            console.log("User not logged in. Redirecting to login...");
            navigate('/login');
          }
        //};
        
      };
      
      
      const cardClass = `mb-2 ${isDarkModeOn ? 'product-card product-card-dark' : 'product-card product-card-light'}`;
  
  
  
      return (

    <div className={cardClass} style={{  background: isDarkModeOn ? '#343a40' : '#fff', color: isDarkModeOn ? '#fff' : '#000' }}>
      <div style={{ position: 'relative', padding: '1rem' }}>
  <img src={productUrl} alt={product.name} style={{ width: '100%', height: 'auto' }} />
    {quantity ? (
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem',
          cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '50%',
        }}
        onClick={removeFromCart}
      >
          ❌
        </div>
      ) : (
        ''
      )}
    </div>

      <div style={{ padding: '1rem' }}>
        <p style={{color: isDarkModeOn ? '#fff' : '#000'}}>{product.name}</p>
        <p style={{color: isDarkModeOn ? '#fff' : '#000', fontSize: '8px'}}>{product.id}</p>
        <p style={{color: isDarkModeOn ? '#fff' : '#000'}}>₹{product.sizePriceMap['S']}</p>
        <ButtonGroup variant="contained" style={{ alignItems: 'center', justifyContent: 'center', padding:'5px' }}>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#000' : '#000'}}   onClick={handleDecrement}>-</Button>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#808080' : '#808080'}} onClick={() => {}}>{quantity?quantity:"Add"}</Button>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#000' : '#000'}}  onClick={handleIncrement}>+</Button>
        </ButtonGroup>
        <Button variant='success' onClick={addToCart}>Add to Cart</Button>
        
      </div>
    </div>
  );
};

export default ProductCard;
