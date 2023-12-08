import { Box, Button, Modal, ModalOverlay, useDisclosure, ModalContent, ModalBody } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ItemForm } from "./ItemForm";
import { BarcodeReader } from "../BarcodeReader/BarcodeReader";
import { FoodBlogEntryType, Item } from "types";
import { Result } from "@zxing/library";
import { EditIcon, SearchIcon } from "@chakra-ui/icons";

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

    // Berechnete Werte basierend auf foodEntry
    const foodEntryValues: Item | undefined = useMemo(() => {
        if (foodEntry !== undefined && foodEntry.status !== 0) {
            const title = foodEntry.product.product_name || foodEntry.product.product_name_de;
            const description = foodEntry.product.generic_name_de || foodEntry.product.generic_name || foodEntry.product._keywords.join(',');
            return {
                title: title,
                description: description,
            } as Item;
        }
    }, [foodEntry]);

    const cameraBarcodeFound = (barcode: Result) => {
        setBarcode(barcode);
    };

    //Verarbeitung des Barcodes und der Lebensmittelinformationen
    useEffect(() => {
        if (barcode !== undefined) {
            (async () => {
                await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode.getText()}.json`)
                    .then((res) => res.json())
                    .then((res) => setFoodEntry(res));
            })();
        }
    }, [barcode]);

    //Zurücksetzen des View-Modus und der Lebensmittelinformationen beim Schließen des Modals
    useEffect(() => {
        if (!isOpen) {
            setViewMode(ViewMode.None);
            setFoodEntry(undefined);
        };
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
                    {foodEntry !== undefined && foodEntry.status === 0 ?
                        <ModalBody
                            color={"red"}>
                            Es gibt keinen Eintrag für dieses Produkt
                        </ModalBody>
                        :
                        viewMode === ViewMode.Form ? (
                            // Formularansicht für das Hinzufügen oder Aktualisieren eines Elements
                            <ItemForm
                                editable={props.editable}
                                camera="close"
                                defaultValues={props.defaultValues}
                                onClose={() => onClose()}
                                onSuccess={() => props.onSuccess()}
                            />
                        ) : viewMode === ViewMode.Camera ? (
                            // Barcode-Scanner-Ansicht
                            <BarcodeReader onResult={(data: Result) => cameraBarcodeFound(data)} />
                        ) : viewMode === ViewMode.CameraForm ? (
                            // Kombinierte Ansicht für Barcode-Scanner und Formular
                            <ItemForm
                                editable={props.editable}
                                camera="open"
                                defaultValues={foodEntryValues}
                                onClose={() => onClose()}
                                onSuccess={() => props.onSuccess()}
                                openCamera={() => setViewMode(ViewMode.Camera)}
                            />
                        ) : (
                            // Standardansicht mit Schaltflächen zum Wechseln zwischen Kamera und Formular
                            <div style={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "2rem 1rem"
                            }}>
                                <Button width={"50%"} mr={2} alignItems={"center"} justifyContent={"space-between"} leftIcon={<SearchIcon />} onClick={() => setViewMode(ViewMode.Camera)}>
                                    Camera
                                </Button>
                                <Button width={"50%"} alignItems={"center"} justifyContent={"space-between"} leftIcon={<EditIcon />} onClick={() => setViewMode(ViewMode.Form)}>
                                    Form
                                </Button>
                            </div>
                        )}
                </ModalContent>
            </Modal>
        </Box>
    );
};
