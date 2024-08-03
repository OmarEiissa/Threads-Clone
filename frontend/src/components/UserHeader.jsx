import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import userAtom from "../atoms/userAtom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

function UserHeader({ user }) {
  const currentUser = useRecoilValue(userAtom); // logged in user
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  // copyURL
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast(
        "Account created.",
        "URL has been copied to clipboard!",
        "success"
      );
    });
  };

  const handleFollowUnFollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/users/follow/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `followed ${user.name}`, "success");
        user.followers.push(currentUser?._id);
      }

      setFollowing(!following);
    } catch (error) {
      showToast("Error", error.message, "error");
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box
          display={"flex"}
          alignItems={"start"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.userName}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.userName}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.userName}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser && currentUser?._id === user._id && (
        // التحقق من أن currentUser معرف
        <Link to={`/${user.userName}/updateProfile`}>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {currentUser && currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnFollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link to={""} color={"gray.light"}>
            instagram.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"} onClick={copyURL}>
                  <MenuItem>Copy link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
UserHeader.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    bio: PropTypes.string,
    followers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default UserHeader;
