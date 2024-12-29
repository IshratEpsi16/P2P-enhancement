

const  encodeAndSaveToLocalStorage=(key:string, value:string)=> {
    try {
        // Encode the string to base64
        const encodedValue = btoa(value);
        console.log('encodeed value:',encodedValue);
        
        
        // Save the encoded value to localStorage
        localStorage.setItem(key, encodedValue);
        
        console.log(`String encoded and saved with key: ${key}`);
      } catch (error) {
        console.error('Error encoding and saving to localStorage:', error);
      }
  }

  export default encodeAndSaveToLocalStorage;


//   // Example usage:
// const myKey = 'myData';
// const myString = 'Hello, World!';

// // Encode and save to localStorage
// encodeAndSaveToLocalStorage(myKey, myString);