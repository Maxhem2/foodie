import { Button, Flex, FormControl, FormErrorMessage, Heading, Input, useColorModeValue, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";
import React, { useState } from "react";
import FallingStars from "./FallingStars";

const slogans = [
    "Freshness at your fingertips!",
    "Food Guardian: Protecting your pantry.",
    "Waste not, want not!",
    "Savor every bite, avoid food waste!",
    "Eating well, one expiration date at a time.",
    "Your food's best friend!",
    "Preserve flavor, save food.",
    "Expiration dates made easy!",
    "No more food spoilage surprises!",
    "Effortless food management, always delicious!",
];

export const Login = () => {
    const [randomSlogan] = useState(getRandomSlogan);

    function getRandomSlogan() {
        return slogans[Math.floor(Math.random() * slogans.length)];
    }
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();

    const onSubmit = async (values) => {
        try {
            await login(values.email, values.password);
        } catch (error) {
            toast({
                title: "Invalid email or password",
                status: "error",
                isClosable: true,
                duration: 1500,
            });
        }
    };
    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <FallingStars />
            <Flex direction="column" alignItems="center" background={useColorModeValue("gray.100", "gray.700")} p={12} rounded={6}>
                <Heading mb={6}>Login</Heading>
                <p>{randomSlogan}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl isInvalid={errors.email}>
                        <Input
                            placeholder="Email"
                            background={useColorModeValue("gray.300", "gray.600")}
                            type="email"
                            size="lg"
                            mt={6}
                            {...register("email", {
                                required: "This is required field",
                            })}
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.email}>
                        <Input
                            placeholder="Password"
                            background={useColorModeValue("gray.300", "gray.600")}
                            type="password"
                            size="lg"
                            mt={6}
                            {...register("password", {
                                required: "This is required field",
                            })}
                        />
                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                    </FormControl>
                    <Button isLoading={isSubmitting} loadingText="Logging in..." width="100%" colorScheme="green" variant="outline" mt={6} mb={6} type="submit">
                        Login
                    </Button>
                </form>
                <ThemeToggler showLabel={true} />
                <Button onClick={() => navigate("/register", { replace: true })} width="100%" colorScheme="gray" variant="outline" mt={6}>
                    Register
                </Button>
            </Flex>
        </Flex>
    );
};
