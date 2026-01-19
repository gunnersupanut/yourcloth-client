export const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) { 
        case "PENDING":
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "INSPECTING":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "PACKING": // เผื่อมี
            return "bg-indigo-100 text-indigo-700 border-indigo-200";
        case "SHIPPING":
            return "bg-purple-100 text-purple-700 border-purple-200";
        case "COMPLETE":
            return "bg-green-100 text-green-700 border-green-200";
        case "CANCEL":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};