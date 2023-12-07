import {
    Box,
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
import { ItemSchema } from "types";
import { useMountEffect } from "hooks";
import { useState } from "react";
import { TagSchema } from "types/tagType";
import { AxiosResponse } from "axios";
import { Autocomplete, Option } from "chakra-ui-simple-autocomplete";

type ItemFormProps = {
    editable: boolean,
    defaultValues: ItemSchema | undefined
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

    const [tag, setTag] = useState<string>();
    const [tags, setTags] = useState<Array<TagSchema>>();
    const [autocompleteOptions, setAutoCompleteOptions] = useState<Array<Option>>([]);
    const [selectedOptions, setSelectedOptions] = useState<Array<Option>>([]);

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

    useMountEffect(() => {
        const formattedDefaultDate = props.defaultValues?.expireDate
            ? new Date(props.defaultValues.expireDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

        setValue("expireDate", new Date(formattedDefaultDate));
        // try {
        //     await axiosInstance.get("/items/list-tags/").then((res: AxiosResponse<TagSchema[]>) => {
        //         if (res.status === 200 || res.status === 201 || res.data !== undefined) {
        //             setTags(res.data);
        //             const items: Array<Option> = res.data.map((item: TagSchema) => {
        //                 return {
        //                     value: item.tag_id,
        //                     label: item.name,
        //                 } as Option;
        //             });
        //             setAutoCompleteOptions(items);
        //         }
        //     });
        // }
        // catch (err) {
        //     console.log(err);
        // }
    });

    const onSubmit = async (values: ItemSchema) => {
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


    const createTag = async () => {
        if (tag !== undefined) {


            await axiosInstance.post("item/create-tag", tag);
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
                <Input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <Button onClick={() => createTag()} />
                <FormControl>
                    <Controller
                        name="expireDate"
                        control={control}
                        defaultValue={props.defaultValues !== undefined && props.defaultValues?.expireDate !== undefined
                            ? new Date(props.defaultValues.expireDate)
                            : new Date()}
                        rules={{
                            required: "This is a required field",
                            validate: (value: Date) =>
                                !props.editable ? (startOfDay(new Date(value)) < startOfDay(new Date()) ? "Date must be atleast today or in future" : true) : true,
                        }}
                        render={({ field }) => {
                            return (
                                <div>
                                    <Input
                                        {...field}
                                        type="date"
                                        placeholder="Expiration date...."
                                        value={field.value !== undefined && field.value instanceof Date ? field.value.toISOString().split("T")[0] : field.value}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value)}
                                        variant="filled"
                                        size="lg"
                                        mt={6}
                                    />
                                    {errors.expireDate && <p>{errors.expireDate.message}</p>}{" "}
                                </div>
                            );
                        }}
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
