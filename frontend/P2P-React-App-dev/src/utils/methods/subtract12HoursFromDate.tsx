function subtract12HoursFromDate(dateString: string): Date {
  const date = new Date(dateString);
  // Subtract 12 hours
  date.setHours(date.getHours() - 12);
  return date;
}

// const originalDate = "2024-04-26T00:30:00.000Z";
// const resultDate = subtract12HoursFromDate(originalDate);
// console.log(resultDate.toISOString()); // Output the result in ISO format

// const originalDate = "2024-04-26T00:30:00.000Z";
// const resultDate = subtract12HoursFromDate(originalDate);
// console.log(resultDate.toISOString()); // Output the result in ISO format

export default subtract12HoursFromDate;
