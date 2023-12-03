import { Box, Center, Container, Flex, Spinner, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateItemModal } from "./AddUpdateItemModal";
import { ItemCard } from "./ItemCard";
import DropdownFilter from "../Drowdown/DropdownFilter";
import format from "date-fns/format";

export const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState();
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        fetchItems();
        isMounted.current = true;
    }, []);

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

    const filterEntries = (start, end) => {
        setDate({ start, end });
    };

    return (
        <Container mt={9}>
            <Flex gap={2}>
                <AddUpdateItemModal onSuccess={fetchItems} />
                <DropdownFilter filter={filterEntries} />
            </Flex>
            {date !== undefined && date.start !== undefined && date.end !== undefined ? (
                <Tag mt={3} size={"lg"} borderRadius={"full"} colorScheme="messenger">
                    <TagLabel>
                        {`${format(new Date(date.start), "dd-MM-yyyy")} - ${format(new Date(date.end), "dd-MM-yyyy")}`}
                    </TagLabel>
                    <TagCloseButton onClick={() => setDate(undefined)}/>
                </Tag>
            ) : null}
            {loading ? (
                <Center mt={6}>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="orange.200" color="orange.500" size="xl" />
                </Center>
            ) : (
                <Box mt={6}>
                    {items
                        ?.filter((item) =>
                            date !== undefined && date.start !== undefined && date.end !== undefined
                                ? new Date(item.expireDate) >= date.start && new Date(item.expireDate) < date.end
                                : item
                        )
                        .sort((a, b) => (a.expireDate > b.expireDate ? 1 : -1))
                        .map((item) => (
                            <ItemCard item={item} key={item.item_id} />
                        ))}
                </Box>
            )}
        </Container>
    );
};
