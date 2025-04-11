
const ROMAN_MONTHS: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII"
};

/**
 * Generates an inventory number based on the specified format
 * IT-FA/KPTM/{AssetType}/{Roman_numerals_Month}/{Year}/{id}
 */
export const generateInventoryNumber = (
  assetType: string,
  id: number,
  date: Date = new Date()
): string => {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const year = date.getFullYear();
  const romanMonth = ROMAN_MONTHS[month];
  
  // Format the asset type to be uppercase and remove spaces
  const formattedAssetType = assetType.toUpperCase().replace(/\s+/g, "");
  
  // Generate the inventory number
  return `IT-FA/KPTM/${formattedAssetType}/${romanMonth}/${year}/${id.toString().padStart(3, '0')}`;
};
