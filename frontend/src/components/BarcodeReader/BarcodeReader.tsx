import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

type BarcodeReaderProps = {
    onResult: (data: Result) => void;
}

export const BarcodeReader = (props: BarcodeReaderProps) => {
    const videoRef = useRef(null);
    const [barcodeData, setBarcodeData] = useState<Result>();
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
                (result: Result) => {
                    if (result) setBarcodeData(result);
                    // if (error) console.error(error);
                }
            );
            return () => {
                currentReader.reset();
            };
        } else {
            props.onResult(barcodeData);
        }
    }, [barcodeData, props, videoRef]);

    return <video ref={videoRef} />;
};
