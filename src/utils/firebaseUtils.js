// utils/firebaseUtils.js
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config';
import { getStorage,ref,listAll,getDownloadURL } from "firebase/storage";
import { storage } from '../config';

// Read operation with image URL
export const readDocumentWithImageUrl = async (collectionName, productId) => {
    console.log("Hii ",`${collectionName}/${productId}`)
    const storagePath = `${collectionName}/${productId}`;
    const folderRef = ref(storage,storagePath);
    try {
        const result = await listAll(folderRef);
        if (result.items.length > 0) {
            const firstFileRef = result.items[0];
            const url = await getDownloadURL(firstFileRef);
            console.log('URL:', url);
            return url;
          } else {
            console.log('No files found in the folder.');
            return null;
          }
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

// Read operation
export const readDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
};

// Create or Update operation
export const saveDocument = async (collectionName, documentId, data) => {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data, { merge: true });
    return data;
};

// Update specific fields in a document
export const updateDocumentFields = async (collectionName, documentId, fields) => {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, fields);
    return { id: documentId, ...fields };
};

// Delete operation
export const deleteDocument = async (collectionName, documentId) => {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { id: documentId };
};

// Query operation
export const queryDocuments = async (collectionName, conditions) => {
    const q = query(collection(db, collectionName, conditions));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
