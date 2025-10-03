export default function addFriends(notFriends){
  const listItems = notFriends.map(notFriend =>
    <li>
      <img
        src={"https://picsum.photos/200"}
        alt={notFriend.name}
      />
    </li>
  );
  return (
        <ul>{listItems}</ul>
    )
}