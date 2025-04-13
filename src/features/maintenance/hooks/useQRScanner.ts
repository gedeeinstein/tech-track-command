
import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';

interface UseQRScannerProps {
  onScanSuccess: (decodedData: string) => void;
  qrReaderId: string;
}

export const useQRScanner = ({ onScanSuccess, qrReaderId }: UseQRScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Clean up on unmount - make sure scanner is fully stopped
  useEffect(() => {
    return () => {
      stopScanningAndCleanup();
    };
  }, []);

  const stopScanningAndCleanup = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(err => {
            console.error('Error stopping scanner during cleanup:', err);
          });
        }
      } catch (err) {
        console.error('Error during scanner cleanup:', err);
      }
      scannerRef.current = null;
    }
  };

  const initializeScanner = () => {
    try {
      // First clean up any existing instance
      stopScanningAndCleanup();
      
      if (!qrContainerRef.current) {
        console.error('QR container ref not found');
        return false;
      }
      
      // Make sure container is empty before initializing new scanner
      // Using the ref for direct DOM manipulation to avoid React conflicts
      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
      }
      
      // Create new scanner instance
      scannerRef.current = new Html5Qrcode(qrReaderId);
      return true;
    } catch (err) {
      console.error('Error initializing scanner:', err);
      setError('Failed to initialize camera');
      return false;
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
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => {
          console.log('Scanner stopped successfully');
          setScanning(false);
        })
        .catch(err => {
          console.error('Error stopping scanner:', err);
          setScanning(false);
        });
    } else {
      setScanning(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    // First stop scanning to release camera
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => {
          processScannedData(decodedText);
        })
        .catch(err => {
          console.error('Error stopping scanner after success:', err);
          // Still try to process the result
          processScannedData(decodedText);
        });
    } else {
      processScannedData(decodedText);
    }
  };

  const processScannedData = (decodedText: string) => {
    try {
      // Validate that it's a valid QR code with our expected format
      JSON.parse(decodedText);
      onScanSuccess(decodedText);
    } catch (e) {
      setError("Invalid QR code format");
      // Restart scanning if the QR code wasn't valid
      setTimeout(() => {
        if (scannerRef.current) startScanning();
      }, 500);
    }
  };

  return {
    error,
    scanning,
    qrContainerRef,
    startScanning,
    stopScanning,
    processScannedData
  };
};
