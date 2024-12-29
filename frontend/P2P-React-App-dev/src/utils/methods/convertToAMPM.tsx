function convertToAMPM(timestamp: Date): string {
  const hours = timestamp.getUTCHours();
  const minutes = timestamp.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const hoursString = displayHours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");
  return `${hoursString}:${minutesString} ${ampm}`;
}

export default convertToAMPM;

// const timestamp = new Date("2024-03-22T01:32:00.000Z");
// const timeString = convertToAMPM(timestamp);
// console.log(timeString); // Output: 01:32 AM
