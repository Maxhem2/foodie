import { Box, Button, Modal, ModalOverlay, useDisclosure, ModalContent } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ItemForm } from "./ItemForm";
import { BarcodeReader } from "../BarcodeReader/BarcodeReader";

const ViewMode = {
    None: "none",
    Camera: "camera",
    Form: "Form",
    CameraForm: "CameraForm",
};

export const AddUpdateItemModal = ({ editable = false, defaultValues = {}, onSuccess = () => {}, ...rest }) => {
    const [viewMode, setViewMode] = useState(ViewMode.None);
    const [barcode, setBarcode] = useState();
    const [foodEntry, setFoodEntry] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const foodEntryValues = useMemo(() => {
        if (foodEntry) {
            return { title: foodEntry.product.product_name, description: foodEntry.product._keywords.join(",\n") };
        }
        return {};
    }, [foodEntry]);

    const cameraBarcodeFound = (barcode) => {
        setBarcode(barcode);
    };

    useEffect(() => {
        if (barcode) {
            (async () => {
                await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode.text}.json`)
                    .then((res) => res.json())
                    .then((res) => setFoodEntry(res));
            })();
        }
    }, [barcode]);

    useEffect(() => {
        if (!isOpen) setViewMode(ViewMode.None);
    }, [isOpen]);

    useEffect(() => {
        if (foodEntry) {
            setViewMode(ViewMode.CameraForm);
        }
    }, [foodEntry]);

    return (
        <Box {...rest} w={editable ? "100%" : "90%"}>
            <Button w="100%" colorScheme="blue" onClick={onOpen}>
                {editable ? "UPDATE ITEM" : "ADD ITEM"}
            </Button>
            <Modal closeOnOverlayClick={true} size="xl" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    {viewMode === ViewMode.Form ? (
                        <ItemForm editable={editable} defaultValues={defaultValues} onClose={() => onClose()} onSuccess={() => onSuccess()} />
                    ) : viewMode === ViewMode.Camera ? (
                        <BarcodeReader onResult={(data) => cameraBarcodeFound(data)} />
                    ) : viewMode === ViewMode.CameraForm ? (
                        <ItemForm
                            editable={editable}
                            defaultValues={foodEntryValues}
                            onClose={() => onClose()}
                            onSuccess={() => onSuccess()}
                            openCamera={() => setViewMode(ViewMode.Camera)}
                        />
                    ) : (
                        <>
                            <Button onClick={() => setViewMode(ViewMode.Camera)}>Camera</Button>
                            <Button onClick={() => setViewMode(ViewMode.Form)}>Form</Button>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Box>
    );
};
