export interface PartnerService {
  id: string;
  service_name: string;
  category: string;
  base_price: number;
  premium_discount: number;
  affiliate_rate: number;
  api_integration: boolean;
  created_at: string;
}
