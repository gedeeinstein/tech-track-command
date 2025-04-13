
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, ScanSearch, X } from 'lucide-react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface QRCodeScannerUIProps {
  scanning: boolean;
  error: string | null;
  qrReaderId: string;
  qrContainerRef: React.RefObject<HTMLDivElement>;
  onStartScanning: () => void;
  onStopScanning: () => void;
  onClose: () => void;
}

const QRCodeScannerUI: React.FC<QRCodeScannerUIProps> = ({
  scanning,
  error,
  qrReaderId,
  qrContainerRef,
  onStartScanning,
  onStopScanning,
  onClose
}) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <DialogTitle className="sr-only">Scan Asset QR Code</DialogTitle>
      <DialogDescription className="sr-only">Scan a QR code to identify an asset</DialogDescription>
      
      <div className="flex justify-between w-full mb-4">
        <h3 className="text-lg font-medium">Scan Asset QR Code</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        id={qrReaderId}
        ref={qrContainerRef}
        className="w-full max-w-[300px] h-[300px] bg-gray-100 relative rounded overflow-hidden"
      >
        {!scanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <ScanSearch className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        {!scanning ? (
          <Button onClick={onStartScanning} className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            Start Scanning
          </Button>
        ) : (
          <Button variant="secondary" onClick={onStopScanning} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScannerUI;
