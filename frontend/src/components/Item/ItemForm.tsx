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
import { useEffect, useRef, useState } from "react";
import { TagCreationInformation, TagSchema } from "types/tagType";
import { AxiosResponse } from "axios";
import { AutoComplete, AutoCompleteCreatable, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, AutoCompleteTag, useAutoCompleteContext } from "@choc-ui/chakra-autocomplete";
import { AddEntry } from "components/AutoComplete/AddEntry";
import { validateHeaderName } from "http";

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

    const [tagsFetched, setTagsFetched] = useState<Array<TagSchema>>([]);

    const [autoCompleteValue, setAutoCompleteValue] = useState<string>();

    console.log(autoCompleteValue);

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
        (async () => {
            try {
                await axiosInstance.get("tag/list-tags").then((res: AxiosResponse<TagSchema[]>) => {
                    if (res.status === 200 || res.status === 201 || res.data !== undefined) {
                        setTagsFetched(res.data);
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        })();
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

    const fetchTags = async () => {
        try {
            await axiosInstance.get("tag/list-tags").then(res => {
                const data: TagSchema[] = res.data;
                setTagsFetched(data);
                console.log("test");
            });
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log(autoCompleteValue); 
        const tagUUIds = tagsFetched.find((tag) => autoCompleteValue === tag._id)?.tag_id;
        if (tagUUIds) setValue("tag", tagUUIds);
    }, [autoCompleteValue, setValue, tagsFetched]);

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
                <AutoComplete
                    openOnFocus
                    closeOnBlur
                    creatable
                    value={autoCompleteValue}
                    onChange={(newVal) => setAutoCompleteValue(newVal)}
                >
                    <AutoCompleteInput variant="filled">
                        {({ tags }) =>
                            tags.map((tag, tid) => (
                                <AutoCompleteTag
                                    key={tid}
                                    label={tagsFetched.find((f) => f._id === tag.label)?.name ?? ""}
                                    onRemove={tag.onRemove}
                                />
                            ))
                        }
                    </AutoCompleteInput>
                    <AutoCompleteList>
                        {tagsFetched.map((tag, tagId) => (
                            <AutoCompleteItem
                                key={`option-${tagId}`}
                                value={tag}
                                textTransform="capitalize"
                            >
                                {tag.name}
                            </AutoCompleteItem>
                        ))}
                        <AddEntry fetchTags={() => fetchTags()} />
                    </AutoCompleteList>
                </AutoComplete>
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
