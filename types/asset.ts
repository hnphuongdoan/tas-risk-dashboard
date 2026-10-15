export interface Asset {
  Bridge_Number?: string;
  Bridge_Name?: string;
  Road_Name?: string;
  Asset_Owner?: string;
  Load_Limit_Band?: string;
  Load_Limit_t?: number;
  Load_Limit_Tonnes?: number;
  Notes?: string;
  Latitude?: number | string;
  Longitude?: number | string;
  [key: string]: any; // Allows any additional properties from raw layers without type errors
}