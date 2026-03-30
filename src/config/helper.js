// export function timeAgo(date) {
//   const now = new Date();
//   const past = new Date(date);
//   const secondsAgo = Math.floor((now - past) / 1000);

//   if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
//   const minutesAgo = Math.floor(secondsAgo / 60);
//   if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
//   const hoursAgo = Math.floor(minutesAgo / 60);
//   if (hoursAgo < 24) return `${hoursAgo} hours ago`;
//   const daysAgo = Math.floor(hoursAgo / 24);
//   if (daysAgo < 30) return `${daysAgo} days ago`;
//   const monthsAgo = Math.floor(daysAgo / 30);
//   if (monthsAgo < 12) return `${monthsAgo} months ago`;
//   const yearsAgo = Math.floor(monthsAgo / 12);
//   return `${yearsAgo} years ago`;
// }

// // Example usage
// console.log(timeAgo("2023-12-01T14:00:00Z")); // Output depends on the current time


// ✅ Fixed: handles Java LocalDateTime which Jackson serializes as
// either an ISO string "2024-01-15T14:30:00" OR an array [2024,1,15,14,30,0]
export function timeAgo(date) {
  if (!date) return "";

  let past;

  // Java LocalDateTime can come as array [year, month, day, hour, min, sec, nano]
  if (Array.isArray(date)) {
    const [year, month, day, hour = 0, min = 0, sec = 0] = date;
    past = new Date(year, month - 1, day, hour, min, sec);
  } else {
    past = new Date(date);
  }

  if (isNaN(past.getTime())) return "";

  const now = new Date();
  const secondsAgo = Math.floor((now - past) / 1000);

  if (secondsAgo < 5)  return "just now";
  if (secondsAgo < 60) return `${secondsAgo}s ago`;

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo}d ago`;

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) return `${monthsAgo}mo ago`;

  return `${Math.floor(monthsAgo / 12)}y ago`;
}