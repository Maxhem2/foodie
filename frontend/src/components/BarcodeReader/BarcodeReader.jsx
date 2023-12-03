import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export const BarcodeReader = ({ onResult = (data) => data, onError = () => {} }) => {
    const videoRef = useRef(null);
    const [barcodeData, setBarcodeData] = useState();
    const reader = useRef(new BrowserMultiFormatReader());

    useEffect(() => {
        if (!barcodeData) {
            if (!videoRef.current) return;
            const currentReader = reader.current;
            currentReader.decodeFromConstraints(
                {
                    audio: false,
                    video: {
                        facingMode: "environment",
                    },
                },
                videoRef.current,
                (result, error) => {
                    if (result) setBarcodeData(result);
                    if (error) console.error(error);
                }
            );
            return () => {
                currentReader.reset();
            };
        } else {
            onResult(barcodeData);
        }
    }, [barcodeData, onResult, videoRef]);

    return <video ref={videoRef} />;
};
