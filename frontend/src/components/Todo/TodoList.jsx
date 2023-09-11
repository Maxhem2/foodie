import { Box, Center, Container, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { AddUpdateTodoModal } from "./AddUpdateTodoModal";
import { TodoCard } from "./TodoCard";
import DropdownFilter from "../Drowdown/DropdownFilter";

export const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState();
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        fetchTodos();
        isMounted.current = true;
    }, []);

    const fetchTodos = () => {
        setLoading(true);
        axiosInstance
            .get("/todo/")
            .then((res) => {
                setTodos(res.data);
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
                <AddUpdateTodoModal onSuccess={fetchTodos} />
                <DropdownFilter filter={filterEntries} />
            </Flex>
            {loading ? (
                <Center mt={6}>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="orange.200" color="orange.500" size="xl" />
                </Center>
            ) : (
                <Box mt={6}>
                    {todos
                        ?.filter((todo) =>
                            date !== undefined && date.start !== undefined && date.end !== undefined
                                ? new Date(todo.expireDate) >= date.start && new Date(todo.expireDate) < date.end
                                : todo
                        )
                        .sort((a, b) => (a.expireDate > b.expireDate ? 1 : -1))
                        .map((todo) => (
                            <TodoCard todo={todo} key={todo.todo_id} />
                        ))}
                </Box>
            )}
        </Container>
    );
};
