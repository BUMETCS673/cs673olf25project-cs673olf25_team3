from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models.friends_models import Friend

User = get_user_model()

class FriendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@test.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@test.com',
            password='testpass123'
        )
        
        # Authenticate user1
        response = self.client.post('/api/token/', {
            'username': 'testuser1',
            'password': 'testpass123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_send_friend_request(self):
        response = self.client.post(f'/api/friends/request/{self.user2.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Friend.objects.count(), 1)
        
        # Try sending duplicate request
        response = self.client.post(f'/api/friends/request/{self.user2.id}/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_respond_to_friend_request(self):
        # Create a friend request
        friend_request = Friend.objects.create(
            sender=self.user2,
            receiver=self.user1,
            status='pending'
        )
        
        # Accept the request
        response = self.client.post(f'/api/friends/respond/{friend_request.id}/', {
            'action': 'accept'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Friend.objects.get(id=friend_request.id).status, 'accepted')
        
        # Try invalid action
        response = self.client.post(f'/api/friends/respond/{friend_request.id}/', {
            'action': 'invalid'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_friends(self):
        # Create some friend requests in different states
        Friend.objects.create(sender=self.user1, receiver=self.user2, status='pending')
        Friend.objects.create(
            sender=User.objects.create_user('user3', 'test3@test.com', 'pass123'),
            receiver=self.user1,
            status='pending'
        )
        Friend.objects.create(
            sender=self.user1,
            receiver=User.objects.create_user('user4', 'test4@test.com', 'pass123'),
            status='accepted'
        )
        
        response = self.client.get('/api/friends/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['friends']), 1)
        self.assertEqual(len(response.data['pending_sent']), 1)
        self.assertEqual(len(response.data['pending_received']), 1)

    def test_remove_friend(self):
        # Create an accepted friendship
        friendship = Friend.objects.create(
            sender=self.user1,
            receiver=self.user2,
            status='accepted'
        )
        
        response = self.client.delete(f'/api/friends/remove/{friendship.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Friend.objects.count(), 0)