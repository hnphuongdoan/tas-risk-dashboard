import { Asset } from '@/types/asset';

export function calculateRiskScore(asset: Asset): number {
  // Assign risk scores based on the actual Load Limit Band
  // Severe (<= 5t) -> High Risk
  // Moderate (6-20t) -> Medium Risk
  // Light (> 20t) -> Low Risk
  
  const band = (asset.Load_Limit_Band || '').toLowerCase();
  
  if (band.includes('severe')) {
    return 20; // High Risk
  } else if (band.includes('moderate')) {
    return 14; // Medium Risk
  } else if (band.includes('light')) {
    return 8;  // Low Risk
  }
  
  // Fallback calculation based on load limit if the band description is missing
  if (asset.Load_Limit_t <= 5) return 22;
  if (asset.Load_Limit_t <= 15) return 15;
  return 8;
}