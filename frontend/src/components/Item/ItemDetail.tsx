import { Button, Center, Container, Spinner, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { AddUpdateItemModal } from "./AddUpdateItemModal";
import { Item } from "types";
import { useMountEffect } from "hooks";

export const ItemDetail = () => {
    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const { itemId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const background = useColorModeValue("gray.300", "gray.600");

    const fetchItem = () => {
        setLoading(true);
        axiosInstance
            .get(`/item/${itemId}`)
            .then((res) => {
                setItem(res.data);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteItem = () => {
        setLoading(true);
        axiosInstance
            .delete(`/item/${itemId}`)
            .then(() => {
                toast({
                    title: "Item deleted successfully",
                    status: "success",
                    isClosable: true,
                    duration: 1500,
                });
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: "Could'nt delete item",
                    status: "error",
                    isClosable: true,
                    duration: 2000,
                });
            })
            .finally(() => setLoading(false));
    };

    useMountEffect(() => {
        fetchItem();
    });

    if (loading) {
        return (
            <Container mt={6}>
                <Center mt={6}>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="orange.200" color="orange.500" size="xl" />
                </Center>
            </Container>
        );
    }

    return (
        <>
            {item !== undefined ?
                <>
                    <Container padding={0} mt={6}>
                        <Button colorScheme="gray" onClick={() => navigate("/", { replace: true })}>
                            Back
                        </Button>
                    </Container>
                    <Container bg={background} minHeight="7rem" my={3} p={3} rounded="lg" alignItems="center" justifyContent="space-between">
                        <Text fontSize={22}>{item.title}</Text>
                        <Text bg="gray.500" mt={2} p={2} rounded="lg">
                            {item.description}
                        </Text>
                        <AddUpdateItemModal
                            editable={true}
                            defaultValues={item}
                            onSuccess={fetchItem}
                        />
                        <Button isLoading={loading} colorScheme="red" width="100%" onClick={deleteItem}>
                            Delete
                        </Button>
                    </Container>
                </>
                : null}
        </>
    );
};
