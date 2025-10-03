"""
api.views.friends
API endpoints for managing friendships:
- Send and respond to friend requests
- List accepted and pending friendships
- Remove friendships or cancel requests

Notes:
Responses are JSON-only (@renderer_classes([JSONRenderer])) and all
endpoints require authentication. Provides validation for duplicates,
authorization checks, and consistent status codes
"""

# Framework-generated: 0%
# Human-written: 60%
# AI-generated: 40% 

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import models
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from api.models.friends_models import Friend

User = get_user_model()

# Send a friend request 
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def send_friend_request(request, user_id):
    if str(request.user.id) == str(user_id): # Prevent users from friending themselves
        return Response({'detail': "Cannot send request to yourself"}, status=status.HTTP_400_BAD_REQUEST)

    to_user = get_object_or_404(User, pk=user_id)

    # check for duplicates or already accepted friendships
    if Friend.objects.filter(sender=request.user, receiver=to_user).exists() or \
       Friend.objects.filter(sender=to_user, receiver=request.user, status='accepted').exists():
        return Response({'detail': "Friend request already exists or already friends"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create the pending friend request
    fr = Friend.objects.create(sender=request.user, receiver=to_user, status='pending')
    return Response({'id': str(fr.pk), 'sender': str(fr.sender.pk), 'receiver': str(fr.receiver.pk), 'status': fr.status},
                    status=status.HTTP_201_CREATED)

# Respond to a friend request
@api_view(['POST'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def respond_to_friend_request(request, request_id):
    action = request.data.get('action')
    if action not in ('accept', 'reject'):
        return Response({'detail': "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

    fr = get_object_or_404(Friend, pk=request_id)

    # only receiver can respond
    if fr.receiver != request.user:
        return Response({'detail': "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    fr.status = 'accepted' if action == 'accept' else 'rejected'
    fr.save()
    return Response({'id': str(fr.pk), 'status': fr.status}, status=status.HTTP_200_OK)

# List accepted friends and pending requests for the authenticated user
# Returns three lists: friends (accepted), pending_sent, pending_received
@api_view(['GET'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def list_friends(request):
    user = request.user

    # gather accepted friends where user is sender or receiver
    friends_qs = Friend.objects.filter(status='accepted').filter(
        models.Q(sender=user) | models.Q(receiver=user)
    )
    friends = []
    for f in friends_qs:
        # Figure out which user is "the other friend" in the relationship
        other = f.receiver if f.sender == user else f.sender
        friends.append({'id': str(f.pk), 'friend_id': str(other.pk), 'status': f.status})

    # pending sent and pending received lists
    pending_sent_qs = Friend.objects.filter(sender=user, status='pending')
    pending_received_qs = Friend.objects.filter(receiver=user, status='pending')

    # Normalize to JSON-serializable dicts
    pending_sent = [{'id': str(p.pk), 'receiver_id': str(p.receiver.pk), 'status': p.status} for p in pending_sent_qs]
    pending_received = [{'id': str(p.pk), 'sender_id': str(p.sender.pk), 'status': p.status} for p in pending_received_qs]

    return Response({
        'friends': friends,
        'pending_sent': pending_sent,
        'pending_received': pending_received
    }, status=status.HTTP_200_OK)


# Remove a friend or cancel a friend request
@api_view(['DELETE'])
@renderer_classes([JSONRenderer])
@permission_classes([IsAuthenticated])
def remove_friend(request, friend_id):
    fr = get_object_or_404(Friend, pk=friend_id)
    if fr.sender != request.user and fr.receiver != request.user: # only participants in the friendship can delete it
        return Response({'detail': "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    # Deleting removes either a pending request or an accepted friendship
    fr.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
