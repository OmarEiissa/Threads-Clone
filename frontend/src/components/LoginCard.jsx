import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);

  const [inputs, setInputs] = useState({
    userNameOrEmail: "".toLowerCase(),
    password: "",
  });
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // // التحقق من صحة كلمة المرور قبل إرسال الطلب
    // if (inputs.password.length < 6) {
    //   showToast(
    //     "Error",
    //     "Password must be at least 6 characters long.",
    //     "error"
    //   );
    //   return;
    // }

    setLoading(true);

    // تحويل userNameOrEmail إلى أحرف صغيرة
    const normalizedInputs = {
      ...inputs,
      userNameOrEmail: inputs.userNameOrEmail.toLowerCase(),
    };

    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/login`, {
        method: "POST",
credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedInputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");

        // إفراغ كلمة المرور في حالة وجود خطأ
        setInputs((prevInputs) => ({
          ...prevInputs,
          password: "",
        }));
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
      // إفراغ كلمة المرور في حالة حدوث خطأ
      setInputs((prevInputs) => ({
        ...prevInputs,
        password: "",
      }));
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
            <Heading fontSize={"4xl"}>Login</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
            w={{
              base: "full",
              sm: "400px",
            }}
          >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>UserName or Email</FormLabel>
                <Input
                  type="text"
                  value={inputs.userNameOrEmail}
                  onChange={(e) =>
                    setInputs({ ...inputs, userNameOrEmail: e.target.value })
                  }
                  placeholder="username or email"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
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
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Loading..."
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  onClick={handleLogin}
                  type="submit"
                  isLoading={loading}
                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don&apos;t have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("SignUp")}
                  >
                    Sign Up
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
