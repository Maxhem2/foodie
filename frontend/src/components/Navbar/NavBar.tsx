// Importieren der benötigten Chakra UI-Elemente, React-Router-Elemente und benutzerdefinierten Hooks
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";
import axiosInstance from "services/axios";

// Hauptkomponente für die Navigationsleiste
export const NavBar = () => {
  const { logout } = useAuth();  // Authentifizierungs-Hook für Logout

  // Hook für das Öffnen und Schließen des Lösch-Modals
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Funktion zum Löschen des Benutzerkontos
  const deleteAccount = async () => {
    try {
      // Abrufen der Benutzerdaten
      const meResponse = await axiosInstance.get('users/me');
      const me = meResponse.data;

      if (me) {
        // Löschen des Benutzerkontos und Ausführen des Logout
        await axiosInstance.delete('users/delete', { data: me });
        logout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // JSX-Struktur für die NavBar-Komponente
  return (
    <Box minHeight="100vh">
      {/* Flex-Container für die Navigationsleiste und Logo */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg={useColorModeValue("green.300", "green.600")}
        color="white"
      >
        {/* Logo oder Titel der Anwendung */}
        <Text as="h2" fontSize={24} fontWeight="bold">
          Foodie
        </Text>
        {/* Stack für rechts ausgerichtete Navigationselemente */}
        <Stack direction="row" align="center" spacing={4}>
          {/* Dunkel-Modus Umschalter */}
          <ThemeToggler showLabel={false} size="lg" />
          {/* Button zum Öffnen des Modal zum Löschen des Kontos */}
          <Button colorScheme="red" onClick={() => onOpen()}>
            Delete Account
          </Button>
          {/* Modal zum Löschen des Kontos */}
          <Modal closeOnOverlayClick={true} size="xl" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                <ModalHeader>Möchten Sie ihren Account wirklich löschen?</ModalHeader>
                {/* Flex-Container für Ja- und Nein-Buttons */}
                <Flex justifyContent={"flex-end"} gap={3}>
                  <Button onClick={() => deleteAccount()} colorScheme="red">Ja</Button>
                  <Button onClick={() => onClose()}>Nein</Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
          {/* Logout-Button */}
          <Button onClick={logout} colorScheme="orange">
            Logout
          </Button>
        </Stack>
      </Flex>
      {/* React Router Outlet für geroutete Inhalte */}
      <Outlet />
    </Box>
  );
};
