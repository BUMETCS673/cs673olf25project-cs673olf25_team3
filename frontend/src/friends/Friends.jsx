import React from "react";
import FriendsList from "./FriendsList.jsx";
import User from '../util.js';
import { useEffect, useState } from "react";


export default function Friends() {
    var myself =  new User("David");

    const friends = [].filter(user =>
    user.isFriends(myself)
  );

  const notFriends = [].filter(user =>
    !user.isFriends(myself)
  );

  
  // const [users, setUsers] = useState<Array>([]);
  // const [loading, setLoading] = useState(true);



  //   //Load users from API
  // const loadUsers = async () => {
  //   if (!auth.accessToken) return;
  //   setLoading(true);
  //   const result = await getUsers(auth.accessToken);
  //   if (!result.errorMessage) {
  //     setUsers(result);
  //   } else {
  //     console.error(result.errorMessage);
  //   }
  //   setLoading(false);
  // };

  

  return (
    <div >
      <h1>Friends</h1>

      <div>
        <h2>Current Friends:</h2>
        <FriendsList friends={friends}></FriendsList>
      </div>

      <div>
        <h2>Add Friends:</h2>
        <FriendsList notFriends={notFriends}></FriendsList>
      </div>

      <div>
        <h2>Friend Requests:</h2>
        <FriendsList notFriends={notFriends}></FriendsList>
      </div>
    </div>
  );
}
