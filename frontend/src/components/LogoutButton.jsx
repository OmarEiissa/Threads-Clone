import { Button, useColorModeValue } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

// url
import { VITE_API_BASE_URL } from "../hooks/useConfig";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
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
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
      // rightIcon={<FiLogOut size={20} />}
      bg={useColorModeValue("gray.300", "gray.dark")}
    >
      <FiLogOut size={20} />
      {/* Logout */}
    </Button>
  );
};

export default LogoutButton;
