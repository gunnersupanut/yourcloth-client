export const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    // บวก 7 ชั่วโมงเข้าไปตรงๆ เลย (หน่วย Milliseconds)
    // 7 ชม. * 60 นาที * 60 วินาที * 1000 มิลลิวินาที
    const thaiDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    return thaiDate.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};