export const formatDate = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // const thaiDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  // ใช้อันนี้แทน ใส่ options timeZone เข้าไป จบ!
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok", 
  });
};