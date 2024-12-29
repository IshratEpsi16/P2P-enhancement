// function formatTimestampTo24Hour(timestamp: string): string {
//   const date = new Date(timestamp);

//   const hours = String(date.getUTCHours()).padStart(2, "0");
//   const minutes = String(date.getUTCMinutes()).padStart(2, "0");
//   const seconds = String(date.getUTCSeconds()).padStart(2, "0");

//   return `${hours}:${minutes}:${seconds}`;
// }

// export default formatTimestampTo24Hour;

// const timestamp = "2024-03-22T01:32:00.000Z";
// const formattedTime = formatTimestampTo24Hour(timestamp);
// console.log(formattedTime); // Output: 13:32:00

function formatTimestampTo24Hour(timestamp: string): string {
  // Convert timestamp to milliseconds
  const timestampMs = Date.parse(timestamp);

  // Subtract 6 hours (6 * 60 * 60 * 1000 milliseconds)
  const newTimestampMs = timestampMs - 12 * 60 * 60 * 1000;

  // Create a new Date object with the adjusted timestamp
  const date = new Date(newTimestampMs);

  // Get hours, minutes, and seconds from the adjusted date
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  // Format and return the time string
  return `${hours}:${minutes}:${seconds}`;
}

export default formatTimestampTo24Hour;
