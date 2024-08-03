import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

const UserPage = () => {
  const { user, loading, userName } = useGetUserProfile();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/posts/user/${userName}`
        );
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [showToast, userName, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;
  // console.log(user);

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has not Post..</h1>}
      {fetchingPosts && (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post, index) => (
        <Post key={index} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
