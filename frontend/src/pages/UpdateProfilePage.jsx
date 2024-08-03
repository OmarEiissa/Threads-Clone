import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { ArrowRightIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

export default function UpdateProfilePage() {
  const { userName } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: "",
    userName: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  const showToast = useShowToast();

  const { handleImgChange, imgUrl } = usePreviewImg();

  useEffect(() => {
    // تحميل بيانات المستخدم عند تحميل الصفحة
    if (userName) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${VITE_API_BASE_URL}/api/users/profile/${userName}`
          );
          const data = await res.json();
          if (data.user) {
            setInputs({
              name: data.user.name,
              userName: data.user.userName,
              email: data.user.email,
              bio: data.user.bio,
              password: "",
              confirmPassword: "",
            });
          }
        } catch (error) {
          showToast("Error", error.message, "error");
        }
      };
      fetchUser();
    }
  }, [userName, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);

    // التحقق من صحة كلمة المرور قبل إرسال الطلب
    if (inputs.password.length < 6 && inputs.password.length > 0) {
      showToast(
        "Error",
        "Password must be at least 6 characters long.",
        "error"
      );
      setUpdating(false);
      return;
    }

    // التحقق من تطابق كلمتي المرور
    if (inputs.password !== inputs.confirmPassword) {
      showToast("Error", "Passwords do not match.", "error");
      setUpdating(false);
      return;
    }

    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/users/update/${userName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        }
      );
      const data = await res.json(); // updated user object
      if (data.error) {
        if (
          typeof data.error === "string" &&
          data.error.includes(
            "E11000 duplicate key error collection: threads.users index: userName_1 dup key"
          )
        ) {
          showToast("Error", "The userName is already in use.", "error");
          console.log(data.error);
        } else if (
          typeof data.error === "string" &&
          data.error.includes(
            "E11000 duplicate key error collection: threads.users index: email_1 dup key: "
          )
        ) {
          showToast("Error", "The email is already in use.", "error");
          console.log(data.error);
        } else {
          showToast("Error", data.error, "error");
          console.log(data.error);
        }
        setUpdating(false);
        return;
      }
      showToast("Success", data.message, "success");
      setUser(data.user);
      localStorage.setItem("user-threads", JSON.stringify(data.user));

      // تفريغ كلمات المرور بعد التحديث
      setInputs((prevInputs) => ({
        ...prevInputs,
        password: "",
        confirmPassword: "",
      }));

      // navigate(`/${userName}`);
    } catch (error) {
      showToast("error", error.message, "error");
      console.log(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Edit
            </Heading>
            {/* back user page  */}
            <Button
              onClick={() => navigate(`/${userName}`)}
              rightIcon={<ArrowRightIcon boxSize={3} />}
              variant={"ghost"}
              ml={4}
            >
              Back
            </Button>
          </Flex>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                  name={user.userName}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImgChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder={"name"}
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="User name"
              value={inputs.userName}
              onChange={(e) =>
                setInputs({ ...inputs, userName: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                _placeholder={{ color: "gray.500" }}
                type={showPassword ? "text" : "password"}
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

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="password"
                _placeholder={{ color: "gray.500" }}
                type={showPassword ? "text" : "password"}
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
                value={inputs.confirmPassword}
              />
            </InputGroup>
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={() => navigate(`/${inputs.userName}`)}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
