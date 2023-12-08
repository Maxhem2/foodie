// Importieren der benötigten Chakra UI-Elemente, React-Router-Elemente und benutzerdefinierten Hooks
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Highlight,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggler } from "../Theme/ThemeToggler";
import axiosInstance from "services/axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "types";
import { useMountEffect } from "hooks";

enum ViewMode {
  NONE,
  DELETE,
  UPDATE
}

type UpdateEmail = {
  email: string
}

// Hauptkomponente für die Navigationsleiste
export const NavBar = () => {
  const { logout } = useAuth();  // Authentifizierungs-Hook für Logout
  const toast = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.NONE);
  const [me, setMe] = useState<User>();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UpdateEmail>({
  });

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

  const handleOpenModal = (viewMode: ViewMode) => {
    setViewMode(viewMode);
    onOpen();
  };

  const onSubmit = async (values: UpdateEmail) => {
    try {
      const meResponse = await axiosInstance.get('users/me');
      const me = meResponse.data;
      if (me) {
        // Löschen des Benutzerkontos und Ausführen des Logout
        await axiosInstance.put('users/update_email', { user: me, email: values.email });

        toast({
          title: "Email Updated",
          status: "success",
          isClosable: true,
          duration: 1500,
        });

        onClose();
        fetchMe();
        reset();
      }
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

  const fetchMe = (async () => {
    try {
      const meResponse = await axiosInstance.get('users/me');
      const data = meResponse.data;

      if (data) {
        setMe(data);
      }
    } catch (err) {
      console.error(err);
    }
  });

  useMountEffect(() => {
    (async () => {
      await fetchMe();
    })();
  });

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
        <Flex alignItems={"center"} gap={4}>
          <Text as="h2" fontSize={24} fontWeight="bold" align={"center"}>
            Foodie
          </Text>
          <Menu>
            <MenuButton as={IconButton} rounded={100} icon={<Avatar src='https://bit.ly/broken-link' />}>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleOpenModal(ViewMode.UPDATE)}>Change Email</MenuItem>
              {/* Button zum Öffnen des Modal zum Löschen des Kontos */}
              <MenuItem onClick={() => handleOpenModal(ViewMode.DELETE)}>Delete Account</MenuItem>
            </MenuList>
          </Menu>
          {/* Modal zum Löschen des Kontos */}
          <Modal closeOnOverlayClick={true} size="xl" onClose={() => {
            setViewMode(ViewMode.NONE);
            onClose();
          }} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              {viewMode === ViewMode.UPDATE ?
                <ModalBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader px={0}>Möchten Sie Ihre Email wirklich ändern?</ModalHeader>
                    {me !== undefined ?
                      <Highlight query={me?.email} styles={{ px: '1', py: '1', rounded: 'full', bg: 'orange.100' }}>
                        {`Derzeitige E-Mail ${me.email ?? ""}`}
                      </Highlight>
                      : null}
                    <Flex mb={3}>
                      <FormControl isInvalid={errors.email !== undefined}>
                        <Input
                          type="email"
                          placeholder="Email"
                          size="lg"
                          mt={6}
                          {...register("email", {
                            required: "This is a required field",
                          })}
                        />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                      </FormControl>
                    </Flex>
                    <Flex justifyContent={"flex-end"} gap={3}>
                      <Button type="submit">Speichern</Button>
                      <Button onClick={() => onClose()}>Abbrechen</Button>
                    </Flex>
                  </form>
                </ModalBody>
                :
                viewMode === ViewMode.DELETE ?
                  <ModalBody>
                    <ModalHeader px={0}>Möchten Sie ihren Account wirklich löschen?</ModalHeader>
                    {/* Flex-Container für Ja- und Nein-Buttons */}
                    <Flex justifyContent={"flex-end"} gap={3}>
                      <Button onClick={() => deleteAccount()} colorScheme="red">Ja</Button>
                      <Button onClick={() => onClose()}>Nein</Button>
                    </Flex>
                  </ModalBody>
                  : null}
            </ModalContent>
          </Modal>
        </Flex>

        {/* Stack für rechts ausgerichtete Navigationselemente */}
        <Flex justifyContent={"flex-end"}>
          <Stack direction="row" align="center" spacing={4}>
            {/* Dunkel-Modus Umschalter */}
            <ThemeToggler showLabel={false} size="lg" />

            {/* Logout-Button */}
            <Button onClick={logout} colorScheme="orange">
              Logout
            </Button>
          </Stack>
        </Flex>
      </Flex>
      {/* React Router Outlet für geroutete Inhalte */}
      <Outlet />
    </Box>
  );
};
