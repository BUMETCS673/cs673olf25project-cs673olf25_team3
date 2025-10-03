# Framework-generated: 0%
# Human-written: 70%
# AI-generated: 30% 
#   - add user id in serializer - https://chatgpt.com/share/68d97938-262c-8000-a3e5-4dd21b8d81f8
#   - allowed_fields - https://chatgpt.com/share/68d98383-b998-8008-a1a2-5d14c6b68f2a

from api.serializers.plans_serializer import PlansSerializer
from api.utils.mongo import get_collection
from bson import ObjectId
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import logging
logger = logging.getLogger(__name__)


def get_plans_collection():
    return get_collection('plans')

plans_collection = get_plans_collection();

@api_view(['POST'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def create_plan(request):
    # copy the request payload
    data = request.data.copy()

    # add the user id to the payload
    data['created_by'] = str(request.user.id)

    # serialize the payload
    serializer = PlansSerializer(data=data)
    
    # validate the payload
    if serializer.is_valid():
        try:
            data = dict(serializer.validated_data)

            allowed_fields = ["title", "description", "location", "start_time", "end_time","created_by"]
            plan_data = {key: data[key] for key in allowed_fields if key in data}

            # save the data
            result = plans_collection.insert_one(plan_data)

            return Response({
                "message": "Plan created",
                "id": str(result.inserted_id),
                "data": data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error inserting plan into MongoDB")
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def get_plans(request):
    plans = list(plans_collection.find({}))

    # change plans ids to string
    for plan in plans:
        plan["_id"] = str(plan["_id"])

    return Response(plans, status=status.HTTP_200_OK)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def get_plans_by_id(request, plan_id):
    try:
        plan = plans_collection.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return Response({"error": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not plan:
        return Response({"error": "Plan not found"},status=status.HTTP_404_NOT_FOUND )
    
    # Santize the id
    plan["_id"] = str(plan["_id"])

    return Response({"data": plan}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def update_plan(request, plan_id):
    try:
        id = ObjectId(plan_id)  # Convert string ID to ObjectId
    except Exception:
        return Response({"error": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)
    
    result = plans_collection.update_one(
        {"_id": id},
        {"$set": request.data}
    )

    if result.matched_count == 0:
        return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)

    plan = plans_collection.find_one({"_id": id})
    plan["_id"] = str(plan["_id"])  # convert ObjectId to string

    return Response({"data": plan}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def delete_plan(request, plan_id):
    try:
        id = ObjectId(plan_id)
    except Exception:
        return Response({"error": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)
    
    result = plans_collection.delete_one({"_id": id})

    if result.deleted_count == 0:
        return Response({"error": "Plan not found"},status=status.HTTP_404_NOT_FOUND )

    return Response({"message": f"Event {id} deleted successfully"}, status=status.HTTP_200_OK)
