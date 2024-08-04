import { Flex, Spinner, Avatar, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { Link } from "react-router-dom";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
  const getFeedPosts = async () => {
    setLoading(true);
    setPosts([]);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/posts/feed`, {
        credentials: "include" // أضف هذا السطر
      });
      const data = await res.json();
      console.log("Feed posts data:", data);

      if (data.error) {
        showToast("Error", data.error, "error");
      }

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        showToast("Error", "Unexpected data format", "error");
      }

      if (data.length === 0) {
        // Fetch users if there are no posts
        const userRes = await fetch(`${VITE_API_BASE_URL}/api/users`, {
          credentials: "include" // أضف هذا السطر
        });
        if (!userRes.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData = await userRes.json();
        setUsers(userData);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  getFeedPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [showToast, setPosts]);


  return (
    <>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="80vh">
          <Spinner size="xl" />
        </Flex>
      ) : posts.length === 0 ? (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          h="80vh"
        >
          <Text mb={4}>Follow some users to see the feed</Text>
          <Flex gap={10} wrap="wrap" justifyContent="center">
            {users.length > 0 ? (
              users.map((user, index) => (
                <Link key={index} to={`/${user.userName}`}>
                  <Flex
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    transition="all 0.3s ease"
                    borderRadius={index % 2 === 0 ? "2xl" : "3xl"}
                    _hover={{ bg: "#2d2d2d" }}
                  >
                    <Avatar
                      name={user.userName}
                      src={user.profilePic}
                      size="lg"
                      m={2}
                    />
                    <Text>{user.userName}</Text>
                  </Flex>
                </Link>
              ))
            ) : (
              <Text>No users available</Text>
            )}
          </Flex>
        </Flex>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      )}
    </>
  );
};

export default HomePage;
