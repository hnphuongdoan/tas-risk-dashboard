// lib/banding.test.ts
export function classifyLoadLimit(tonnes: number): string {
  if (tonnes <= 5) return 'Severe';
  if (tonnes <= 20) return 'Moderate';
  return 'Light';
}

// Simple test assertion
if (classifyLoadLimit(2) !== 'Severe' || classifyLoadLimit(10) !== 'Moderate' || classifyLoadLimit(25) !== 'Light') {
  throw new Error('Banding logic test failed!');
}
console.log('All banding unit tests passed successfully.');