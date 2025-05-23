
// const ROMAN_MONTHS: Record<number, string> = {
//   1: "I",
//   2: "II",
//   3: "III",
//   4: "IV",
//   5: "V",
//   6: "VI",
//   7: "VII",
//   8: "VIII",
//   9: "IX",
//   10: "X",
//   11: "XI",
//   12: "XII"
// };

// /**
//  * Generates an inventory number based on the specified format
//  * IT-FA/KPTM/{AssetType}/{Roman_numerals_Month}/{Year}/{DepartmentCode}/{id}
//  */
// export const generateInventoryNumber = async (
//   assetType: string,
//   departmentCode: string
// ): Promise<string> => {
//   const date = new Date();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   const romanMonth = ROMAN_MONTHS[month];
  
//   // Format the asset type to be uppercase and remove spaces
//   const formattedAssetType = assetType.toUpperCase().replace(/\s+/g, "");
  
//   // Generate a random 3-digit number for the sequential ID
//   const sequentialId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
//   // Generate the inventory number with full year and department code
//   return `IT-FA/KPTM/${formattedAssetType}/${romanMonth}/${year}/${departmentCode}/${sequentialId}`;
// };

// /**
//  * Creates a QR code data content for an asset
//  * The format includes the inventory number and asset ID
//  */
// export const generateQRCodeData = (
//   inventoryNumber: string,
//   assetId: string
// ): string => {
//   return JSON.stringify({
//     inventoryNumber,
//     assetId,
//     timestamp: new Date().toISOString()
//   });
// };




import { supabase } from "@/integrations/supabase/client";

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
 * IT-FA/KPTM/{AssetType}/{Roman_numerals_Month}/{Year}/{DepartmentCode}/{id}
 */
export const generateInventoryNumber = async (
  assetType: string,
  departmentId: string
): Promise<string> => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const romanMonth = ROMAN_MONTHS[month];
  
  // Format the asset type to be uppercase and remove spaces
  const formattedAssetType = assetType.toUpperCase().replace(/\s+/g, "");
  
  console.log("Getting department code for ID:", departmentId);
  
  // Get the department code from the departments table
  const { data: departmentData, error } = await supabase
    .from("departments")
    .select("code")
    .eq("id", departmentId)
    .single();
  
  if (error) {
    console.error("Error getting department code:", error);
  }
    
  // Use department code from the database or "GEN" as fallback
  const departmentCode = departmentData?.code || "GEN";
  
  console.log("Using department code:", departmentCode);
  
  // Generate a random 3-digit number for the sequential ID
  const sequentialId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Generate the inventory number with full year and department code
  return `IT-FA/KPTM/${formattedAssetType}/${romanMonth}/${year}/${departmentCode}/${sequentialId}`;
};

/**
 * Creates a QR code data content for an asset
 * The format includes the inventory number and asset ID
 */
export const generateQRCodeData = (
  inventoryNumber: string,
  assetId: string
): string => {
  return JSON.stringify({
    inventoryNumber,
    assetId,
    timestamp: new Date().toISOString()
  });
};
