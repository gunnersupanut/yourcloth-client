export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string | null;
  surname: string | null;
  tel: string | null;
  is_active: boolean;
  is_verify: boolean;
  created_at: string;
  last_login: string | null;
}
export interface UserResponse {
  success: boolean;
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}