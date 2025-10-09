"""
Tests for the Users API endpoints

Module uses pytest with Django's test database to validate these core user functionalities:
- User registration with profile fields
- User profile retrieval and updates
- User listing and individual user retrieval
- JWT authentication integration
- Profile field validation and error handling
"""
# Framework-generated: 0%
# Human-written: 20%
# AI-generated: 80%

import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from api.models import UserProfile
from datetime import date
import json

User = get_user_model()


@pytest.mark.django_db
class TestUserRegistration:
    """Test user registration functionality"""
    
    def test_register_user_success(self, api_client):
        """Test successful user registration with all fields"""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "date_of_birth": "1990-01-01",
            "bio": "This is my bio",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert "message" in response.data
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["message"] == "User registered successfully"
        
        # Verify user was created
        user = User.objects.get(username="newuser")
        assert user.email == "newuser@example.com"
        assert user.first_name == "New"
        assert user.last_name == "User"
        
        # Verify profile was created
        profile = UserProfile.objects.get(user=user)
        assert str(profile.date_of_birth) == "1990-01-01"
        assert profile.bio == "This is my bio"
    
    def test_register_user_minimal_data(self, api_client):
        """Test user registration with only required fields"""
        data = {
            "username": "minimaluser",
            "email": "minimal@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verify user was created
        user = User.objects.get(username="minimaluser")
        assert user.email == "minimal@example.com"
        
        # Verify profile was created with default values
        profile = UserProfile.objects.get(user=user)
        assert profile.date_of_birth is None
        assert profile.bio == ""
    
    def test_register_user_password_mismatch(self, api_client):
        """Test registration with mismatched passwords"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password_confirm": "differentpass"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Passwords don't match" in str(response.data)
    
    def test_register_user_duplicate_username(self, api_client, create_user):
        """Test registration with duplicate username"""
        create_user("existinguser", "existing@example.com", "testpass123")
        
        data = {
            "username": "existinguser",
            "email": "new@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "username" in response.data
    
    def test_register_user_duplicate_email(self, api_client, create_user):
        """Test registration with duplicate email"""
        create_user("user1", "existing@example.com", "testpass123")
        
        data = {
            "username": "user2",
            "email": "existing@example.com",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
    
    def test_register_user_invalid_date(self, api_client):
        """Test registration with invalid date format"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "date_of_birth": "invalid-date",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_register_user_bio_too_long(self, api_client):
        """Test registration with bio exceeding max length"""
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "bio": "x" * 501,  # Exceeds 500 character limit
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestUserProfile:
    """Test user profile retrieval and update functionality"""
    
    def test_get_user_profile_success(self, auth_client):
        """Test successful profile retrieval"""
        client, user = auth_client
        
        # Create a profile for the user
        UserProfile.objects.create(
            user=user,
            date_of_birth=date(1990, 1, 1),
            bio="Test bio"
        )
        
        response = client.get('/api/profile/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email
        assert response.data['first_name'] == user.first_name
        assert response.data['last_name'] == user.last_name
        assert response.data['date_of_birth'] == '1990-01-01'
        assert response.data['bio'] == 'Test bio'
        assert 'id' in response.data
        assert 'date_joined' in response.data
    
    def test_get_user_profile_no_profile(self, auth_client):
        """Test profile retrieval when user has no profile"""
        client, user = auth_client
        
        response = client.get('/api/profile/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
        assert response.data['date_of_birth'] is None
        assert response.data['bio'] is None or response.data['bio'] == ''
    
    def test_get_user_profile_unauthorized(self, api_client):
        """Test profile retrieval without authentication"""
        response = api_client.get('/api/profile/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_user_profile_full_update(self, auth_client):
        """Test full profile update (PUT)"""
        client, user = auth_client
        
        # Create initial profile
        UserProfile.objects.create(user=user, bio="Initial bio")
        
        data = {
            "first_name": "Updated First",
            "last_name": "Updated Last",
            "date_of_birth": "1985-05-15",
            "bio": "Updated bio content"
        }
        
        response = client.put('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "Profile updated successfully"
        assert 'user' in response.data
        
        # Verify user fields were updated
        user.refresh_from_db()
        assert user.first_name == "Updated First"
        assert user.last_name == "Updated Last"
        
        # Verify profile fields were updated
        profile = UserProfile.objects.get(user=user)
        assert str(profile.date_of_birth) == "1985-05-15"
        assert profile.bio == "Updated bio content"
    
    def test_update_user_profile_partial_update(self, auth_client):
        """Test partial profile update (PATCH)"""
        client, user = auth_client
        
        # Create initial profile
        UserProfile.objects.create(
            user=user,
            date_of_birth=date(1990, 1, 1),
            bio="Initial bio"
        )
        
        data = {
            "bio": "Only updating bio"
        }
        
        response = client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify only bio was updated
        user.refresh_from_db()
        profile = UserProfile.objects.get(user=user)
        assert profile.bio == "Only updating bio"
        assert str(profile.date_of_birth) == "1990-01-01"  # Should remain unchanged
    
    def test_update_user_profile_create_profile(self, auth_client):
        """Test profile update when user has no existing profile"""
        client, user = auth_client
        
        data = {
            "first_name": "New First",
            "bio": "Creating new profile"
        }
        
        response = client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify profile was created
        profile = UserProfile.objects.get(user=user)
        assert profile.bio == "Creating new profile"
        
        # Verify user field was updated
        user.refresh_from_db()
        assert user.first_name == "New First"
    
    def test_update_user_profile_invalid_date(self, auth_client):
        """Test profile update with invalid date"""
        client, user = auth_client
        
        data = {
            "date_of_birth": "invalid-date"
        }
        
        response = client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_update_user_profile_bio_too_long(self, auth_client):
        """Test profile update with bio exceeding max length"""
        client, user = auth_client
        
        data = {
            "bio": "x" * 501  # Exceeds 500 character limit
        }
        
        response = client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_update_user_profile_unauthorized(self, api_client):
        """Test profile update without authentication"""
        data = {"bio": "Unauthorized update"}
        
        response = api_client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserListing:
    """Test user listing and individual user retrieval functionality"""
    
    def test_list_users_success(self, auth_client, create_user):
        """Test successful user listing"""
        client, user1 = auth_client
        
        # Create additional users with profiles
        user2 = create_user("user2", "user2@example.com", "pass123")
        user3 = create_user("user3", "user3@example.com", "pass123")
        
        # Create profiles for users
        UserProfile.objects.create(user=user2, bio="User 2 bio")
        UserProfile.objects.create(user=user3, bio="User 3 bio")
        
        response = client.get('/api/users/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3  # user1, user2, user3
        
        # Check that all users are included
        usernames = [u['username'] for u in response.data]
        assert 'testuser1' in usernames
        assert 'user2' in usernames
        assert 'user3' in usernames
        
        # Check that bio fields are included
        user2_data = next(u for u in response.data if u['username'] == 'user2')
        assert user2_data['bio'] == 'User 2 bio'
    
    def test_list_users_with_profiles(self, auth_client, create_user):
        """Test user listing includes profile information"""
        client, user1 = auth_client
        
        user2 = create_user("user2", "user2@example.com", "pass123")
        UserProfile.objects.create(user=user2, bio="Test bio")
        
        response = client.get('/api/users/')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Find user2 in the response
        user2_data = next(u for u in response.data if u['username'] == 'user2')
        assert user2_data['first_name'] == ''
        assert user2_data['last_name'] == ''
        assert user2_data['bio'] == 'Test bio'
        assert 'id' in user2_data
    
    def test_list_users_unauthorized(self, api_client):
        """Test user listing without authentication"""
        response = api_client.get('/api/users/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_user_success(self, auth_client, create_user):
        """Test successful individual user retrieval"""
        client, user1 = auth_client
        
        user2 = create_user("user2", "user2@example.com", "pass123")
        UserProfile.objects.create(
            user=user2,
            date_of_birth=date(1990, 1, 1),
            bio="User 2 bio"
        )
        
        response = client.get(f'/api/users/{user2.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'user2'
        assert response.data['first_name'] == ''
        assert response.data['last_name'] == ''
        assert response.data['bio'] == 'User 2 bio'
        assert response.data['id'] == str(user2.id)
    
    def test_get_user_not_found(self, auth_client):
        """Test individual user retrieval with non-existent user"""
        client, user = auth_client
        
        # Use a valid ObjectId format but non-existent ID
        from bson import ObjectId
        fake_id = str(ObjectId())
        
        response = client.get(f'/api/users/{fake_id}/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'detail' in response.data
        assert response.data['detail'] == 'User not found'
    
    def test_get_user_unauthorized(self, api_client):
        """Test individual user retrieval without authentication"""
        response = api_client.get('/api/users/some-id/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserProfileIntegration:
    """Test integration between user and profile models"""
    
    def test_user_profile_creation_on_registration(self, api_client):
        """Test that UserProfile is automatically created during registration"""
        data = {
            "username": "integrationtest",
            "email": "integration@example.com",
            "first_name": "Integration",
            "last_name": "Test",
            "date_of_birth": "1990-01-01",
            "bio": "Integration test bio",
            "password": "testpass123",
            "password_confirm": "testpass123"
        }
        
        response = api_client.post('/api/register/', data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        
        # Verify user and profile were created
        user = User.objects.get(username="integrationtest")
        profile = UserProfile.objects.get(user=user)
        
        assert profile.date_of_birth == date(1990, 1, 1)
        assert profile.bio == "Integration test bio"
    
    def test_profile_serialization_in_user_data(self, auth_client):
        """Test that profile data is properly serialized in user responses"""
        client, user = auth_client
        
        # Create profile
        UserProfile.objects.create(
            user=user,
            date_of_birth=date(1985, 5, 15),
            bio="Serialization test bio"
        )
        
        # Test profile endpoint
        response = client.get('/api/profile/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['date_of_birth'] == '1985-05-15'
        assert response.data['bio'] == 'Serialization test bio'
        
        # Test users list endpoint
        response = client.get('/api/users/')
        assert response.status_code == status.HTTP_200_OK
        
        user_data = next(u for u in response.data if u['username'] == user.username)
        assert user_data['bio'] == 'Serialization test bio'
    
    def test_profile_update_creates_profile_if_missing(self, auth_client):
        """Test that profile update creates UserProfile if it doesn't exist"""
        client, user = auth_client
        
        # Ensure no profile exists
        assert not UserProfile.objects.filter(user=user).exists()
        
        data = {
            "bio": "Creating profile via update"
        }
        
        response = client.patch('/api/profile/update/', data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify profile was created
        profile = UserProfile.objects.get(user=user)
        assert profile.bio == "Creating profile via update"
    
    def test_multiple_users_with_profiles(self, auth_client, create_user):
        """Test multiple users with different profile configurations"""
        client, user1 = auth_client
        
        # Create users with different profile setups
        user2 = create_user("user2", "user2@example.com", "pass123")
        user3 = create_user("user3", "user3@example.com", "pass123")
        user4 = create_user("user4", "user4@example.com", "pass123")
        
        # user2: full profile
        UserProfile.objects.create(
            user=user2,
            date_of_birth=date(1990, 1, 1),
            bio="Full profile user"
        )
        
        # user3: partial profile
        UserProfile.objects.create(
            user=user3,
            bio="Bio only user"
        )
        
        # user4: no profile (should get defaults)
        
        response = client.get('/api/users/')
        assert response.status_code == status.HTTP_200_OK
        
        users_data = {u['username']: u for u in response.data}
        
        # Check user2 (full profile)
        assert users_data['user2']['bio'] == 'Full profile user'
        
        # Check user3 (partial profile)
        assert users_data['user3']['bio'] == 'Bio only user'
        
        # Check user4 (no profile - should have empty or None bio)
        assert users_data['user4']['bio'] == '' or users_data['user4']['bio'] is None
