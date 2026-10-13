export interface Asset {
  Object: number | string;
  Bridge_Number: string;
  Bridge_Name: string;
  Road_Name: string;
  Asset_Owner: string;
  Load_Limit_t: number;
  Load_Limit_Description?: string;
  Longitude: number;
  Latitude: number;
  Load_Limit_Band: string;
  riskScore?: number; // Additional calculated risk score
}