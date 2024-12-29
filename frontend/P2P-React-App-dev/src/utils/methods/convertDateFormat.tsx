

function convertDateFormat(inputDate: string): string {
    // Parse the input date string
    const dateObject = new Date(inputDate);

    // Extract day, month, and year components
    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateObject.getUTCFullYear();

    // Create the desired format
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

export default convertDateFormat;