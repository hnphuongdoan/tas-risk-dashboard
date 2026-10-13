import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Asset } from '@/types/asset';
import { calculateRiskScore } from '@/utils/riskCalculator';

export function getAssets(): Asset[] {
  const filePath = path.join(process.cwd(), 'data', 'tasmania_assets.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const assets = (parsed.data as Asset[]).map((asset) => ({
    ...asset,
    riskScore: calculateRiskScore(asset),
  }));

  // Sắp xếp theo rủi ro giảm dần (Risk-ranked)
  return assets.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
}