import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

type BarcodeReaderProps = {
  onResult: (data: Result) => void;
};

export const BarcodeReader = (props: BarcodeReaderProps) => {
  // Referenz zum Video-Element
  const videoRef = useRef(null);

  // State für die gescannten Barcode-Daten
  const [barcodeData, setBarcodeData] = useState<Result>();

  // Ref für den Barcode-Reader
  const reader = useRef(new BrowserMultiFormatReader());

  // Effekt, der beim Mounten oder wenn sich barcodeData ändert, ausgeführt wird
  useEffect(() => {
    // Wenn barcodeData nicht vorhanden ist, führe den Scanner aus
    if (!barcodeData) {
      // Überprüfe, ob das Video-Element vorhanden ist
      if (!videoRef.current) return;

      // Aktuelle Barcode-Reader-Instanz
      const currentReader = reader.current;

      // Barcode des Geräts decodieren
      currentReader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: "environment", // Verwende die rückseitige Kamera (falls vorhanden)
          },
        },
        videoRef.current, // Video-Element als Scan-Quelle
        (result: Result) => {
          // Wenn ein Ergebnis vorliegt, setze barcodeData mit dem Ergebnis
          if (result) setBarcodeData(result);
        }
      );

      // Cleanup-Funktion: den Barcode-Reader zurücksetzen, wenn das Component unmontiert wird
      return () => {
        currentReader.reset();
      };
    } else {
      // Wenn barcodeData vorhanden ist, rufe die Callback-Funktion des übergeordneten Components auf
      props.onResult(barcodeData);
    }
  }, [barcodeData, props, videoRef]);

  // Video-Element zurückgeben, das als Quelle für den Barcode-Scanner dient
  return <video ref={videoRef} />;
};
