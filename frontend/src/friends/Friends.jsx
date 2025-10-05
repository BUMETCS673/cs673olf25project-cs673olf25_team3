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
  const [allUsers, setAllUsers] = useState([]);
  const [unconnectedUsers, setUnconnectedUsers] = useState([])
  const [friends, setFriends] = useState([]);



    //Load users from API
  const loadAllUsers = async () => {
    if (!auth.accessToken) return;
    const result = await getUsers(auth.accessToken);
    if (!result.errorMessage) {
      setAllUsers(result);
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
    loadAllUsers();
    loadFriends();
  }, [auth.accessToken]);

  useEffect(() => {
    let filteredUsers = allUsers.slice();
    
    let excludedIds = [friends.current_user_id]
    if (friends.friends){
      let currentFriendIds = friends.friends.map(friend => friend.id);
      excludedIds= excludedIds.concat(currentFriendIds)
    }
    if (friends.incoming_requests) {
      let receivedRequestIds = friends.incoming_requests.map(user => user.id);
      excludedIds = excludedIds.concat(receivedRequestIds)
    }
    if (friends.outgoing_requests){
      let sentRequestIds = friends.outgoing_requests.map(user => user.id);
      excludedIds =excludedIds.concat(sentRequestIds)
    }
    filteredUsers  = filteredUsers.filter((user) => {!(user.id in excludedIds)})
    setUnconnectedUsers(filteredUsers)
  }, [allUsers, friends])

  

  return (
    <div>
      <h1>Friends</h1>

      <div>
        <h2>Current Friends:</h2>
        <FriendsList friends={friends.friends} variant={"current"} loadFriends={loadFriends}></FriendsList>
      </div>

      <div>
        <h2>Add Friends:</h2>
        <FriendsList friends={unconnectedUsers}  variant={"send"} loadFriends={loadFriends}></FriendsList>
      </div>

      <div>
        <h2>Received Friend Requests:</h2>
        <FriendsList friends={friends.incoming_requests} variant={"receive"} loadFriends={loadFriends}></FriendsList>
      </div>

      <div>
        <h2>Sent Friend Requests:</h2>
        <FriendsList friends={friends.outgoing_requests} variant={null} loadFriends={loadFriends}></FriendsList>
      </div>
    </div>
  );
}
