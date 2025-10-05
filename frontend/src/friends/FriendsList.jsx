import React from "react";
import '../util.js';
import { Button } from "@mui/material";
import { SendFriendRequest } from "./endpoints/sendFriendRequest.js";
import { DeleteFriend } from "./endpoints/deleteFriend.js";
import { RespondToFriendRequest } from "./endpoints/respondToFriendRequest.js";
import { useAuth } from "../auth/AuthContext";

function VariantButtons({variant, userID, loadFriends}){
  const { auth } = useAuth();

  switch (variant) {
  case "current":
    return <Button onClick={()=>{DeleteFriend(userID, auth.accessToken); loadFriends()}}>Remove</Button>
  case "receive":
    return  <><Button onClick={()=>{RespondToFriendRequest(userID, 'accept', auth.accessToken); loadFriends()}}>Accept</Button><Button onClick={()=>{RespondToFriendRequest(userID, 'reject', auth.accessToken); loadFriends()}}>Ignore</Button></>
  case "send":
    return  <Button onClick={()=>{SendFriendRequest(userID, auth.accessToken); loadFriends()}}>Send</Button>
  default:
    return 
  }
}

export default function FriendsList({friends, variant, loadFriends}) {



  var listItems;
  if (friends){
      listItems = friends.map(friend =>
      <li key={friend.id}>
        {friend.username}
        <VariantButtons variant={variant} userID={friend.id} loadFriends={loadFriends}/>
      </li>
      )
  }
  return (
        <ul>{listItems}</ul>
    )
}