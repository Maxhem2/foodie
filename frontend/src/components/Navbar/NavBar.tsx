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

export const NavBar = () => {
  const { logout } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteAccount = async () => {
    try {
      const meResponse = await axiosInstance.get('users/me');
      const me = meResponse.data;

      if (me) {
        await axiosInstance.delete('users/delete', { data: me });
        logout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box minHeight="100vh">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg={useColorModeValue("green.300", "green.600")}
        color="white"
      >
        <Text as="h2" fontSize={24} fontWeight="bold">
          Foodie
        </Text>
        <Stack direction="row" align="center" spacing={4}>
          <Button colorScheme="red" onClick={() => onOpen()}>
            Delete Account
          </Button>
          <Modal closeOnOverlayClick={true} size="xl" onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                <ModalHeader>Möchten Sie ihren Account wirklich löschen?</ModalHeader>
                <Flex justifyContent={"flex-end"} gap={3}>
                  <Button onClick={() => deleteAccount()} colorScheme="red">Ja</Button>
                  <Button onClick={() => onClose()}>Nein</Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
          <ThemeToggler showLabel={false} size="lg" />
          <Button onClick={logout} colorScheme="orange">
            Logout
          </Button>
        </Stack>
      </Flex>
      <Outlet />
    </Box>
  );
};
