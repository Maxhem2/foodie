import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { ThemeToggler } from "../Theme/ThemeToggler";
import FallingStars from "./FallingStars";
import { UserCreationInformation } from "types";

export const Register = () => {
  // React-Hook-Form verwenden
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UserCreationInformation>();
  
  const navigate = useNavigate();
  
  const toast = useToast();

  // Funktion, die aufgerufen wird, wenn das Formular eingereicht wird
  const onSubmit = async (values: UserCreationInformation) => {
    try {
      // HTTP-POST-Anfrage an den Server senden, um einen neuen Benutzer zu erstellen
      await axiosInstance.post("/users/create", values);
      
      // Erfolgsmeldung anzeigen
      toast({
        title: "Account created successfully.",
        status: "success",
        isClosable: true,
        duration: 1500,
      });
      
      // Zum Login-Bildschirm navigieren
      navigate("/login", { replace: true });
    } catch (err: any) {
      // Fehlermeldung anzeigen, wenn die Benutzererstellung fehlschlägt
      toast({
        title: `${err.response.data.detail}`,
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };

  // JSX-Struktur für die Registrierungskomponente
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      {/* Hintergrundanimation mit FallingStars-Komponente */}
      <FallingStars />
      {/* Registrierungsformular-Container */}
      <Flex
        direction="column"
        alignItems="center"
        background={useColorModeValue("gray.100", "gray.700")}
        p={12}
        rounded={6}
      >
        {/* Überschrift */}
        <Heading mb={6}>Register</Heading>
        {/* Registrierungsformular */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* E-Mail-Eingabefeld mit Validierungsfehler-Handling */}
          <FormControl isInvalid={errors.email !== undefined}>
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
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          {/* Benutzername-Eingabefeld mit Validierungsfehler-Handling */}
          <FormControl isInvalid={errors.username !== undefined}>
            <Input
              placeholder="Username"
              background={useColorModeValue("gray.300", "gray.600")}
              type="text"
              variant="filled"
              size="lg"
              mt={6}
              {...register("username", {
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Username must be at least 5 characters",
                },
                maxLength: {
                  value: 24,
                  message: "Username must be at most 24 characters",
                },
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
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
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
                maxLength: {
                  value: 24,
                  message: "Password must be at most 24 characters",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          {/* Register-Button */}
          <Button
            isLoading={isSubmitting}
            loadingText="Creating account..."
            width="100%"
            colorScheme="green"
            variant="outline"
            mt={6}
            mb={6}
            type="submit"
          >
            Register
          </Button>
        </form>
        {/* ThemeToggler für das Wechseln des Farbschemas */}
        <ThemeToggler showLabel={true} />
        {/* Button zum Wechseln zur Login-Seite */}
        <Button
          onClick={() => navigate("/login", { replace: true })}
          width="100%"
          colorScheme="gray"
          variant="outline"
          mt={6}
        >
          Login Instead
        </Button>
      </Flex>
    </Flex>
  );
};
