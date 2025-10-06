# Framework-generated: 0%
# Human-written: 80%
# AI-generated: 20% 
#   - friends_list mapping - https://chatgpt.com/share/68e43fe0-a35c-8008-a40b-0819cd77e982

from django.db import models
from bson import ObjectId
from api.models.friends_models import Friend
from api.utils.mongo import get_collection, query_collection

friends = get_collection('api_friend')

def get_friends(user_id):
    """
    Get a list of friends for a given user

    Args:
        user_id (string) - the user id to query friends list

    Returns:
        (list) - a list of the query result
    """
    query = {
        "$and": [
            { "status": "accepted" }, 
            {
                "$or": [
                    { "sender_id": ObjectId(user_id) }, 
                    { "receiver_id": ObjectId(user_id) }
                ]
            }
        ]
    }

    result = list(query_collection(friends, query))

    friends_list = [
        # If the current user is the sender, select the receiver_id
        conn['receiver_id']
        if conn['sender_id'] == user_id
        # Otherwise (if the current user is the receiver), select the sender_id
        else conn['sender_id']
        
        # Iterate over all connections
        for conn in result
        
        # Filter: ONLY include documents where the status is 'accepted'
        if conn['status'] == 'accepted' and (
            conn['sender_id'] == user_id or 
            conn['receiver_id'] == user_id
        )
    ]

    return friends_list
