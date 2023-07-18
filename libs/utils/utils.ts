export function roundTo2Decimals(str: any) {
  const num = parseFloat(str);

  return Math.round(num * 100) / 100;
}
