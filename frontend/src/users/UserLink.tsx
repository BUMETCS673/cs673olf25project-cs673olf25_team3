
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "./endpoints/getProfile";
import { useAuth } from "../auth/AuthContext";

interface UserLinkProps {
  children: ReactNode;
  userId: string;
}


export default function UserLink({ children, userId }: UserLinkProps){
      const { auth } = useAuth();
      const [path, setPath] = useState<any>(null);
      const [profile, setProfile] = useState<any>(null)
    

    useEffect(() => {
        if (auth.accessToken) {
            async function loadUserBio() {
                const result = await getProfile(auth.accessToken as string);
                if ("errorMessage" in result && result.errorMessage) {
                    console.error(result.errorMessage);
                } else {
                    setProfile(result);
                }
            }
            loadUserBio();
        }
    }, [auth.accessToken]);

    useEffect(() => {
        if (userId == profile?.id){
            setPath("/profile/")
        } else {
            setPath("/users/"+userId)
        }
    }, [profile])


    
    return (
        <Link to={{pathname: path}}>{children}</Link>
    )
}