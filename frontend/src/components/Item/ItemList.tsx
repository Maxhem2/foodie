import { Box, Center, Container, Flex, Spinner, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateItemModal } from "./AddUpdateItemModal";
import { ItemCard } from "./ItemCard";
import DropdownFilter from "../Drowdown/DropdownFilter";
import format from "date-fns/format";
import { ItemSchema } from "types";
import { useMountEffect } from "hooks";

type DateRange = {
    start: Date,
    end: Date
}

export const ItemList = () => {
    const [items, setItems] = useState<Array<ItemSchema>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [date, setDate] = useState<DateRange | undefined>();

    useMountEffect(() => {
        fetchItems();
    });

    const fetchItems = () => {
        setLoading(true);
        axiosInstance
            .get("/item/")
            .then((res) => {
                setItems(res.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const filterEntries = (start: Date, end: Date) => {
        setDate({ start, end });
    };

    return (
        <Container mt={9}>
            <Flex gap={2}>
                <AddUpdateItemModal editable={false} defaultValues={undefined} onSuccess={fetchItems} />
                <DropdownFilter filter={filterEntries} />
            </Flex>
            {date !== undefined && date.start !== undefined && date.end !== undefined ? (
                <Tag mt={3} size={"lg"} borderRadius={"full"} colorScheme="messenger">
                    <TagLabel>
                        {`${format(new Date(date.start), "dd-MM-yyyy")} - ${format(new Date(date.end), "dd-MM-yyyy")}`}
                    </TagLabel>
                    <TagCloseButton onClick={() => setDate(undefined)} />
                </Tag>
            ) : null}
            {loading ? (
                <Center mt={6}>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="orange.200" color="orange.500" size="xl" />
                </Center>
            ) : (
                <Box mt={6}>
                    {items
                        ?.filter((item: ItemSchema) =>
                            date !== undefined && date.start !== undefined && date.end !== undefined
                                ? new Date(item.expireDate) >= date.start && new Date(item.expireDate) < date.end
                                : item
                        )
                        .sort((a, b) => (a.expireDate > b.expireDate ? 1 : -1))
                        .map((item: ItemSchema) => (
                            <ItemCard item={item} key={item.item_id} />
                        ))}
                </Box>
            )}
        </Container>
    );
};
