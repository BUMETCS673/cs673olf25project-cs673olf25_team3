// AI-generated: 0%
// Human-written: 100%
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
        logout();
  }, []);

  return null;
}

export default Logout;
