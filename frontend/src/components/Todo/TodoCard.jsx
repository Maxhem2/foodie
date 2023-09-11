import { Badge, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import endOfDay from "date-fns/endOfDay";

export const TodoCard = ({ todo }) => {
    const calculateExpireDate = () => {
        if (todo.expireDate !== null && todo.expireDate !== undefined) {
            const timeDifference = endOfDay(new Date(todo.expireDate)) - new Date();
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            return Math.round(daysDifference);
        }
    };

    const colorSchemeSwitch = () => {
        const expireDateDayDifference = calculateExpireDate();
        return expireDateDayDifference < 0 ? "black" : expireDateDayDifference <= 3 ? "red" : expireDateDayDifference <= 10 ? "yellow" : "green";
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
            onClick={() => navigate(`/${todo.todo_id}`, { replace: true })}
        >
            <Text>{todo.title}</Text>
            <Badge colorScheme={colorSchemeSwitch()}>Läuft in {calculateExpireDate()} Tagen ab</Badge>
        </Flex>
    );
};
