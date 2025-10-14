// 
// human-generated: 100%

import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "./endpoints/getProfile";
import { useAuth } from "../auth/AuthContext";

interface UserLinkProps {
  children: ReactNode;
  userId: string;
}


export default function UserLink({ children, userId }: UserLinkProps){
      const [path, setPath] = useState<any>(null);

    
    useEffect(() => {
        setPath("/users/"+userId)
    }, [])


    
    return (
        <Link to={{pathname: path}}>{children}</Link>
    )
}