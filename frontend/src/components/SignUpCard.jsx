import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue, 
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

export default function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "", // حقل تأكيد كلمة المرور
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  // إضافة دالة للتحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // // إضافة دالة للتحقق من صحة كلمة المرور
  // const validatePassword = (pass) => {
  //   return pass.length >= 6;
  // };

  const handelSignUp = async () => {
    setLoading(true);
    // التحقق من صحة البريد الإلكتروني قبل إرسال الطلب
    if (!validateEmail(inputs.email)) {
      showToast("Error", "Please enter a valid email address.", "error");
      return;
    }

    // التحقق من صحة كلمة المرور قبل إرسال الطلب
    if (inputs.password.length < 6) {
      showToast(
        "Error",
        "Password must be at least 6 characters long.",
        "error"
      );
      setLoading(false);
      return;
    }

    // التحقق من تطابق كلمتي المرور
    if (inputs.password !== inputs.confirmPassword) {
      showToast("Error", "Passwords do not match.", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justifyContent={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={6} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign up</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, name: e.target.value })
                      }
                      value={inputs.name}
                      placeholder="full name"
                      _placeholder={{ color: "gray.500" }}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>UserName</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, userName: e.target.value })
                      }
                      value={inputs.userName}
                      placeholder="username"
                      _placeholder={{ color: "gray.500" }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                  value={inputs.email}
                  placeholder="email"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                    value={inputs.password}
                    placeholder="password"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setInputs({ ...inputs, confirmPassword: e.target.value })
                    }
                    value={inputs.confirmPassword}
                    placeholder="confirm password"
                    _placeholder={{ color: "gray.500" }}
                  />
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="SighUp"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  onClick={handelSignUp}
                  type="submit"
                  isLoading={loading}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("login")}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
