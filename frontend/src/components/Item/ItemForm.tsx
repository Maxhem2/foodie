// Importieren der benötigten Chakra UI-Elemente und -Hooks
import {
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Stack,
    Textarea,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { endOfDay, startOfDay } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { Item } from "types";
import { useMountEffect } from "hooks";

// Typendefinitionen für die Props der ItemForm-Komponente
type ItemFormProps = {
    editable: boolean;
    defaultValues: Item | undefined;
    onSuccess: () => void;
    onClose: () => void;
} & (OpenCamera | CloseCamera);

// Typendefinition für die Props im Zusammenhang mit der Kamera
type OpenCamera = {
    camera: 'open';
    openCamera: () => void;
};
type CloseCamera = {
    camera: 'close';
};

// ItemForm-Komponente
export const ItemForm = (props: ItemFormProps) => {
    // Verwendung von useToast für Benachrichtigungen
    const toast = useToast();
    
    // Extrahieren der Item ID aus den URL-Parametern
    const { itemId } = useParams();

    // Verwendung von react-hook-form für das Formularhandling
    const {
        handleSubmit,
        register,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: props.defaultValues,
    });

    // Effekt beim Mounten der Komponente, um Standardwerte für das Ablaufdatum zu setzen
    useMountEffect(() => {
        const formattedDefaultDate = props.defaultValues?.expireDate
            ? new Date(props.defaultValues.expireDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

        setValue("expireDate", new Date(formattedDefaultDate));
    });

    // Funktion zur Verarbeitung des Formulars beim Absenden + check für Post oder Update
    const onSubmit = async (values: Item) => {
        try {
            values = { ...values, expireDate: endOfDay(new Date(values.expireDate)) };

            // Überprüfen, ob es sich um ein Update oder eine Erstellung handelt
            if (props.editable) {
                await axiosInstance.put(`/item/${itemId}`, values);
            } else {
                await axiosInstance.post(`/item/create/`, values);
            }

            // Erfolgreiche Toast-Benachrichtigung
            toast({
                title: props.editable ? "Item Updated" : "Item Added",
                status: "success",
                isClosable: true,
                duration: 1500,
            });

            // Erfolgreiche Callback-Funktion
            props.onSuccess();

            // Schließen des Modals und Zurücksetzen des Formulars
            props.onClose();
            reset();
        } catch (err) {
            console.error(err);

            // Fehlerhafte Toast-Benachrichtigung
            toast({
                title: "Something went wrong. Please try again.",
                status: "error",
                isClosable: true,
                duration: 1500,
            });
        }
    };

    // JSX-Struktur für die ItemForm-Komponente
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{props.editable ? "Update Item" : "ADD ITEM"}</ModalHeader>
            <>
                {/* Button zum Öffnen der Kamera, wenn erforderlich */}
                {props.camera === "open" ? (
                    <Button onClick={() => props.openCamera()}>
                        <RepeatIcon />
                    </Button>
                ) : null}
                <ModalCloseButton />
            </>
            <ModalBody>
                {/* Formularfeld für den Titel des Elements */}
                <FormControl isInvalid={errors.title !== undefined}>
                    <Input
                        placeholder="Item Title...."
                        background={useColorModeValue("gray.300", "gray.600")}
                        type="text"
                        variant="filled"
                        size="lg"
                        mt={6}
                        {...register("title", {
                            required: "This is a required field",
                            minLength: {
                                value: 5,
                                message: "Title must be at least 5 characters",
                            },
                            maxLength: {
                                value: 55,
                                message: "Title must be limited to 55 characters",
                            },
                        })}
                    />
                    <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                </FormControl>
                {/* Formularfeld für die Beschreibung des Elements */}
                <FormControl isInvalid={errors.description !== undefined}>
                    <Textarea
                        rows={5}
                        placeholder="Add description...."
                        background={useColorModeValue("gray.300", "gray.600")}
                        variant="filled"
                        size="lg"
                        mt={6}
                        {...register("description", {
                            required: "This is a required field",
                            minLength: {
                                value: 5,
                                message: "Description must be at least 5 characters",
                            },
                            maxLength: {
                                value: 200,
                                message: "Description must be limited to 200 characters",
                            },
                        })}
                    />
                    <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                </FormControl>
                {/* Formularfeld für das Ablaufdatum des Elements */}
                <FormControl>
                    <Controller
                        name="expireDate"
                        control={control}
                        defaultValue={
                            props.defaultValues !== undefined && props.defaultValues?.expireDate !== undefined
                                ? new Date(props.defaultValues.expireDate)
                                : new Date()
                        }
                        rules={{
                            required: "This is a required field",
                            validate: (value: Date) =>
                                !props.editable
                                    ? startOfDay(new Date(value)) < startOfDay(new Date())
                                        ? "Date must be atleast today or in future"
                                        : true
                                    : true,
                        }}
                        render={({ field }) => {
                            return (
                                <div>
                                    {/* Eingabefeld für das Ablaufdatum */}
                                    <Input
                                        {...field}
                                        type="date"
                                        placeholder="Expiration date...."
                                        value={
                                            field.value !== undefined && field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            field.onChange(event.target.value)
                                        }
                                        variant="filled"
                                        size="lg"
                                        mt={6}
                                    />
                                    {/* Fehlermeldung für das Ablaufdatum */}
                                    {errors.expireDate && <p>{errors.expireDate.message}</p>}{" "}
                                </div>
                            );
                        }}
                    />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                {/* Stack für "Close" und "Create/Update" Buttons */}
                <Stack direction="row" spacing={4}>
                    {/* Button zum Schließen des Modals */}
                    <Button onClick={() => props.onClose()} disabled={isSubmitting}>
                        Close
                    </Button>
                    {/* Button zum Absenden des Formulars */}
                    <Button colorScheme="blue" type="submit" isLoading={isSubmitting} loadingText={props.editable ? "Updating" : "Creating"}>
                        {props.editable ? "Update" : "Create"}
                    </Button>
                </Stack>
            </ModalFooter>
        </form>
    );
};
