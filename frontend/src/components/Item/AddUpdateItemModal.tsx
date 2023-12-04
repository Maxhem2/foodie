import { Box, Button, Modal, ModalOverlay, useDisclosure, ModalContent } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ItemForm } from "./ItemForm";
import { BarcodeReader } from "../BarcodeReader/BarcodeReader";
import { FoodBlogEntryType, Item } from "types";
import { Result } from "@zxing/library";

enum ViewMode {
    None,
    Camera,
    Form,
    CameraForm,
}

type AddUpdateItemModalProps = {
    editable: boolean,
    defaultValues: Item | undefined,
    onSuccess: () => void,
}

export const AddUpdateItemModal = (props: AddUpdateItemModalProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.None);
    const [barcode, setBarcode] = useState<Result>();
    const [foodEntry, setFoodEntry] = useState<FoodBlogEntryType>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const foodEntryValues: Item | undefined = useMemo(() => {
        if (foodEntry !== undefined) {
            return {
                title: foodEntry.product.product_name,
                description: foodEntry.product._keywords.join(",\n"),
            } as Item;
        }
    }, [foodEntry]);

    const cameraBarcodeFound = (barcode: Result) => {
        setBarcode(barcode);
    };

    useEffect(() => {
        if (barcode) {
            (async () => {
                await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode.getText()}.json`)
                    .then((res) => res.json())
                    .then((res) => setFoodEntry(res));
            })();
        }
    }, [barcode]);

    useEffect(() => {
        if (!isOpen) setViewMode(ViewMode.None);
    }, [isOpen]);

    useEffect(() => {
        if (foodEntry !== undefined) {
            setViewMode(ViewMode.CameraForm);
        }
    }, [foodEntry]);

    return (
        <Box w={props.editable ? "100%" : "90%"}>
            <Button w="100%" colorScheme="blue" onClick={onOpen}>
                {props.editable ? "UPDATE ITEM" : "ADD ITEM"}
            </Button>
            <Modal closeOnOverlayClick={true} size="xl" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    {viewMode === ViewMode.Form ? (
                        <ItemForm
                            editable={props.editable}
                            camera="close"
                            defaultValues={props.defaultValues}
                            onClose={() => onClose()}
                            onSuccess={() => props.onSuccess()}
                        />
                    ) : viewMode === ViewMode.Camera ? (
                        <BarcodeReader onResult={(data: Result) => cameraBarcodeFound(data)} />
                    ) : viewMode === ViewMode.CameraForm ? (
                        <ItemForm
                            editable={props.editable}
                            camera="open"
                            defaultValues={foodEntryValues}
                            onClose={() => onClose()}
                            onSuccess={() => props.onSuccess()}
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
