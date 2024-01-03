import React,{useEffect, useState } from 'react';
import { Button, ButtonGroup ,Card, CardHeader} from 'react-bootstrap';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { selectCart } from '../redux/selectors/cartSelector'; // Import the cart selector
import { updateCartAction } from '../redux/actions/cartAction'; // Import the action to update the cart
import { useSelector,useDispatch } from 'react-redux';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config';
import './ProductCard.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { COLLECTIONS,STORAGES } from '../const';
import { readDocument, readDocumentWithImageUrl } from '../utils/firebaseUtils';

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
        const fetchData = async() => {
        const productImageUrl = await readDocumentWithImageUrl(STORAGES.PRODUCTIMAGES, productId);
        setProductUrl(productImageUrl)
        }
        fetchData()
        
      }, [productId]);
      
      const addToCart = () => {
        if(quantity===0){
          alert("No items selected for cart")
          return
        }
        localStorage.setItem("try",1)
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

    <Card className={cardClass} style={{  background: isDarkModeOn ? '#343a40' : '#fff', color: isDarkModeOn ? '#fff' : '#000' }}>
      <Card.Header style={{ position: 'relative', padding: '1rem' }}>
        <Card.Img src={productUrl} alt={product.name} style={{ maxHeight: '15rem' , width: 'auto' }} />
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
      </Card.Header>

      <Card.Body style={{ padding: '1rem' }}>
        <h6 style={{color: isDarkModeOn ? '#fff' : '#000'}}>{product.name}</h6>
        <p style={{color: isDarkModeOn ? '#fff' : '#000'}}>{product.authors}</p>
        <p style={{color: isDarkModeOn ? '#fff' : '#000'}}>{product.currency}{product.price}</p>
        <ButtonGroup variant="contained" style={{ alignItems: 'center', justifyContent: 'center', padding:'5px' }}>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#000' : '#000'}}   onClick={handleDecrement}>-</Button>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#808080' : '#808080'}} onClick={() => {}}>{quantity?quantity:"Add"}</Button>
          <Button style={{color: isDarkModeOn ? '#fff' : '#fff',background: isDarkModeOn ? '#000' : '#000'}}  onClick={handleIncrement}>+</Button>
        </ButtonGroup>
      </Card.Body>
      <Card.Footer>
        <Button variant='success' onClick={addToCart}>Add to Cart</Button>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
