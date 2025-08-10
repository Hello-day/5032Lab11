<template>
  <div>
    <h1>Add Book</h1>
    <form @submit.prevent="addBook">
      <div>
        <label for="isbn">ISBN:</label>
        <input 
          type="text" 
          v-model="isbn" 
          id="isbn" 
          required
        />
      </div>
      <div>
        <label for="name">Name:</label>
        <input 
          type="text" 
          v-model="name" 
          id="name" 
          required
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtKW8mQDs-IVCvvL5XtTo5BncSyLRWny0",
  authDomain: "week7-xindi.firebaseapp.com",
  projectId: "week7-xindi",
  storageBucket: "week7-xindi.firebasestorage.app",
  messagingSenderId: "148164494070",
  appId: "1:148164494070:web:ee6e4014751d73b51c62d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');

    const addBook = async () => {
      try {
        // Convert ISBN to number
        const isbnNumber = Number(isbn.value);
        
        // Validate that ISBN is a valid number
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        // Add document to "books" collection
        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value
        });

        // Reset form fields
        isbn.value = '';
        name.value = '';
        
        alert('Book added successfully!');
      } catch (error) {
        console.error('Error adding book: ', error);
      }
    };

    return {
      isbn,
      name,
      addBook
    };
  }
};
</script>

<style scoped>
div {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  transform: translateY(1px);
}
</style>
