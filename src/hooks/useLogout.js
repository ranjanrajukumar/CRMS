import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth/authUtils";

export const useLogout = () => {
  const navigate = useNavigate();

  const performLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return performLogout;
};
