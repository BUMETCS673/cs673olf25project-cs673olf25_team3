import React from "react";
import FriendsList from "./FriendsList.jsx";
import User from '../util.js';
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUsers } from "./endpoints/getUsers.js";
import { getFriends } from "./endpoints/getFriends.js";


export default function Friends() {
  //   var myself =  new User("David");

  //   const friends = [].filter(user =>
  //   user.isFriends(myself)
  // );

  // const notFriends = [].filter(user =>
  //   !user.isFriends(myself)
  // );

  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);



    //Load users from API
  const loadUsers = async () => {
    if (!auth.accessToken) return;
    setLoading(true);
    const result = await getUsers(auth.accessToken);
    if (!result.errorMessage) {
      setUsers(result);
    } else {
      console.error(result.errorMessage);
    }
    setLoading(false);
  };

  const loadFriends = async () => {
    if (!auth.accessToken) return;
    setLoading(true);
    const result = await getFriends(auth.accessToken);
    if (!result.errorMessage) {
      setFriends(result);
    } else {
      console.error(result.errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
    loadFriends();
  }, [auth.accessToken]);

  

  return (
    <div >
      <h1>Friends</h1>

      <div>
        <h2>Current Friends:</h2>
        {/* <FriendsList friends={users} variant={"current"}></FriendsList> */}
        <FriendsList friends={friends.friends} variant={"current"}></FriendsList>
      </div>

      <div>
        <h2>Add Friends:</h2>
        <FriendsList friends={users}  variant={"send"}></FriendsList>
      </div>

      <div>
        <h2>Friend Requests:</h2>
        {/* <FriendsList friends={users} variant={"receive"}></FriendsList> */}
        <FriendsList friends={friends.incoming_requests} variant={"receive"}></FriendsList>
      </div>
    </div>
  );
}
