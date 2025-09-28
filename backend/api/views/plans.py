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

plans_collection = get_collection('plans')

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



