
/**
 * Utility functions for QR code scanning operations
 */

import { ScannedAsset } from "../types";

/**
 * Validates if a scanned QR code contains valid JSON data
 * with the expected structure for an asset
 */
export const validateAssetQRCode = (qrData: string): boolean => {
  try {
    const parsed = JSON.parse(qrData);
    return Boolean(parsed.assetId && parsed.inventoryNumber);
  } catch (e) {
    return false;
  }
};

/**
 * Extracts asset information from a valid QR code string
 */
export const extractAssetInfo = (qrData: string): ScannedAsset | null => {
  try {
    const parsed = JSON.parse(qrData);
    if (parsed.assetId && parsed.inventoryNumber) {
      return {
        id: parsed.assetId,      // Using assetId as id for consistency
        name: parsed.name || "Unknown Asset", // Adding default name if not provided
        type: parsed.type || "Unknown",       // Adding default type if not provided
        assetId: parsed.assetId,
        inventoryNumber: parsed.inventoryNumber
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};
