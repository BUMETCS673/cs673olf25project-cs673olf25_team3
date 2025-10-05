import React from "react";
import FriendsList from "./FriendsList.jsx";
import User from '../util.js';
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUsers } from "./endpoints/getUsers.js";
import { getFriends } from "./endpoints/getFriends.js";
import { GetUserByID } from "./endpoints/getUserByID.js";


export default function Friends() {

  //   const friends = [].filter(user =>
  //   user.isFriends(myself)
  // );

  // const notFriends = [].filter(user =>
  //   !user.isFriends(myself)
  // );

  const { auth } = useAuth();
  const [otherUsers, setOtherUsers] = useState([]);
  const [friends, setFriends] = useState([]);



    //Load users from API
  const loadOtherUsers = async () => {
    if (!auth.accessToken) return;
    const result = await getUsers(auth.accessToken);
    if (!result.errorMessage) {
      setOtherUsers(result);
    } else {
      console.error(result.errorMessage);
    }
  };

  const loadFriends = async () => {
    if (!auth.accessToken) return;
    const result = await getFriends(auth.accessToken);
    if (!result.errorMessage) {
      setFriends(result);
    } else {
      console.error(result.errorMessage);
    }
  };

  useEffect(() => {
    loadOtherUsers();
    loadFriends();
  }, [auth.accessToken]);

  

  return (
    <div >
      <h1>Friends</h1>

      <div>
        <h2>Current Friends:</h2>
        <FriendsList friends={friends.friends} variant={"current"}></FriendsList>
      </div>

      <div>
        <h2>Add Friends:</h2>
        <FriendsList friends={otherUsers}  variant={"send"}></FriendsList>
      </div>

      <div>
        <h2>Received Friend Requests:</h2>
        <FriendsList friends={friends.pending_received} variant={"receive"}></FriendsList>
      </div>

      <div>
        <h2>Sent Friend Requests:</h2>
        <FriendsList friends={friends.pending_sent} variant={null}></FriendsList>
      </div>
    </div>
  );
}
