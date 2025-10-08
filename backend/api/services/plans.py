# Framework-generated: 0%
# Human-written: 100%
# AI-generated: 0% 

from datetime import datetime, timezone
from bson import ObjectId
from pymongo.errors import PyMongoError
from api.serializers.plans_serializer import PlansSerializer
from api.utils.datetime import parse_datetime_utc
from api.utils.mongo import add_document, delete_document, get_collection, query_collection, query_one, update_document
from api.services.friends import get_friends

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
    result = list(query_collection(plans, query, {"start_time": 1}))

    return result


def add_plan(data):

    data = dict(data)

    allowed_fields = ["title", "description", "location", "start_time", "end_time","created_by", "created_at"]
    plan_data = {key: data[key] for key in allowed_fields if key in data}

    # save the data
    result = add_document(plans, plan_data)
    plan_data["_id"] = str(result.inserted_id)

    return {"status": 201, "message": "Plan created", "data": plan_data}


def update_user_plan(user_id, plan_id, data):
    """
    Updates a plan if it belongs to the loggedin user.

    Args:
        user_id (string) - filter values for the query parameters
        plan_id (string) - the id of the user
        data (dictionary) - the data to update plan

    Returns:
        (dictionary) - the updated plan
    """
    if not isinstance(plan_id, ObjectId):
        plan_id = ObjectId(plan_id)

    if not isinstance(user_id, ObjectId):
        user_id = ObjectId(user_id)

    try: 
        plan = query_one(plans, {"_id": plan_id})
        
        # check if plan exists
        if not plan:
            return {"status": 404, "error": "Plan not found."}

        # check if user created the plan
        if ObjectId(plan.get("created_by")) != user_id:
            return {"status": 403, "error": "User unauthorized to update this plan."}
    
        query = {"_id": plan_id}
        updated_data = {"$set": data}

        # updates the plan
        result = update_document(plans, query, updated_data)

        if result.matched_count == 0:
            return {"status": 404, "error": "Plan not found"}
        else:
            plan = plans.find_one({"_id": plan_id})
            plan["_id"] = str(plan["_id"])  # convert ObjectId to string
            return {
                "status": 200, 
                "message": f"Plan {str(plan_id)} updated successfully.", 
                "data": plan
            }

    except PyMongoError as e:
        return {"status": 500, "error": f"Database error: {e}"}
    
    except Exception as e:
        return {"status": 500, "error": f"Unexpected error: {e}"}


def delete_plan_by_user(user_id, plan_id):
    """
    Deletes a plan if it belongs to the loggedin user.

    Args:
        user_id (string) - filter values for the query parameters
        user (string) - the id of the user

    Returns:
        (list) - a list of plans based on the filter
    """
    # check if user owns plans

    if not isinstance(plan_id, ObjectId):
        plan_id = ObjectId(plan_id)

    if not isinstance(user_id, ObjectId):
        user_id = ObjectId(user_id)

    try: 
        plan = query_one(plans, {"_id": plan_id})

        # check if plan exists
        if not plan:
            return {"status": 404, "error": "Plan not found."}

        # check if user created the plan
        if ObjectId(plan.get("created_by")) != user_id:
            return {"status": 403, "error": "User unauthorized to delete this plan."}
    
        # delete the plan
        result = delete_document(plans, {"_id": plan_id})

        # successful deletion
        if result.deleted_count > 0:
            return {"status": 200, "message": f"Plan {str(plan_id)} deleted successfully."}
        else:
            # Plan may have been deleted between find and delete
            return {"status": 404, "error": "Plan not found during deletion."}
    
    except PyMongoError as e:
        return {"status": 500, "error": f"Database error: {e}"}
    
    except Exception as e:
        return {"status": 500, "error": f"Unexpected error: {e}"}