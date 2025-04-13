
import React from 'react';
import { useQRScanner } from '../hooks/useQRScanner';
import QRCodeScannerUI from './QRCodeScannerUI';

interface QRCodeScannerProps {
  onScanSuccess: (decodedData: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess, 
  onClose 
}) => {
  const qrReaderId = "qr-reader-container";
  
  const {
    error,
    scanning,
    qrContainerRef,
    startScanning,
    stopScanning
  } = useQRScanner({
    onScanSuccess,
    qrReaderId
  });

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <QRCodeScannerUI
      scanning={scanning}
      error={error}
      qrReaderId={qrReaderId}
      qrContainerRef={qrContainerRef}
      onStartScanning={startScanning}
      onStopScanning={stopScanning}
      onClose={handleClose}
    />
  );
};

export default QRCodeScanner;
