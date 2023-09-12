import { Badge, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import endOfDay from "date-fns/endOfDay";
import { useCallback, useMemo } from "react";

export const ItemCard = ({ item }) => {
    const calculateExpireDate = useCallback(() => {
        if (item.expireDate !== null && item.expireDate !== undefined) {
            const timeDifference = endOfDay(new Date(item.expireDate)) - endOfDay(new Date());
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            return Math.round(daysDifference);
        }
    }, [item.expireDate]);

    const calculatedExpireDate = useMemo(() => calculateExpireDate(), [calculateExpireDate]);

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
            onClick={() => navigate(`/${item.item_id}`, { replace: true })}
        >
            <Text>{item.title}</Text>
            <Badge colorScheme={colorSchemeSwitch()}>
                {calculatedExpireDate < 0 ? `Ist seit ${Math.abs(calculatedExpireDate)} Tagen abgelaufen` : `Läuft in ${calculatedExpireDate} Tagen ab`}
            </Badge>
        </Flex>
    );
};
