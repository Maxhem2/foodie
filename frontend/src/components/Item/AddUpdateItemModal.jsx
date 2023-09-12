import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Textarea,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { endOfDay, startOfDay } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useEffect } from "react";

export const AddUpdateItemModal = ({ editable = false, defaultValues = {}, onSuccess = () => {}, ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
        defaultValues: { ...defaultValues },
    });

    useEffect(() => {
        const formattedDefaultDate = defaultValues.expireDate ? new Date(defaultValues.expireDate).toISOString().split("T")[0] : "";

        setValue("expireDate", formattedDefaultDate);
    }, [defaultValues.expireDate, setValue]);

    const onSubmit = async (values) => {
        try {
            values = { ...values, expireDate: endOfDay(new Date(values.expireDate)) };
            if (editable) {
                await axiosInstance.put(`/item/${itemId}`, values);
            } else {
                await axiosInstance.post(`/item/create/`, values);
            }
            toast({
                title: editable ? "Item Updated" : "Item Added",
                status: "success",
                isClosable: true,
                diration: 1500,
            });
            onSuccess();
            onClose();
            reset();
        } catch (err) {
            console.error(err);
            toast({
                title: "Something went wrong. Please try again.",
                status: "error",
                isClosable: true,
                diration: 1500,
            });
        }
    };

    return (
        <Box {...rest} w={editable ? "100%" : "90%"}>
            <Button w="100%" colorScheme="blue" onClick={onOpen}>
                {editable ? "UPDATE ITEM" : "ADD ITEM"}
            </Button>
            <Modal closeOnOverlayClick={false} size="xl" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        <ModalHeader>{editable ? "Update Item" : "ADD ITEM"}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isInvalid={errors.title}>
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
                            <FormControl isInvalid={errors.description}>
                                <Textarea
                                    rows={5}
                                    placeholder="Add description...."
                                    background={useColorModeValue("gray.300", "gray.600")}
                                    type="test"
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
                                    defaultValue={defaultValues.expireDate}
                                    rules={{
                                        required: "This is a required field",
                                        validate: (value) => (!editable ? startOfDay(new Date(value)) < startOfDay(new Date()) ? "Date must be atleast or in futrue" : true : true),
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                type="date"
                                                placeholder="Expiration date...."
                                                value={field.value || ""}
                                                onChange={(e) => e.target.value}
                                                variant="filled"
                                                size="lg"
                                                mt={6}
                                                {...field}
                                            />
                                            {errors.expireDate && <p>{errors.expireDate.message}</p>}{" "}
                                        </div>
                                    )}
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Stack direction="row" spacing={4}>
                                <Button onClick={onClose} disabled={isSubmitting}>
                                    Close
                                </Button>
                                <Button colorScheme="blue" type="submit" isLoading={isSubmitting} loadingText={editable ? "Updating" : "Creating"}>
                                    {editable ? "Update" : "Create"}
                                </Button>
                            </Stack>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </Box>
    );
};
