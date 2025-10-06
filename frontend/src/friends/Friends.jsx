import React from "react";
// import FriendsList from "./FriendsList.jsx";
import User from '../util.js';
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUsers } from "./endpoints/getUsers.js";
import { getFriends } from "./endpoints/getFriends.js";
import { SendFriendRequest } from "./endpoints/sendFriendRequest.js";
import { DeleteFriend } from "./endpoints/deleteFriend.js";
import { RespondToFriendRequest } from "./endpoints/respondToFriendRequest.js";
import { Button } from "@mui/material";


export default function Friends() {

  const { auth } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [unconnectedUsers, setUnconnectedUsers] = useState([])
  const [triggerchanges, setTriggerChanges]= useState(false)
  const [friends, setFriends] = useState([]);


  useEffect(() => {
    const interval = setInterval(() => {
      updateUsersAndFriends();
    }, 20000);

    return () => clearInterval(interval);
  }, [])

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

  const updateUsersAndFriends =  async () => {
    setTimeout(() => {
      loadAllUsers();
      loadFriends();
    }, "500");
    
  }

  useEffect(() => {

    updateUsersAndFriends();
  }, [auth.accessToken, triggerchanges]);

  useEffect(() => {
    if (allUsers.length > 0){
      var filteredUsers = allUsers.slice();
    
      var excludedIds = [friends.current_user_id]
      if (friends.friends){
        var currentFriendIds = friends.friends.map(friend => friend.id);
        excludedIds= excludedIds.concat(currentFriendIds)
      }
      if (friends.incoming_requests) {
        var receivedRequestIds = friends.incoming_requests.map(user => user.id);
        excludedIds = excludedIds.concat(receivedRequestIds)
      }
      if (friends.outgoing_requests){
        var sentRequestIds = friends.outgoing_requests.map(user => user.id);
        excludedIds =excludedIds.concat(sentRequestIds)
      }
      filteredUsers  = filteredUsers.filter((user) => !(excludedIds.includes(user.id)))
      setUnconnectedUsers(filteredUsers)
    }

  }, [allUsers, friends])

    function VariantButtons({variant, userID, requestID}){

      switch (variant) {
      case "current":
        return <Button onClick={()=>{DeleteFriend(userID, auth.accessToken).then(updateUsersAndFriends(), )}}>Remove</Button>
      case "receive":
        return  <><Button onClick={()=>{RespondToFriendRequest(requestID, 'accept', auth.accessToken).then(updateUsersAndFriends(), )}}>Accept</Button><Button onClick={()=>{RespondToFriendRequest(requestID, 'reject', auth.accessToken).then(updateUsersAndFriends(), )}}>Ignore</Button></>
      case "send":
        return  <Button onClick={()=>{SendFriendRequest(userID, auth.accessToken).then(updateUsersAndFriends(), )}}>Send</Button>
      default:
        return 
      }
    }

    function FriendsList({friends, variant}) {

      var listItems;
      if (friends){
          listItems = friends.map(friend =>
          <li key={friend.id}>
            {friend.username}
            <VariantButtons variant={variant} userID={friend.id} requestID={friend.request_id}/>
          </li>
          )
      }
      return (
            <ul>{listItems}</ul>
        )
    }

  

  return (
    <div>
      <h1>Friends</h1>

      <div>
        <h2>Current Friends:</h2>
        <FriendsList friends={friends.friends} variant={"current"}></FriendsList>
      </div>

      <div>
        <h2>Add Friends:</h2>
        <FriendsList friends={unconnectedUsers}  variant={"send"}></FriendsList>
      </div>

      <div>
        <h2>Received Friend Requests:</h2>
        <FriendsList friends={friends.incoming_requests} variant={"receive"}></FriendsList>
      </div>

      <div>
        <h2>Sent Friend Requests:</h2>
        <FriendsList friends={friends.outgoing_requests} variant={null}></FriendsList>
      </div>
    </div>
  );
}
