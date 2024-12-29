// function isoToDateTime(isoDateString: string): string {
//     const date = new Date(isoDateString);
//     // Convert to Dhaka time (UTC+6)
//     const dhakaTime = new Date(date.getTime() + (6 * 60 * 60 * 1000));

//     const day = String(dhakaTime.getDate()).padStart(2, '0');
//     const month = String(dhakaTime.getMonth() + 1).padStart(2, '0'); // January is 0!
//     const year = dhakaTime.getFullYear();
//     let hours = dhakaTime.getHours();
//     const minutes = String(dhakaTime.getMinutes()).padStart(2, '0');
//     const period = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // 0 should be considered as 12

//     return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
// }

// export default isoToDateTime;


// dhaka time here 

// function isoToDateTime(isoDateString: string): string {
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const date = new Date(isoDateString);
//   // Convert to Dhaka time (UTC+6)
//   const dhakaTime = new Date(date.getTime() + 6 * 60 * 60 * 1000);

//   const day = String(dhakaTime.getDate()).padStart(2, "0");
//   const monthIndex = dhakaTime.getMonth(); // Month index (0-11)
//   const month = monthNames[monthIndex];
//   const year = dhakaTime.getFullYear();
//   let hours = dhakaTime.getHours();
//   const minutes = String(dhakaTime.getMinutes()).padStart(2, "0");
//   const period = hours >= 12 ? "pm" : "am";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // 0 should be considered as 12

//   return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
// }

function isoToDateTime(isoDateString: string): string {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const date = new Date(isoDateString);

  const day = String(date.getDate()).padStart(2, "0");
  const monthIndex = date.getMonth(); // Month index (0-11)
  const month = monthNames[monthIndex];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be considered as 12

  return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
}


export default isoToDateTime;
