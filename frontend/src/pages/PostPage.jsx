import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useDeletePost from "../hooks/useDeletedPost";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

const PostPage = () => {
  const { deletePost } = useDeletePost();
  const { user, loading, userName } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`${VITE_API_BASE_URL}/api/posts/` + pId);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [showToast, pId, user, setPosts]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    await deletePost(currentPost._id);
    navigate(`/${userName}`);
  };

  if (!user && !userName && loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
      >
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) {
    return null;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} gap={3}>
          {" "}
          {/* alignItems={"center"} */}
          <Avatar
            src={user?.profilePic}
            size="md"
            name={user?.userName}
            cursor={"pointer"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.userName}`);
            }}
          />
          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.userName}`);
              }}
            >
              {user?.userName}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            w={"36"}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              boxSize={4}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={"6"}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        {/* <Button>Get</Button> */}
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply, index) => (
        <Comment
          key={index}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
