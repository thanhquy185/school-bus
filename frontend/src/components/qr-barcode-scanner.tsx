import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";

interface QrBarcodeScannerProps {
  onScan?: (decodedText: string) => void;
}

const QrBarcodeScanner: React.FC<QrBarcodeScannerProps> = ({ onScan }) => {
  const readerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!readerRef.current) return;

    html5QrCodeRef.current = new Html5Qrcode(readerRef.current.id, {
      verbose: false,
    });

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length && html5QrCodeRef.current) {
          const config: Html5QrcodeCameraScanConfig = {
            fps: 10,
            qrbox: 450, // vuông, dễ quét hơn
            aspectRatio: 1.0, // giữ camera không bị giựt
          };

          html5QrCodeRef.current
            .start(
              devices[0].id,
              config,
              (decodedText) => {
                console.log("Scanned result:", decodedText);
                if (onScan) onScan(decodedText);
              },
              (errorMessage) => {
                // Bỏ log, chỉ cần callback nếu muốn xử lý lỗi
              }
            )
            .catch((err) => console.error("QR start failed:", err));
        }
      })
      .catch((err) => console.error("Camera access failed:", err));

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error("QR stop failed:", err));
      }
    };
  }, [onScan]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
        width: "100%",
        height: "100%",
        borderRadius: 8,
      }}
    >
      <div
        id="reader"
        ref={readerRef}
        style={{
          width: 500,
          height: 500,
          background: "transparent",
          borderRadius: 4,
        }}
      />
    </div>
  );
};

export default QrBarcodeScanner;
