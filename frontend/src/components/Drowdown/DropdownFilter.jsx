import { IconButton, Image, Menu, MenuButton, MenuItem, MenuList, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { addDays, endOfDay, startOfDay, endOfYear } from "date-fns";

const DropdownFilter = ({ filter = (start, end) => {} }) => {
    const filterDate = (start, end) => {
        filter(start, end);
    };

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                background={useColorModeValue("gray.300", "gray.600")}
                icon={<Image src={`${process.env.PUBLIC_URL}icons/filterIcon.svg`} boxSize={"inherit"} alt="filter" />}
            />
            <MenuList>
                <MenuItem onClick={() => filterDate(startOfDay(new Date()), endOfDay(addDays(new Date(), 3)))}>Läuft in mind. 3 Tagen ab</MenuItem>
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 3)), endOfDay(addDays(new Date(), 10)))}>
                    Läuft in mind. 10 Tagen ab
                </MenuItem>
                <MenuItem onClick={() => filterDate(startOfDay(addDays(new Date(), 10)), endOfYear(new Date(2037, 1, 1)))}>Läuft in über 10 Tagen ab</MenuItem>
                <MenuItem onClick={() => filterDate()}>Zeitram auswählen</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default DropdownFilter;
