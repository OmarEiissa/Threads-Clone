import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const logout = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
      } else {
        showToast("Success", "Logged out successfully", "success");
      }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return logout;
};

export default useLogout;
