export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  condition_score: number;
  criticality_score: number;
  replacement_cost_m: number;
  latitude: number;
  longitude: number;
  riskScore?: number;
}