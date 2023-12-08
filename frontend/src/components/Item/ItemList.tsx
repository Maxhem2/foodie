// Importieren der benötigten Chakra UI-Elemente und -Hooks sowie externen Funktionen und Typen
import { Box, Center, Container, Flex, Spinner, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateItemModal } from "./AddUpdateItemModal";
import { ItemCard } from "./ItemCard";
import DropdownFilter from "../Drowdown/DropdownFilter";  // Hinweis: Hier gibt es einen Tippfehler ("Drowdown"), könnte "Dropdown" sein.
import format from "date-fns/format";
import { Item } from "types";
import { useMountEffect } from "hooks";

// Typendefinition für den Zeitraum von Datumswerten
type DateRange = {
    start: Date;
    end: Date;
};

// Hauptkomponente für die Anzeige der Liste von Elementen
export const ItemList = () => {
    const [items, setItems] = useState<Array<Item>>([]);  // State-Hook für die Elemente
    const [loading, setLoading] = useState<boolean>(true);  // State-Hook für Ladezustand
    const [date, setDate] = useState<DateRange | undefined>();  // State-Hook für den ausgewählten Zeitraum

    // Effekt beim Mounten der Komponente, um die Elemente zu laden
    useMountEffect(() => {
        fetchItems();
    });

    // Funktion zum Abrufen der Elemente von der API
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

    // Funktion zum Filtern der Elemente nach einem bestimmten Zeitraum
    const filterEntries = (start: Date, end: Date) => {
        setDate({ start, end });
    };

    // JSX-Struktur für die ItemList-Komponente
    return (
        <Container mt={9}>
            {/* Flex-Container für das Hinzufügen/Ändern von Elementen und den Dropdown-Filter */}
            <Flex gap={2}>
                <AddUpdateItemModal editable={false} defaultValues={undefined} onSuccess={fetchItems} />
                <DropdownFilter filter={filterEntries} />
            </Flex>

            {/* Anzeige des ausgewählten Zeitraums als Tag (optional) */}
            {date !== undefined && date.start !== undefined && date.end !== undefined ? (
                <Tag mt={3} size={"lg"} borderRadius={"full"} colorScheme="messenger">
                    <TagLabel>
                        {`${format(new Date(date.start), "dd-MM-yyyy")} - ${format(new Date(date.end), "dd-MM-yyyy")}`}
                    </TagLabel>
                    <TagCloseButton onClick={() => setDate(undefined)} />
                </Tag>
            ) : null}

            {/* Anzeige des Ladezustands oder der Liste von Elementen */}
            {loading ? (
                // Ladezustand: Anzeige eines Spinners in der Mitte
                <Center mt={6}>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="orange.200" color="orange.500" size="xl" />
                </Center>
            ) : (
                // Liste von Elementen: Anzeige von ItemCard-Komponenten
                <Box mt={6}>
                    {items
                        ?.filter((item: Item) =>
                            date !== undefined && date.start !== undefined && date.end !== undefined
                                ? new Date(item.expireDate) >= date.start && new Date(item.expireDate) < date.end
                                : item
                        )
                        .sort((a, b) => (a.expireDate > b.expireDate ? 1 : -1))
                        .map((item: Item) => (
                            <ItemCard item={item} key={item.item_id} />
                        ))}
                </Box>
            )}
        </Container>
    );
};
