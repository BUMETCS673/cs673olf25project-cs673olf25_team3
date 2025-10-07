# Framework-generated: 0%
# Human-written: 100%
# AI-generated: 0% 

from datetime import datetime, timezone
from api.utils.mongo import get_collection, query_collection
from api.services.friends import get_friends
from api.utils.datetime import parse_datetime_utc

plans = get_collection('plans')

def get_all_plans():
    """
    Get all plans from the database

    Returns:
        (list) - a list of the query result
    """
    result = list(query_collection(plans, {}))
    return result


def get_filtered_plans(filters, user):
    """
    Filters a query of plans based on the loggedin user and their friends with a start and end time.

    Args:
        filters (dictionary) - filter values for the query parameters
        user (string) - the id of the user

    Returns:
        (list) - a list of plans based on the filter
    """
    # set start and end date filters
    start = parse_datetime_utc(filters.get("start_time"), default=datetime.now(timezone.utc))
    end = parse_datetime_utc(filters.get("end_time"))

    start_filter = {"$gte": start}
    if end:
        start_filter["$lte"] = end
    
    end_filter= [
        {"end_time": {"$gte": start}},
        {"end_time": {"$exists": False}}, 
        {"end_time": None} 
    ]

    get_query_friends = filters.get("friends")

    # set user and friends filters
    if get_query_friends and get_query_friends.lower() in ['true', '1']:
        friends_list = get_friends(user)

        if friends_list is None:
            friends_list = [] 
        created_bys = [str(user)] + [str(friend) for friend in friends_list]
    else:
        created_bys = [str(user)]

    # create the query
    query = {
        "$and": [
            {"start_time": start_filter},
            {"$or": end_filter},
            {"created_by": { "$in": created_bys }}
        ]
    }

    # get the result
    result = list(query_collection(plans, query))

    return result

