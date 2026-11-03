export type UserRole = 'CONSUMER' | 'MERCHANT';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_code: string;
  description?: string | null;
  category: string;
  is_premium: boolean;
  qris_image_url?: string | null;
  created_at: string;
}

export interface VendorLocation {
  id: string;
  merchant_id: string;
  latitude: number;
  longitude: number;
  is_live: boolean;
  updated_at: string;
  merchant?: Merchant;
}

export interface MenuItem {
  id: string;
  merchant_id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  is_available: boolean;
  created_at: string;
}
