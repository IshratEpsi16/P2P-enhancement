

const decodeFromLocalStorage=(key:string)=> {
    try {
        // Retrieve the encoded value from localStorage
        const encodedValue = localStorage.getItem(key);
        
        if (encodedValue) {
          // Return the encoded value directly
          return encodedValue;
        } else {
          console.log(`No value found for key: ${key}`);
          return null;
        }
      } catch (error) {
        console.error('Error decoding from localStorage:', error);
        return null;
      }
  }

  export default decodeFromLocalStorage;


  // Example usage:
// const myKey = 'myData';
// const myString = 'Hello, World!';

// // Encode and save to localStorage
// encodeAndSaveToLocalStorage(myKey, myString);

// // Decode and retrieve from localStorage
// const retrievedString = decodeFromLocalStorage(myKey);

// console.log('Retrieved string:', retrievedString);