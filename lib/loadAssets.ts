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

  // Map raw CSV rows to match the Asset interface
  const assets: Asset[] = (parsed.data as any[]).map((row) => {
    const asset: Asset = {
      Object: row['Object'] || '',
      Bridge_Number: row['Bridge Number'] || '',
      Bridge_Name: row['Bridge Name'] || '',
      Road_Name: row['Road Name'] || '',
      Asset_Owner: row['Asset Owner'] || '',
      Load_Limit_t: Number(row['Load Limit (t)'] || 0),
      Load_Limit_Description: row['Load Limit Description'] || '',
      Longitude: Number(row['Longitude'] || 0),
      Latitude: Number(row['Latitude'] || 0),
      Load_Limit_Band: row['Load Limit Band'] || 'Moderate',
    };

    return {
      ...asset,
      riskScore: calculateRiskScore(asset),
    };
  });

  // Sort by risk score descending (Risk-ranked)
  return assets.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
}