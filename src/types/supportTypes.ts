
export interface ISupportTicket {
  id: number;
  user_id: number;
  topic: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  admin_response?: string;
  created_at: string;
  updated_at: string;
  // ข้อมูล User ที่ Join มา (สำหรับ Admin)
  username?: string;
  email?: string;
  tel?: string;
  resolver_name?: string
}

// ข้อมูลที่จะส่งไปสร้าง Ticket (ไม่ต้องส่ง userId เพราะ Backend แกะจาก Token)
export interface ICreateTicketPayload {
  topic: string;
  message: string;
}
