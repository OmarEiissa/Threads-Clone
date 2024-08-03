import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

function useGetUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { userName } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `${VITE_API_BASE_URL}/api/users/profile/${userName}`
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [userName, showToast]);
  return { user, loading, userName };
}

export default useGetUserProfile;
