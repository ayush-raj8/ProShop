 import React from 'react'
 import {Card} from 'react-bootstrap'
 import Rating from './Rating'
 import { Link } from 'react-router-dom';
/*
 function Product ({product}) {
   return (
     <Card className='my-3 p-3 rounded'> 

        <Card.Body>
           <a href='/product/{product._id}'>
           <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
        <Card.Img src={product.image} style={{ height: '100%', width: 'auto' }} />
          </div>
            <Card.Title as="div"> 
              <strong>{product.name} </strong>
             </Card.Title>
           </a>
           <Card.Text as="div">
             <div className="my-3">
              <Rating value={product.rating }></Rating>

             </div>
           </Card.Text>
           <Card.Text as="h3">
              ${product.price}
           </Card.Text>
           </Card.Body>
     </Card>
   )
 }
 
 export default Product 
 */
 //import { Link } from 'react-router-dom';

 function Product({ product }) {
   return (
     <Card className='my-3 p-3 rounded'>
       <Link to={`/product/${product._id}`}>
         <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
           <Card.Img src={product.image} style={{ height: '100%', width: 'auto' }} />
         </div>
         <Card.Body>
           <Card.Title as='div'>
             <strong>{product.name}</strong>
           </Card.Title>
           <Card.Text as='div'>
             <div className='my-3'>
               <Rating value={product.rating} color="cyan"/>
             </div>
           </Card.Text>
           <Card.Text as='h3'>${product.price}</Card.Text>
         </Card.Body>
       </Link>
     </Card>
   );
 }
 
 export default Product;
 