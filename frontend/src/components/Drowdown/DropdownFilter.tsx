import {
    IconButton,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorModeValue,
    Flex,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { addDays, endOfDay, startOfDay, endOfYear, endOfMonth } from "date-fns";

// Typendefinition für die DropdownFilterProps
type DropdownFilterProps = {
    filter: (start: Date, end: Date) => void;
};

// DropdownFilter-Komponente
const DropdownFilter = (props: DropdownFilterProps) => {
    // Verwenden von useDisclosure für das Modal-Handling
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Zustände für Start- und Enddatum des Filters
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

    // Funktion zum Anwenden des Filters mit Start- und Enddatum
    const filterDate = (start: Date, end: Date) => {
        props.filter(start, end);
    };

    // Funktion, die beim Klicken auf den "Speichern"-Button im Modal aufgerufen wird
    const modalOnSave = () => {
        // Anwenden des Filters mit Start- und Enddatum aus dem Modal
        if (endDate !== undefined) {
            filterDate(startOfDay(new Date(startDate)), endOfDay(new Date(endDate)));
        }
        onClose();
    };

    // JSX-Struktur für die Dropdown-Filterkomponente
    return (
        <Menu>
            {/* Button für das Filter-Icon und Öffnen des Menüs */}
            <MenuButton
                as={IconButton}
                background={useColorModeValue("gray.300", "gray.600")}
                icon={<Image src={`${process.env.PUBLIC_URL}icons/filterIcon.svg`} boxSize={"inherit"} alt="filter" />}
            />
            {/* Menü mit verschiedenen Filteroptionen */}
            <MenuList>
                {/* Filteroption: Ablauf in 3 Tagen oder weniger */}
                <MenuItem onClick={() => filterDate(startOfDay(new Date()), endOfDay(addDays(new Date(), 3)))}>
                    Ablauf in 3 Tagen oder weniger
                </MenuItem>
                {/* Filteroption: Ablauf in 10 Tagen oder weniger */}
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 3)), endOfDay(addDays(new Date(), 10)))}>
                    Ablauf in 10 Tagen oder weniger
                </MenuItem>
                {/* Filteroption: Ablauf in über 10 Tagen */}
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 10)), endOfYear(new Date(2037, 1, 1)))}>
                    Ablauf in über 10 Tagen
                </MenuItem>
                {/* Filteroption: Benutzerdefinierter Zeitraum auswählen */}
                <MenuItem onClick={onOpen} closeOnSelect={false}>
                    Zeitraum auswählen
                    {/* Modales Popup für die Auswahl des benutzerdefinierten Zeitraums */}
                    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Zeitraum auswählen</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {/* Flex-Container für Start- und Enddatum-Eingabefelder */}
                                <Flex justify={"space-between"}>
                                    {/* Eingabefeld für Startdatum */}
                                    <Flex direction={"column"}>
                                        <Heading size="md"> Start </Heading>
                                        <input
                                            type="date"
                                            value={startDate.toISOString().split("T")[0]}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e !== undefined) {
                                                    setStartDate(new Date(e.target.value));
                                                }
                                            }}
                                        />
                                    </Flex>
                                    {/* Eingabefeld für Enddatum */}
                                    <Flex direction={"column"}>
                                        <Heading size="md"> Ende </Heading>
                                        <input
                                            type="date"
                                            value={endDate?.toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                if (e !== undefined) {
                                                    setEndDate(new Date(e.target.value));
                                                }
                                            }}
                                        />
                                    </Flex>
                                </Flex>
                            </ModalBody>
                            {/* Modal-Footer mit "Speichern" und "Abbrechen"-Buttons */}
                            <ModalFooter>
                                <Button onClick={() => modalOnSave()} colorScheme="blue" mr={3}>
                                    Speichern
                                </Button>
                                <Button onClick={onClose}>Abbrechen</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default DropdownFilter;
