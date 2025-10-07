"""
users views

This module exposes user-facing endpoints used by the frontend and tests:
- POST /register/        -> create a new user and return JWT tokens
- GET  /profile/         -> current authenticated user's profile
- GET  /users/           -> list users (minimal public fields)
- GET  /users/<user_id>/ -> public profile for a specific user

Notes:
- All endpoints return JSON (JSONRenderer is used)
- List/detail endpoints intentionally expose only minimal public fields
    (id, username, first_name, last_name) for privacy
"""
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from django.contrib.auth import get_user_model
from ..serializers.auth_serializer import UserRegistrationSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
# from django.shortcuts import render

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
    # Validate request payload and create the user using the registration serializer
    # (it handles password hashing and confirm checks).
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
    # Return the serialized profile for the currently authenticated user
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# New endpoints: list users and get user detail
@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def list_users(request):
    """
    List users for frontend user search.

    Returns a list of users with minimal public fields:
    - id (string)
    - username
    - first_name
    - last_name
    """
    # Basic pagination/search could be implemented later. For now return all users
    users = User.objects.all()

    # Use the existing UserSerializer to normalize field names.
    serializer = UserSerializer(users, many=True)

    # Only expose a minimal subset for privacy and frontend needs
    # The serializer may present the user's primary key under different names
    # depending on the auth backend; try common keys and fall back to username
    data = [
        {
            'id': u.get('id') or u.get('pk') or u.get('user_id') or u.get('username'),
            'username': u.get('username'),
            'first_name': u.get('first_name', ''),
            'last_name': u.get('last_name', ''),
        }
        for u in serializer.data
    ]

    return Response(data)


@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def get_user(request, user_id):
    """
    Get public profile for a user by id (string). Returns the same minimal fields
    as list_users for use by the frontend when showing search results or profiles.
    """
    # Lookup the user by primary key (string form); return 404 if missing
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Normalize serialized data to the minimal public shape used by the frontend
    serializer = UserSerializer(user)
    u = serializer.data
    data = {
        'id': u.get('id') or u.get('pk') or u.get('user_id') or u.get('username'),
        'username': u.get('username'),
        'first_name': u.get('first_name', ''),
        'last_name': u.get('last_name', ''),
    }

    return Response(data)