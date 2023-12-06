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

type DropdownFilterProps = {
    filter: (start: Date, end: Date) => void;
}

const DropdownFilter = (props: DropdownFilterProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

    const filterDate = (start: Date, end: Date) => {
        props.filter(start, end);
    };

    const modalOnSave = () => {
        if (endDate !== undefined) {
            filterDate(startOfDay(new Date(startDate)), endOfDay(new Date(endDate)));
        }
        onClose();
    };

    console.log(startDate);

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                background={useColorModeValue("gray.300", "gray.600")}
                icon={<Image src={`${process.env.PUBLIC_URL}icons/filterIcon.svg`} boxSize={"inherit"} alt="filter" />}
            />
            <MenuList>
                <MenuItem onClick={() => filterDate(startOfDay(new Date()), endOfDay(addDays(new Date(), 3)))}>Ablauf in 3 Tagen oder weniger</MenuItem>
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 3)), endOfDay(addDays(new Date(), 10)))}>Ablauf in 10 Tagen oder weniger</MenuItem>
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 10)), endOfYear(new Date(2037, 1, 1)))}>Ablauf in über 10 Tagen</MenuItem>
                <MenuItem onClick={onOpen} closeOnSelect={false}>
                    Zeitraum auswählen
                    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Zeitraum auswählen</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <Flex justify={"space-between"}>
                                    <Flex direction={"column"}>
                                        <Heading size="md"> Start </Heading>
                                        <input type="date"
                                            value={startDate.toISOString().split("T")[0]}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e !== undefined) {
                                                    setStartDate(new Date(e.target.value));
                                                };
                                            }} />
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Heading size="md"> Ende </Heading>
                                        <input type="date"
                                            value={endDate?.toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                if (e !== undefined) {
                                                    setEndDate(new Date(e.target.value));
                                                };
                                            }}
                                        />
                                    </Flex>
                                </Flex>
                            </ModalBody>
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
