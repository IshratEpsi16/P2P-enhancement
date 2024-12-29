function convertToDhakaTime(timestamp: string): string {
  const utcDate = new Date(timestamp);

  // Adjust for Dhaka time offset (UTC+6 hours)
  utcDate.setHours(utcDate.getHours() + 6);

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Dhaka",
  };

  return utcDate.toLocaleString("en-US", options);
}

export default convertToDhakaTime;
