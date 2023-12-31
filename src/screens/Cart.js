import React, { useEffect, useState, Suspense,useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { selectCart } from '../redux/selectors/cartSelector';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { readDocument, readDocumentWithImageUrl } from '../utils/firebaseUtils';
import './Cart.css'; // Import the CSS file
import { Button, Col, Row, Badge, Placeholder,Card,Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { updateCartAction } from '../redux/actions/cartAction';
import { useNavigate } from 'react-router-dom';
import LargeEmptyCart from '../components/LargeEmptyCart';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



const concatenateAddress = (address) => {
  const ret = `${address.Name}, ${address.Building}, ${address.Street}, ${address.Landmark}, ${address.City}, ${address.Zip}, ${address.State}, ${address.Country}, ${address.PhoneNumber}`;
  console.log(ret)
  return ret
};



function Cart() {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { currentUser } = useAuth();
  const userId = currentUser? currentUser.uid : null
  const [cartDetails, setCartDetails] = useState([]);
  const [rules, setRules] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        const user = await readDocument('USERS', userId);
        setUserAddresses(user?.Addresses || []);
        console.log("address",userAddresses)
      }
    };

    fetchAddresses();
  }, [userId]);

  useEffect(()=>{
    const rulesGetter = async () =>{
     // await new Promise(resolve => setTimeout(resolve, 100000));
      console.log("Rulegetter")
      const rulesGot = await readDocument("Rules","Rules")
      setRules(rulesGot)
      console.log(rules)
    }
    rulesGetter()
  },[])

  useEffect(() => {
    const fetchCartDetails = async () => {
      const details = await Promise.all(
        Object.entries(cart).map(async ([productId, quantity]) => {
          const productDetails = await readDocument('PRODUCTS', productId);
          const productImage = await readDocumentWithImageUrl('PRODUCTIMAGES', productId);
          console.log("Yup", productDetails, productImage);
          return { productId, quantity, productImage, ...productDetails };
        })
      );
      setCartDetails(details);
    };

    if (Object.keys(cart).length > 0) {
      fetchCartDetails();
    }
  }, [cart]);

  const downloadPDF = () => {
    const content = pdfRef.current;
  
    const pdfWidth = 210; // A4 paper width in mm
    const contentWidth = content.offsetWidth;
    const scale = pdfWidth / contentWidth;
  
    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save('sample.pdf');
      },
      html2canvas: {
        scale: scale,
      },
    });
  };
  

  const calculateSubtotal = () => {
    return cartDetails.reduce(
      (total, { sizePriceMap, quantity }) => (total + sizePriceMap['S'] * quantity),
      0
    );
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateSubtotal();
    const totalBeforeTaxAndCharges = subtotal;
    const totalWithTax = (totalBeforeTaxAndCharges * (rules?.Tax || 0));
    console.log(subtotal >= rules.DeliveryChargesOffAt)
    const totalWithTaxAndDC = totalBeforeTaxAndCharges + totalWithTax + (subtotal >= rules.DeliveryChargesOffAt ? (0) : (rules.DeliveryCharges));

    return totalWithTaxAndDC.toFixed(2);
  };

  const addToCart = (quantity=0,productId) => {
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

  const removeFromCart = (productId) => {
    //const removeFromCart = () => {
      const updatedCart = { ...cart }; 
      delete updatedCart[productId];

      if (userId) {
        dispatch(updateCartAction(updatedCart, userId));
        
      } else {
        console.log("User not logged in. Redirecting to login...");
        navigate('/login');
      }
    //};
    
  };

  const removeAllFromCart = () => {
    //const removeFromCart = () => {
      const updatedCart = { }; 

      if (userId) {
        console.log("remove all")
        dispatch(updateCartAction(updatedCart, userId));
        setCartDetails([])
      } else {
        console.log("User not logged in. Redirecting to login...");
        navigate('/login');
      }
    //};
    
  };

  return (
    <>
    { cartDetails.length === 0 ? (<div >
            <h1 style={{ color: isDarkModeOn ? 'white' : 'black' }} >Shopping Cart is empty</h1>
            <LargeEmptyCart/>    
        </div>):(
          <div className={`custom-card ${isDarkModeOn ? 'dark-mode' : ''}`} style={{ color: isDarkModeOn ? 'white' : 'black' }}>
          {cartDetails.length !== 0 &&
            (<div style={{ textAlign: 'center' }}>
              <br></br>
              <h2 style={{ color: isDarkModeOn ? 'white' : 'black' }}>Shopping Cart</h2>
              <btn onClick={(e)=>removeAllFromCart()} className="delete-icon">Remove all items</btn>
              <hr></hr>
            </div>
            )
          }
          
          {cartDetails.length !== 0 && (
            <>
              <ul >
                {cartDetails.map(({ productId, name, productImage, sizePriceMap, quantity }) => (
                  <Suspense fallback={<p>Loading cart items...</p>}>
                  <Row key={productId} >
                    <Col md={4}>
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={name}
                          style={{ width: '100%' }} // Set width to 100% to fill the column
                        />
                      ) : (
                        <p>Loading image...</p>
                      )}
                    </Col>
                    <Col md={8}>
                      <div >
                        <h2 style={{ color: isDarkModeOn ? 'white' : 'black' }}>{name}</h2>
                        <p>Price for Size 'S': INR {sizePriceMap['S']}</p>
                        <p>
                          Quantity:
                          <select className="quantity-dropdown" defaultValue={quantity} onChange={(e) => addToCart(parseInt(e.target.value, 10),productId)}>
                            {[...Array(10).keys()].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </p>
                        <p>Total: INR {(sizePriceMap['S'] * quantity) }</p>
                        {
                          cartDetails.length>1?(
                            <btn className="delete-icon" onClick={(e) => removeFromCart(productId)}>Remove</btn>
                          ):""
                        }
                            </div>
                    </Col>
                  </Row>
                  <hr></hr>
                  </Suspense>
                  
                ))}
              </ul>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {userAddresses.length > 0 && (
                        <Form.Group controlId="formAddress">
                        <Form.Label>Select Address:</Form.Label>
                        {userAddresses.map((address, index) => (
                          <div key={index} className="mb-3">
                            <Form.Check
                              type="radio"
                              id={`address-radio-${index}`}
                              label={concatenateAddress(address)}
                              value={concatenateAddress(address)}
                              checked={selectedAddress === concatenateAddress(address)}
                              onChange={() => setSelectedAddress(concatenateAddress(address))}
                            />
                          </div>
                        ))}
                        <Form.Text style={{color:isDarkModeOn?"cyan":"purple"}}>{selectedAddress}</Form.Text>
                      </Form.Group>
                      
                      )}
                
                    {rules ? (
                      <div  style={{ maxWidth: '800px' }} >
                      <Card bg={isDarkModeOn?"dark":"light"} style={{ maxWidth: '100%' }} ref={pdfRef}>
                        <Card.Header>
                          <Card.Title>CheckOut</Card.Title> 
                          {selectedAddress.length?(
                            <>
                            <Card.Subtitle>{selectedAddress.split(',')[0]}</Card.Subtitle>
                            <Card.Subtitle>{selectedAddress.split(',').slice(1, -1).join(',')}</Card.Subtitle>
                            <Card.Subtitle>{selectedAddress.split(',').slice(-1)}</Card.Subtitle>
                            </>
                              ):" "}
                          
                          
                        </Card.Header>
                      <Card.Body>
                      {cartDetails.map(({ productId, name, sizePriceMap, quantity }) => (
                        <div key={productId} style={{ display: 'flex', justifyContent: 'space-between' , marginBottom: '0px' }}>
                          <p>{name}</p>
                          <p> INR {sizePriceMap['S']}*{quantity}</p>
                          <p> INR {(sizePriceMap['S'] * quantity)}</p>
                        </div>
                      ))}
                      <hr></hr>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p className="total-price">Subtotal: </p>
                          <p className="total-price">INR {calculateSubtotal()}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p className="total-price">Gst (18%): </p>
                          <p className="total-price">INR {(rules.Tax * calculateSubtotal()).toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p className="total-price">Delivery Fee: </p>
                          <p className="total-price">INR {(calculateSubtotal()>=rules.DeliveryChargesOffAt ? (0) : (rules.DeliveryCharges))}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p className="total-price">Discount: </p>
                          <p className="total-price">INR {rules?.discount || 0}</p>
                        </div>
                        <hr></hr>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <p className="total-price">Total Price: </p>
                          <p className="total-price">INR {calculateTotalPrice()}</p>
                        </div>

                    

                    </Card.Body>
                    <Card.Footer>
                    
                    </Card.Footer>
                      </Card>
                      <Button variant="info" disabled={!selectedAddress.length}>
                      Pay & Place Order
                    </Button>
                      <Button variant="info" hidden disabled={!selectedAddress.length} onClick={downloadPDF} >
                        Download PDF
                      </Button>
                      <br></br>
                      </div>
                  
                  ) : (
                    <>
                      <p className="total-price">Subtotal: INR {calculateSubtotal() }</p>
                      <Placeholder as="p" animation="glow">
                        <Placeholder xs={6} />    <Placeholder xs={4} />
                        <Placeholder xs={8} />    <Placeholder xs={10} />
                      </Placeholder>
                      
                      <Placeholder.Button variant="info" xs={1}>
                      </Placeholder.Button>
                    </>
                  )}
                  
                  
              </div>


            </>
          )}
        </div>

        )
    
      }
    
    </>
  );
}

export default Cart;
