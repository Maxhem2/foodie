import { Badge, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import endOfDay from "date-fns/endOfDay";
import { useCallback, useMemo } from "react";
import { Item } from "types";

type ItemCardProps = {
    item: Item;
}

export const ItemCard = (props: ItemCardProps) => {
    // Funktion zur Berechnung der verbleibenden Tage bis zum Verfallsdatum
    const calculateExpireDate = useCallback(() => {
        const timeDifference = (endOfDay(new Date(props.item.expireDate))).getTime() - (endOfDay(new Date())).getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return Math.round(daysDifference);

    }, [props.item]);

    // Memoisierte berechnete Werte (Verhindert erneute Berechnung bei Komponenten-Updates)
    const calculatedExpireDate = useMemo(() => calculateExpireDate(), [calculateExpireDate]);


    // Funktion zur Auswahl des Color Schemes für die Badge-Komponente basierend auf verbleibenden Tagen
    const colorSchemeSwitch = () => {
        return calculatedExpireDate < 0 ? "black" : calculatedExpireDate <= 3 ? "red" : calculatedExpireDate <= 10 ? "yellow" : "green";
    };

    const navigate = useNavigate();
    return (
        <Flex
            bg={useColorModeValue("gray.300", "gray.600")}
            minHeight="3rem"
            my={3}
            p={3}
            rounded="lg"
            alignItems="center"
            justifyContent="space-between"
            _hover={{
                opacity: 0.9,
                cursor: "pointer",
                transform: "translateY(-3px)",
            }}
            onClick={() => navigate(`/${props.item.item_id}`, { replace: true })}
        >
            <Text>{props.item.title}</Text>
            <Badge colorScheme={colorSchemeSwitch()}>
                {calculatedExpireDate < 0 ? `Ist seit ${Math.abs(calculatedExpireDate)} Tagen abgelaufen` : `Läuft in ${calculatedExpireDate} Tagen ab`}
            </Badge>
        </Flex>
    );
};
