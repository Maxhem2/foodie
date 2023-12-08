import { Button, Flex, FormControl, FormErrorMessage, Heading, Input, useColorModeValue, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";
import { useState } from "react";
import FallingStars from "./FallingStars";
import { LoginParams } from "types";

const slogans: string[] = [
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

// Login-Komponente
export const Login = () => {
    // Zufälliger Slogan aus der Liste auswählen
    const [randomSlogan] = useState<string>(getRandomSlogan());

    // Funktion, um einen zufälligen Slogan aus der Liste zu erhalten
    function getRandomSlogan(): string {
        return slogans[Math.floor(Math.random() * slogans.length)];
    }

    // React-Hook-Form verwenden
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<LoginParams>();
    
    // react-router-dom Hook verwenden
    const navigate = useNavigate();
    
    // Authentifizierungs-Hook verwenden
    const { login } = useAuth();
    
    // Toast-Hook verwenden
    const toast = useToast();

    // Funktion, die aufgerufen wird, wenn das Formular eingereicht wird
    const onSubmit = async (values: LoginParams) => {
        try {
            // Authentifizierung durchführen
            await login(values.email, values.password);
        } catch (error) {
            // Fehlermeldung anzeigen, wenn die Authentifizierung fehlschlägt
            toast({
                title: "Invalid email or password",
                status: "error",
                isClosable: true,
                duration: 1500,
            });
        }
    };

    // JSX-Struktur für die Login-Komponente
    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            {/* Hintergrundanimation mit FallingStars-Komponente */}
            <FallingStars />
            {/* Login-Formular-Container */}
            <Flex direction="column" alignItems="center" background={useColorModeValue("gray.100", "gray.700")} p={12} rounded={6}>
                {/* Überschrift */}
                <Heading mb={6}>Login</Heading>
                {/* Zufällig ausgewählter Slogan */}
                <p>{randomSlogan}</p>
                {/* Login-Formular */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* E-Mail-Eingabefeld mit Validierungsfehler-Handling */}
                    <FormControl isInvalid={errors.email !== undefined}>
                        <Input
                            placeholder="Name"
                            background={useColorModeValue("gray.300", "gray.600")}
                            type="email"
                            size="lg"
                            mt={6}
                            {...register("email", {
                                required: "This is a required field",
                            })}
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                    </FormControl>
                    {/* Passwort-Eingabefeld mit Validierungsfehler-Handling */}
                    <FormControl isInvalid={errors.password !== undefined}>
                        <Input
                            placeholder="Password"
                            background={useColorModeValue("gray.300", "gray.600")}
                            type="password"
                            size="lg"
                            mt={6}
                            {...register("password", {
                                required: "This is a required field",
                            })}
                        />
                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                    </FormControl>
                    {/* Login-Button */}
                    <Button isLoading={isSubmitting} loadingText="Logging in..." width="100%" colorScheme="green" variant="outline" mt={6} mb={6} type="submit">
                        Login
                    </Button>
                </form>
                {/* Theme-Toggler für das Ändern des Farbschemas */}
                <ThemeToggler showLabel={true} />
                {/* Button zum Wechseln zur Registrierungsseite */}
                <Button onClick={() => navigate("/register", { replace: true })} width="100%" colorScheme="gray" variant="outline" mt={6}>
                    Register
                </Button>
            </Flex>
        </Flex>
    );
};
