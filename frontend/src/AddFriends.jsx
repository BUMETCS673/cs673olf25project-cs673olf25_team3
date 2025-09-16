export default function addFriends(notFriends){
  const listItems = notFriends.map(notFriend =>
    <li>
      <img
        src={getImageUrl(notFriend)}
        alt={notFriend.name}
      />
    </li>
  );
  return (
        <ul>{listItems}</ul>
    )
}