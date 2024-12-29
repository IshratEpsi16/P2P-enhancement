
// Function to delete a key from localStorage
const  deleteFromLocalStorage=(key:string)=> {
    try {
      // Remove the item from localStorage
      localStorage.removeItem(key);
      
      console.log(`Key deleted: ${key}`);
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  }

  export default deleteFromLocalStorage;


  // Example usage:
// const myKey = 'myData';
// const myString = 'Hello, World!';

// // Encode and save to localStorage
// encodeAndSaveToLocalStorage(myKey, myString);

// // Decode and retrieve from localStorage
// const retrievedString = decodeFromLocalStorage(myKey);

// console.log('Retrieved string:', retrievedString);

// // Delete the key from localStorage
// deleteFromLocalStorage(myKey);