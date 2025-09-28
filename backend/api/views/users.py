# from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from django.contrib.auth import get_user_model
from ..serializers.auth_serializer import UserRegistrationSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Framework-generated: 10%
# Human-written: 30%
# AI-generated: 65%
User = get_user_model()

@api_view(['POST'])
@renderer_classes([JSONRenderer])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()  # this already hashes password & checks confirm

        # generate JWT tokens for this user
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User registered successfully",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current user profile
    """
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)