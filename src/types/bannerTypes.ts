export interface IBanner {
  id: number;
  title?: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

// สำหรับตอนส่งข้อมูลไปสร้างหรือแก้ไข
export interface IBannerPayload {
  title?: string;
  image_url: string; 
  is_active?: boolean;
  sort_order?: number;
  start_date?: string | null;
  end_date?: string | null;
}