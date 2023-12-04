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
import { useEffect } from "react";
import { Item } from "types";

type ItemFormProps = {
    editable: boolean,
    defaultValues: Item | undefined
    onSuccess: () => void,
    onClose: () => void,
} & (OpenCamera | CloseCamera)

type OpenCamera = {
    camera: 'open'
    openCamera: () => void
}
type CloseCamera = {
    camera: 'close'
}

export const ItemForm = (props: ItemFormProps) => {
    const toast = useToast();
    const { itemId } = useParams();
    const {
        handleSubmit,
        register,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: props.defaultValues
    });

    useEffect(() => {
        const formattedDefaultDate = props.defaultValues?.expireDate ? new Date(props.defaultValues.expireDate).toISOString().split("T")[0] : "";

        setValue("expireDate", new Date(formattedDefaultDate));
    }, [props.defaultValues, setValue]);

    const onSubmit = async (values: Item) => {
        try {
            values = { ...values, expireDate: endOfDay(new Date(values.expireDate)) };
            if (props.editable) {
                await axiosInstance.put(`/item/${itemId}`, values);
            } else {
                await axiosInstance.post(`/item/create/`, values);
            }
            toast({
                title: props.editable ? "Item Updated" : "Item Added",
                status: "success",
                isClosable: true,
                duration: 1500,
            });
            props.onSuccess();
            props.onClose();
            reset();
        } catch (err) {
            console.error(err);
            toast({
                title: "Something went wrong. Please try again.",
                status: "error",
                isClosable: true,
                duration: 1500,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{props.editable ? "Update Item" : "ADD ITEM"}</ModalHeader>
            <>
                {props.camera === "open" ? (
                    <Button onClick={() => props.openCamera()}>
                        <RepeatIcon />
                    </Button>
                ) : null}
                <ModalCloseButton />
            </>
            <ModalBody>
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
                <FormControl>
                    <Controller
                        name="expireDate"
                        control={control}
                        defaultValue={props.defaultValues?.expireDate}
                        rules={{
                            required: "This is a required field",
                            validate: (value: Date) =>
                                !props.editable ? (startOfDay(new Date(value)) < startOfDay(new Date()) ? "Date must be atleast today or in future" : true) : true,
                        }}
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    type="date"
                                    placeholder="Expiration date...."
                                    value={field.value.toISOString() || ""}
                                    onChange={(e) => e.target.value}
                                    variant="filled"
                                    size="lg"
                                    mt={6}
                                />
                                {errors.expireDate && <p>{errors.expireDate.message}</p>}{" "}
                            </div>
                        )}
                    />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Stack direction="row" spacing={4}>
                    <Button onClick={() => props.onClose()} disabled={isSubmitting}>
                        Close
                    </Button>
                    <Button colorScheme="blue" type="submit" isLoading={isSubmitting} loadingText={props.editable ? "Updating" : "Creating"}>
                        {props.editable ? "Update" : "Create"}
                    </Button>
                </Stack>
            </ModalFooter>
        </form>
    );
};
