import React from 'react'
import { Row,Col } from 'react-bootstrap'
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';

function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  return (
    
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>
      
        <footer >
          <Row>

            <Col className='text-center py-3'> 
              Copyright &copy; ProShop
             </Col>
           </Row>
        </footer>
    </div>
  )
}

export default Footer
