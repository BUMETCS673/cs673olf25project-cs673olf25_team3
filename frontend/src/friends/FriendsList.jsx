import React from "react";
import '../util.js';
import { Button } from "@mui/material";

function VariantButtons({variant}){
  switch (variant) {
  case "current":
    return <Button>Remove</Button>
  case "receive":
    return  <><Button>Accept</Button><Button>Ignore</Button></>
  case "send":
    return  <Button>Send</Button>
  }
}

export default function FriendsList({friends, variant}) {
  var listItems;
  if (friends){
      listItems = friends.map(friend =>
      <li key={friend.id}>
        {/* <img
          src={"https://fastly.picsum.photos/id/547/200/300.jpg?hmac=O1sHSqamP2AYNG_ADzB7uKiGjh_fmg-Xq4v2KEapg_k"}
          alt={friend.name}
        /> */}
        {friend.username}
        <VariantButtons variant={variant}/>
      </li>
      )
  }
  return (
        <ul>{listItems}</ul>
    )
}