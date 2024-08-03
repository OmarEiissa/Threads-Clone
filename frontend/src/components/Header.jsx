import {
  Avatar,
  Button,
  Flex,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil"; //useSetRecoilState
import { Link } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  // const setAuthScreen = useSetRecoilState(authScreenAtom);

  const borderColor = useColorModeValue("gray.dark", "gray.100");
  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={12}>
      {user && (
        <ChakraLink
          as={Link}
          to="/auth"
          display={"flex"}
          alignItems={"center"}
          _hover={{ transform: "scale(1.1)" }}
          transition="all 0.2s ease-in-out"
        >
          <AiFillHome size={30} />
        </ChakraLink>
      )}

      {/* {!user && (
        <ChakraLink
          as={Link}
          to="/"
          display={"flex"}
          alignItems={"center"}
          transition="all 0.2s ease-in-out"
          _hover={{ transform: "scale(1.1)" }}
          onClick={() => setAuthScreen("login")}
        >
          login
        </ChakraLink>
      )} */}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={7}
        src={colorMode == "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link to={`/${user.userName}`}>
            <Avatar
              name={user.userName}
              cursor={"pointer"}
              size={"sm"}
              src={user.profilePic}
              border="1px solid"
              borderTopColor={borderColor}
              borderRightColor={borderColor}
              borderBottomColor={borderColor}
              borderLeftColor={borderColor}
              borderRadius={"full"}
              transition={"transform 0.2s ease-in-out"}
              _hover={{
                transform: "scale(1.1)",
              }}
            />
          </Link>
          <Button
            size={"xs"}
            onClick={logout}
            // rightIcon={<FiLogOut size={20} />}
            // bg={useColorModeValue("gray.300", "gray.dark")}
          >
            <FiLogOut size={20} />
            {/* Logout */}
          </Button>
        </Flex>
      )}

      {/* {!user && (
        <ChakraLink
          as={Link}
          to="/authauth"
          display={"flex"}
          alignItems={"center"}
          transition="all 0.2s ease-in-out"
          _hover={{ transform: "scale(1.1)" }}
          onClick={() => setAuthScreen("signUp")}
        >
          signUp
        </ChakraLink>
      )} */}
    </Flex>
  );
};

export default Header;
