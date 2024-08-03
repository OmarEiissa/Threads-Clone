import PropTypes from "prop-types";
import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useDeletePost from "../hooks/useDeletedPost";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

function Post({ post, postedBy }) {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  const { deletePost } = useDeletePost();

  const navigate = useNavigate();

  // fetch user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/users/profile/${postedBy}`
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    await deletePost(post._id);
  };

  if (!user) return null;

  return (
    <Link to={`/${user.userName}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.userName}
            src={user?.profilePic}
            cursor={"pointer"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.userName}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}

            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name={post.replies[0].userName}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left={"11px"}
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name={post.replies[1].userName}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"2px"}
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name={post.replies[2].userName}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left={"-.5px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2} w={"528px"}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex
              w={"full"}
              alignItems={"center"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.userName}`);
              }}
            >
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user?.userName}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                w={"36"}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <DeleteIcon boxSize={4} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={"6"}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
      <Divider my={4} />
    </Link>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    img: PropTypes.string,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        userName: PropTypes.string,
        userProfilePic: PropTypes.string,
      })
    ).isRequired,
    likes: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          userName: PropTypes.string,
          userProfilePic: PropTypes.string,
        }),
        PropTypes.string,
      ])
    ).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  postedBy: PropTypes.string.isRequired,
};

export default Post;
