import React from "react";
import './util.js';


export default function FriendsList({friends}) {
  const listItems = friends.map(friend =>
    <li>
      <img
        src={getImageUrl(friend)}
        alt={friend.name}
      />
    </li>
  );
  return (
        <ul>{listItems}</ul>
    )
}