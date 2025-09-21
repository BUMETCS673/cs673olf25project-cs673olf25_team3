export default class User {
    name;
    biography;
    profilePicture;
    interests = [];
    friends = [];
    
    constructor(name){
        this.name = name;
    }

    setBiography(text){
        this.biography = text;
    }

    setProfilePicture(fileName){
        this.profilePicture = fileName;
    }

    addFriend(user){
        this.friends.push(user);
    }

    removeFriend(user){
        this.friends = this.friends.filter(friend => friend != user);
    }

    isFriends(user){
        return this.friends.includes(user)
    }
}