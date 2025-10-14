/*

AI-generated: 0%
Human-written: 100% (function: Logout; logic: call logout on mount)

Notes:
- Entire component is human-written.
- Simple effect calls the logout function from AuthContext when the component mounts.
- Returns null since it only performs the side-effect of logging out.

*/
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
