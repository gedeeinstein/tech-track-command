
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Printer } from 'lucide-react';
import { generateQRCodeData } from '../utils/inventoryGenerator';

interface AssetQRCodeProps {
  inventoryNumber: string;
  assetId: string;
  assetName: string;
}

const AssetQRCode: React.FC<AssetQRCodeProps> = ({ 
  inventoryNumber, 
  assetId,
  assetName
}) => {
  const qrCodeData = generateQRCodeData(inventoryNumber, assetId);
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Asset QR Code - ${assetName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .qr-container {
              border: 1px solid #ccc;
              padding: 20px;
              display: inline-block;
              margin-bottom: 20px;
            }
            .asset-details {
              margin-top: 10px;
              text-align: left;
            }
            .inventory-number {
              font-family: monospace;
              font-size: 12px;
              color: #666;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div>
              <img src="${QRCodeSVG({value: qrCodeData, size: 200}).outerHTML}" width="200" height="200" />
            </div>
            <div class="asset-details">
              <h3>${assetName}</h3>
              <div class="inventory-number">${inventoryNumber}</div>
            </div>
          </div>
          <div class="no-print">
            <button onclick="window.print(); setTimeout(window.close, 500);">Print QR Code</button>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="View QR Code">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asset QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-4">
          <QRCodeSVG value={qrCodeData} size={200} />
          <div className="mt-4 text-center">
            <h3 className="font-medium">{assetName}</h3>
            <div className="mt-1 font-mono text-xs text-muted-foreground">
              {inventoryNumber}
            </div>
          </div>
          <Button 
            className="mt-4 flex items-center gap-2" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetQRCode;
