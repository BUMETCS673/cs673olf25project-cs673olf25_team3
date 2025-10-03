import React from "react";
import '../util.js';


export default function FriendsList({friends}) {
  var listItems;
  if (friends){
      listItems = friends.map(friend =>
      <li>
        <img
          src={"https://fastly.picsum.photos/id/547/200/300.jpg?hmac=O1sHSqamP2AYNG_ADzB7uKiGjh_fmg-Xq4v2KEapg_k"}
          alt={friend.name}
        />
      </li>
      )
  }
  return (
        <ul>{listItems}</ul>
    )
}