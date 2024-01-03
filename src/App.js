import {Container} from 'react-bootstrap'
import Header  from './components/Header'
import Footer  from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen  from './screens/ProductScreen'
import {BrowserRouter as Router, Routes,Route,HashRouter  } from  'react-router-dom'
import SearchScreen from "./screens/SearchScreen";
import React, {useEffect} from 'react'
import { selectDarkModeStatus } from './redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';
import ColouredLines from './utils/ColouredLines'
import LoginPage from './screens/LoginPage'
import LoggedIn from './screens/LoggedIn'
import { auth } from './config';
import Profile from './screens/Profile'
import Seller from './screens/Seller'
import ProtectedRoute from './utils/ProtectedRoute'
import Cart from './screens/Cart'
import Orders from './screens/Orders'
import TextEditor from './components/TextEditor'

function App() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  
  return (
    <HashRouter >
      <Header />
      <main className='py-3' style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>
        <Container >
          <Routes>
            <Route path='/' element= {<HomeScreen/>} exact/>
            <Route path='/product/:id' element= {<ProductScreen/>}  />
            <Route path='/login' element= {<LoginPage/>}  />
            <Route path="/search/:searchQuery" element={<SearchScreen />} /> 
            <Route path="/loginLink" element={<LoggedIn />} /> 
            <Route path='/editor' element={<TextEditor/>}/>
            <Route element={<ProtectedRoute />}>
              <Route path='/seller' element={<Seller/>}/>
              <Route path='/cart' element={<Cart/>}/>
              <Route path='/orders' element={<Orders/>}/>
              <Route path='/profile' element= {<Profile/>}  />
            </Route>
          </Routes>
        </Container>
      </main> 
      <ColouredLines color={isDarkModeOn ? '#808080' : 'black'} backgroundColor={isDarkModeOn ? 'black' : 'white'} />
      <Footer />
    </HashRouter>
  );
}

export default App;
