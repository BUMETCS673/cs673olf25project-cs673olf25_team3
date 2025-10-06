"""
Tests for the Friends API endpoints

Module uses pytest with Djangos test database to validate these core friendship functionalities:
- Sending and preventing duplicate friend requests
- Responding to requests (accept/invalid actions)
- Listing accepted and pending friends
- Removing friends and cleaning up records
"""
# Framework-generated: 0%
# Human-written: 70%
# AI-generated: 30%


import pytest
from rest_framework import status
from api.models.friends_models import Friend


@pytest.mark.django_db
def test_send_friend_request(auth_client, create_user):
    client, user1 = auth_client
    user2 = create_user('testuser2', 'test2@test.com', 'testpass123')

    resp = client.post(f'/api/friends/request/{user2.id}/')
    assert resp.status_code == status.HTTP_201_CREATED
    assert Friend.objects.count() == 1

    # duplicate
    resp = client.post(f'/api/friends/request/{user2.id}/')
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_reciprocal_request_auto_accept(auth_client, create_user):
    """If user2 already sent a pending request to user1, when user1 sends a request back
    the system should accept the existing pending request instead of creating a duplicate."""
    client, user1 = auth_client
    user2 = create_user('recip', 'recip@test.com', 'pass123')

    # user2 -> user1 pending
    fr = Friend.objects.create(sender=user2, receiver=user1, status='pending')

    # user1 sends a request to user2; this should accept the reciprocal
    resp = client.post(f'/api/friends/request/{user2.id}/')
    assert resp.status_code == status.HTTP_200_OK
    fr.refresh_from_db()
    assert fr.status == 'accepted'
    # still only one Friend record
    assert Friend.objects.count() == 1


@pytest.mark.django_db
def test_respond_to_friend_request(auth_client, create_user):
    client, user1 = auth_client
    user2 = create_user('testuser2b', 'test2b@test.com', 'testpass123')

    friend_request = Friend.objects.create(sender=user2, receiver=user1, status='pending')

    resp = client.post(f'/api/friends/respond/{friend_request.id}/', {'action': 'accept'})
    assert resp.status_code == status.HTTP_200_OK
    assert Friend.objects.get(id=friend_request.id).status == 'accepted'

    # invalid action
    resp = client.post(f'/api/friends/respond/{friend_request.id}/', {'action': 'invalid'})
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_list_friends(auth_client, create_user):
    client, user1 = auth_client
    user2 = create_user('user3', 'test3@test.com', 'pass123')
    fr_out = Friend.objects.create(sender=user1, receiver=user2, status='pending')
    fr_in = Friend.objects.create(sender=create_user('user4', 'test4@test.com', 'pass123'), receiver=user1, status='pending')
    Friend.objects.create(sender=user1, receiver=create_user('user5', 'test5@test.com', 'pass123'), status='accepted')

    resp = client.get('/api/friends/list/')
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.data['friends']) == 1
    # outgoing/incoming request shapes include both the user id and the Friend record id
    assert len(resp.data['outgoing_requests']) == 1
    assert len(resp.data['incoming_requests']) == 1

    out = resp.data['outgoing_requests'][0]
    inc = resp.data['incoming_requests'][0]

    # outgoing 'id' should equal the receiver user id and 'request_id' should equal Friend.pk
    assert out['id'] == str(fr_out.receiver.pk)
    assert out['request_id'] == str(fr_out.pk)

    # incoming 'id' should equal the sender user id and 'request_id' should equal Friend.pk
    assert inc['id'] == str(fr_in.sender.pk)
    assert inc['request_id'] == str(fr_in.pk)


@pytest.mark.django_db
def test_remove_friend(auth_client, create_user):
    client, user1 = auth_client
    user2 = create_user('user6', 'test6@test.com', 'pass123')
    friendship = Friend.objects.create(sender=user1, receiver=user2, status='accepted')

    resp = client.delete(f'/api/friends/remove/{friendship.id}/')
    assert resp.status_code == status.HTTP_204_NO_CONTENT
    assert Friend.objects.count() == 0
