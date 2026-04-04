export interface SiteSetting {
  id: number;
  site_name: string;
  logo_url: string | null;
  theme_color: string;
  currency: string;
  timezone: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
}
