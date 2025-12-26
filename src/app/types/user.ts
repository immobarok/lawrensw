// File: types/user.ts
export interface UserProfileData {
  address?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  phone?: string;
}

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    google_id: string | null;
    avatar: string | null;
    name: string;
    username: string;
    email: string;
    email_verified_at: string;
    status: string;
    is_admin: number;
    date_of_birth: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    zipcode: string | null;
    country: string | null;
    otp: string | null;
    otp_expired_at: string | null;
    otp_verified_at: string | null;
    password_reset_token: string | null;
    password_reset_token_expires_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}
