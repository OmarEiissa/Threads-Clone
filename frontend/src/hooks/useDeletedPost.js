import { useState } from "react";
import useShowToast from "./useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

function useDeletePost() {
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);

  const deletePost = async (postId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      setIsDeleting(true);
      const res = await fetch(`${VITE_API_BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPosts(posts.filter((p) => p._id !== postId));
      showToast("Success", "Post deleted", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deletePost };
}

export default useDeletePost;
