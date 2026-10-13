import { Asset } from '@/types/asset';

export function calculateRiskScore(asset: Asset): number {
  // Risk formula: Condition Score (1-5) multiplied by Criticality Score (1-5)
  return asset.condition_score * asset.criticality_score;
}

