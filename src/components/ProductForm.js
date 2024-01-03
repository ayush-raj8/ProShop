// ProductForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config'; // Adjust the path
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import TextEditor from './TextEditor';
import './ImgUpload.css';
import { STORAGES } from '../const';


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
      console.log("deletion done..")
      // Upload the new file
      if(file && file.name){
      const fileRef = ref(storage, `${folderPath}/${file.name}`);
      await uploadBytes(fileRef, file);
  
      // Get the updated download URL for the uploaded image
      const imageUrl = await getDownloadURL(fileRef);
  
      // Return the profile picture URL
      return imageUrl;
    }
    } catch (error) {
      console.error('Error handling profile picture:', error);
      throw error; // Propagate the error up
    }
  };

function ProductForm({ productId, onUpdate,update=false,product }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState('');
  const [description, setDescription] = useState('');
  const [genre,setGenre] = useState('');
  const [price, setPrice] = useState(0);
  const [publishedYear, setPublishedYear] = useState(''); 
  const [publisher, setPublisher] = useState(''); 
  const [pageCount, setPageCount] = useState(''); 
  const [isbn, setISBN] = useState(''); 
  const [currency, setCurrency] = useState('$'); 
  const [imgFile, setImgFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setAuthors(product.authors || '');
      setDescription(product.description || '');
      setPrice(product.price || 0);
      setGenre(product.genre || '')
      setPublishedYear(product.publishedYear || ''); // Set default value for the new field
      setPageCount(product.pageCount || ''); // Set default value for the new field
      setISBN(product.isbn || ''); // Set default value for the new field
      setCurrency(product.currency || '$'); 
      setPublisher(product.publisher || '');
    }
  }, [product]);

    useEffect(() => {
      if(update){
      setImg()}
    },[productId]);

      const setImg = async (e) => {
        const folderPath = `${STORAGES.PRODUCTIMAGES}/${productId}/`;
        const storageRef = ref(storage, folderPath);
        const items = await listAll(storageRef);

        if (items.items.length > 0) {
          const imageUrl = await getDownloadURL(items.items[0]);
          setPreviewImage(imageUrl);
        } else {
          console.log('No files found in the folder:', folderPath);
          setPreviewImage(null);
        }

      }


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
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    let docRef;

    if (productId) {
      await updateDoc(doc(db, 'PRODUCTS', productId), {
        name,
        authors,
        description,
        price,
        genre,
        publishedYear,
        pageCount,
        isbn,
        createdBy: currentUser.uid,
        publisher,
        currency,
      });
      onUpdate();
    } else {
      docRef = await addDoc(collection(db, 'PRODUCTS'), {
        name,
        authors,
        description,
        price,
        genre,
        publishedYear,
        pageCount,
        isbn,
        createdBy: currentUser.uid,
        publisher,
        currency,
      });
    }
    
    if (imgFile && docRef && docRef.id) {
      const imageUrl = await handleProfilePictureChange(imgFile, docRef.id);
      console.log('Profile picture uploaded:', imageUrl);
      alert('Uploaded');
      clearImg()
    } else if (imgFile && productId) {
      const imageUrl = await handleProfilePictureChange(imgFile, productId);
      console.log('Profile picture uploaded updated:', imageUrl);
      alert('Uploaded for update');
      clearImg()
    } else if (productId){
      const imageUrl = await handleProfilePictureChange(imgFile, productId);
      console.log('Profile picture uploaded updated:', imageUrl);
      alert('Delted for update');
      clearImg()
    }
    clearFields()
  
  };
  
  function clearFields(){
      setName( '');
      setAuthors( '');
      setDescription( '');
      setPrice( 0);
      setGenre( '')
      setPublishedYear( ''); 
      setPageCount( ''); 
      setISBN( ''); 
      setCurrency( '$'); 
      setPublisher( '');
  }

  const clearImg = async (e) => {
    setImgFile(null)
    setPreviewImage(null)
  }
  const cardClass = `mb-2 ${isDarkModeOn ? 'product-card-img-upload product-card-img-upload-dark' : 'product-card-img-upload product-card-img-upload-light'}`;
  
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
          required
        />
      </Form.Group>
      <Row>
        <Col>
          <Form.Group controlId="productAuthor" >
            <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black'}}>Product Author</Form.Label>
            <Form.Control
            style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
              type="text"
              placeholder="Enter names of Authors"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="productPublisher" >
          <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black'}}>Product publisher</Form.Label>
          <Form.Control
          style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
            type="text"
            placeholder="Enter names of publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
          </Form.Group>
        </Col>
        </Row>
      <Form.Group controlId="productGenre" >
        <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black'}}>Product Genre</Form.Label>
        <Form.Control
        style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
          type="text"
          placeholder="Enter genre of ebook"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="productDescription" >
        <Form.Label style={{ color: 'white'}}>Product Description</Form.Label>
        <TextEditor editorValue={description} setEditorValue={setDescription}></TextEditor>
      </Form.Group>
      <Row>
        <Col  >
        <Form.Group controlId="productCurrency">
        <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black' }}>Currency</Form.Label>
        <Form.Control
          as="select"
          style={{ backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black' }}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option value="$">($) USD</option>
          <option value="€"> (€) Euro</option>
          <option value="¥"> (¥) Yen</option>
          <option value="₹"> (₹) Indian Rupee</option>
        </Form.Control>
        </Form.Group>
        </Col>
        <Col  >
        <Form.Group controlId="productPrice" >
          <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black'}}>Product Price</Form.Label>
          <Form.Control
          style={{backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black'}}
            type="number"
            placeholder="Enter price of product"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        </Col>
        <Col  >
        <Form.Group controlId="productPublishedYear">
          <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black' }}>Published Year</Form.Label>
          <Form.Control
            style={{ backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black' }}
            type="number"
            placeholder="Enter published year"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </Form.Group>
        </Col>
        <Col  >
        <Form.Group controlId="productPageCount">
          <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black' }}>Page Count</Form.Label>
          <Form.Control
            style={{ backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black' }}
            type="number"
            placeholder="Enter page count"
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
          />
        </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="productISBN">
        <Form.Label style={{ color: isDarkModeOn ? 'white' : 'black' }}>ISBN (13 digit number only)</Form.Label>
        <Form.Control
          style={{ backgroundColor: isDarkModeOn ? 'gray' : 'white', color: isDarkModeOn ? 'white' : 'black' }}
          type="number"
          placeholder="Enter ISBN"
          value={isbn}
          onChange={(e) => setISBN(e.target.value)}
          required
        />
      </Form.Group>

       <br></br>
       <br></br>
          <Card
          className={cardClass}
            style={{
              backgroundColor: isDarkModeOn ? 'gray' : 'white',
              color: isDarkModeOn ? 'white' : 'black',
            }}
          >
          <Card.Header style={{ marginTop: '10px', maxWidth: '40rem', minWidth: '40rem' }}>
            {(previewImage || imgFile )&& (
              <Card.Img
                src={previewImage || imgFile}
                alt="Product Preview"
                style={{ marginTop: '10px', maxWidth: '100%' }}
              />
            )}
            </Card.Header>
            <Card.Body>
            <input type="file" onChange={handleImageChange} />
            <btn onClick={clearImg}>❌</btn>
            </Card.Body>
          </Card>

      <Button variant="primary" type="submit">
        {productId ? 'Update Product' : 'Create Product'}
      </Button>
    </Form>
  );
}

export default ProductForm;
