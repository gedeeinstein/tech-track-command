
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { ScanLine, ScanSearch, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeScannerProps {
  onScanSuccess: (decodedData: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess, 
  onClose 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopScanner();
    };
  }, []);

  // Initialize scanner only when starting
  const initializeScanner = () => {
    try {
      if (scannerRef.current) {
        // Already initialized
        return true;
      }
      
      if (!document.getElementById('qr-reader')) {
        console.error('QR reader element not found');
        return false;
      }
      
      scannerRef.current = new Html5Qrcode('qr-reader');
      return true;
    } catch (err) {
      console.error('Error initializing scanner:', err);
      setError('Failed to initialize camera');
      return false;
    }
  };

  // Safely stop the scanner
  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => {
          console.log('Scanner stopped successfully');
          setScanning(false);
        })
        .catch(err => {
          console.error('Error stopping scanner:', err);
          // Continue despite error - we're cleaning up
        });
    }
  };

  const startScanning = () => {
    setError(null);
    
    if (!initializeScanner()) {
      return;
    }

    setScanning(true);
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    scannerRef.current?.start(
      { facingMode: "environment" }, 
      config,
      (decodedText) => {
        // On successful scan
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Only show critical errors, not per-frame errors
        if (!scanning) {
          setError(errorMessage);
        }
      }
    ).catch(err => {
      console.error('Failed to start scanner:', err);
      setScanning(false);
      setError("Could not access camera: " + err);
      toast({
        title: "Camera Access Error",
        description: "Please ensure you've granted camera permissions",
        variant: "destructive"
      });
    });
  };

  const stopScanning = () => {
    stopScanner();
  };

  const handleScanSuccess = (decodedText: string) => {
    stopScanner();
    try {
      // Validate that it's a valid QR code with our expected format
      JSON.parse(decodedText);
      onScanSuccess(decodedText);
    } catch (e) {
      setError("Invalid QR code format");
      // Restart scanning if the QR code wasn't valid
      startScanning();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between w-full mb-4">
        <h3 className="text-lg font-medium">Scan Asset QR Code</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        id="qr-reader" 
        ref={scannerDivRef}
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
          <Button onClick={startScanning} className="flex items-center gap-2">
            <ScanLine className="h-4 w-4" />
            Start Scanning
          </Button>
        ) : (
          <Button variant="secondary" onClick={stopScanning} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
