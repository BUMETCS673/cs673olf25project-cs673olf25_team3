#!/usr/bin/env python3
# Framework-generated: 0%
# Human-written: 20%
# AI-generated: 80%
"""
RSVP API Test Script

This script tests all RSVP API endpoints using pytest.
Run this script to test the RSVP functionality.

Usage:
    python test_rsvp_api.py

Or run with pytest:
    pytest test_rsvp_api.py -v
"""

import os
import sys
import django
import pytest
from django.conf import settings
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from datetime import datetime
from unittest.mock import patch, MagicMock
from bson import ObjectId

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

# Configure Django settings for testing
if not settings.configured:
    settings.configure(
        DEBUG=True,
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',
            }
        },
        INSTALLED_APPS=[
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'rest_framework',
            'rest_framework_simplejwt',
            'api',
        ],
        ROOT_URLCONF='app.urls',
        SECRET_KEY='test-secret-key',
        USE_TZ=True,
    )

client = APIClient()

class TestRSVPAPI(TestCase):
    """Test cases for RSVP API endpoints"""
    
    def setUp(self):
        """Setup test data before each test method"""
        # Create test user
        self.user = User.objects.create_user(
            username="testuser", 
            password="testpwd1234"
        )
        client.force_authenticate(user=self.user)
        
        # Mock plan ID for testing
        self.plan_id = str(ObjectId())
        self.rsvp_id = str(ObjectId())

    @patch('api.views.rsvp.rsvp_collection')
    def test_create_rsvp_success(self, mock_collection):
        """Test successful RSVP creation"""
        # Mock the insert_one method
        mock_result = MagicMock()
        mock_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_result
        mock_collection.find_one.return_value = None  # No existing RSVP
        
        url = reverse("create-rsvp")
        
        data = {
            "plan_id": self.plan_id
        }
        
        response = client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.data)
        self.assertEqual(response.data["message"], "RSVP created")
        self.assertEqual(response.data["data"]["plan_id"], self.plan_id)
        self.assertEqual(response.data["data"]["user_id"], str(self.user.id))
        self.assertIn("created_at", response.data["data"])

    def test_create_rsvp_missing_plan_id(self):
        """Test RSVP creation with missing plan_id"""
        url = reverse("create-rsvp")
        
        data = {}
        
        response = client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("plan_id", response.data)

    @patch('api.views.rsvp.rsvp_collection')
    def test_create_rsvp_duplicate_prevention(self, mock_collection):
        """Test that users cannot RSVP to the same plan multiple times"""
        # Mock find_one to return existing RSVP
        existing_rsvp = {
            "_id": ObjectId(),
            "plan_id": self.plan_id,
            "user_id": str(self.user.id),
            "created_at": datetime.now().isoformat()
        }
        mock_collection.find_one.return_value = existing_rsvp
        
        url = reverse("create-rsvp")
        data = {
            "plan_id": self.plan_id
        }
        
        response = client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("already RSVP'd", response.data["error"])
        # Ensure insert_one was not called
        mock_collection.insert_one.assert_not_called()

    @patch('api.views.rsvp.rsvp_collection')
    def test_get_rsvp_by_plan_id_success(self, mock_collection):
        """Test successful retrieval of RSVP by plan_id"""
        # Mock the find_one method
        mock_rsvp = {
            "_id": ObjectId(),
            "plan_id": self.plan_id,
            "user_id": str(self.user.id),
            "created_at": datetime.now().isoformat()
        }
        mock_collection.find_one.return_value = mock_rsvp
        
        url = reverse("get-rsvp-by-plan-id", kwargs={"plan_id": self.plan_id})
        response = client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["plan_id"], self.plan_id)
        self.assertEqual(response.data["data"]["user_id"], str(self.user.id))

    @patch('api.views.rsvp.rsvp_collection')
    def test_get_rsvp_by_plan_id_not_found(self, mock_collection):
        """Test retrieval of non-existent RSVP by plan_id"""
        # Mock the find_one method to return None
        mock_collection.find_one.return_value = None
        
        url = reverse("get-rsvp-by-plan-id", kwargs={"plan_id": self.plan_id})
        response = client.get(url)
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "RSVP not found")

    @patch('api.views.rsvp.rsvp_collection')
    def test_get_rsvp_by_user_id_success(self, mock_collection):
        """Test successful retrieval of RSVP by user_id"""
        # Mock the find_one method
        mock_rsvp = {
            "_id": ObjectId(),
            "plan_id": self.plan_id,
            "user_id": str(self.user.id),
            "created_at": datetime.now().isoformat()
        }
        mock_collection.find_one.return_value = mock_rsvp
        
        url = reverse("get-rsvp-by-user-id", kwargs={"user_id": str(self.user.id)})
        response = client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["plan_id"], self.plan_id)
        self.assertEqual(response.data["data"]["user_id"], str(self.user.id))

    @patch('api.views.rsvp.rsvp_collection')
    def test_get_rsvp_by_user_id_not_found(self, mock_collection):
        """Test retrieval of non-existent RSVP by user_id"""
        # Mock the find_one method to return None
        mock_collection.find_one.return_value = None
        
        url = reverse("get-rsvp-by-user-id", kwargs={"user_id": str(self.user.id)})
        response = client.get(url)
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "RSVP not found")

    @patch('api.views.rsvp.rsvp_collection')
    def test_delete_rsvp_by_id_success(self, mock_collection):
        """Test successful deletion of RSVP by ID"""
        # Mock the delete_one method
        mock_result = MagicMock()
        mock_result.deleted_count = 1
        mock_collection.delete_one.return_value = mock_result
        
        url = reverse("delete-rsvp-by-id", kwargs={"rsvp_id": self.rsvp_id})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(f"RSVP {self.rsvp_id} deleted successfully", response.data["message"])

    @patch('api.views.rsvp.rsvp_collection')
    def test_delete_rsvp_by_id_not_found(self, mock_collection):
        """Test deletion of non-existent RSVP by ID"""
        # Mock the delete_one method
        mock_result = MagicMock()
        mock_result.deleted_count = 0
        mock_collection.delete_one.return_value = mock_result
        
        url = reverse("delete-rsvp-by-id", kwargs={"rsvp_id": self.rsvp_id})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "RSVP not found")

    def test_delete_rsvp_by_id_invalid_id(self):
        """Test deletion with invalid RSVP ID format"""
        url = reverse("delete-rsvp-by-id", kwargs={"rsvp_id": "invalid_id"})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Invalid ID")

    @patch('api.views.rsvp.rsvp_collection')
    def test_delete_rsvp_by_plan_id_success(self, mock_collection):
        """Test successful deletion of RSVP by plan_id"""
        # Mock the delete_one method
        mock_result = MagicMock()
        mock_result.deleted_count = 1
        mock_collection.delete_one.return_value = mock_result
        
        url = reverse("delete-rsvp-by-plan-id", kwargs={"plan_id": self.plan_id})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(f"RSVP for plan {self.plan_id} deleted successfully", response.data["message"])

    @patch('api.views.rsvp.rsvp_collection')
    def test_delete_rsvp_by_plan_id_not_found(self, mock_collection):
        """Test deletion of non-existent RSVP by plan_id"""
        # Mock the delete_one method
        mock_result = MagicMock()
        mock_result.deleted_count = 0
        mock_collection.delete_one.return_value = mock_result
        
        url = reverse("delete-rsvp-by-plan-id", kwargs={"plan_id": self.plan_id})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "RSVP not found")

    def test_delete_rsvp_by_plan_id_invalid_id(self):
        """Test deletion with invalid plan ID format"""
        url = reverse("delete-rsvp-by-plan-id", kwargs={"plan_id": "invalid_id"})
        response = client.delete(url)
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "Invalid ID")

    def test_rsvp_authentication_required(self):
        """Test that RSVP endpoints require authentication"""
        # Remove authentication
        client.force_authenticate(user=None)
        
        # Test create RSVP without authentication
        url = reverse("create-rsvp")
        data = {
            "plan_id": self.plan_id
        }
        response = client.post(url, data, format="json")
        self.assertEqual(response.status_code, 401)

    @patch('api.views.rsvp.rsvp_collection')
    def test_multiple_rsvps_same_plan(self, mock_collection):
        """Test that multiple users can RSVP to the same plan"""
        # Mock the insert_one method
        mock_result = MagicMock()
        mock_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_result
        mock_collection.find_one.return_value = None  # No existing RSVP
        
        # Create another user
        user2 = User.objects.create_user(
            username="testuser2", 
            password="testpwd1234"
        )
        
        # Create RSVP for first user
        url = reverse("create-rsvp")
        data = {
            "plan_id": self.plan_id
        }
        response1 = client.post(url, data, format="json")
        self.assertEqual(response1.status_code, 201)
        
        # Create RSVP for second user
        client.force_authenticate(user=user2)
        response2 = client.post(url, data, format="json")
        self.assertEqual(response2.status_code, 201)

    @patch('api.views.rsvp.rsvp_collection')
    def test_rsvp_data_integrity(self, mock_collection):
        """Test that RSVP data is stored correctly"""
        # Mock the insert_one method
        mock_result = MagicMock()
        mock_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_result
        mock_collection.find_one.return_value = None  # No existing RSVP
        
        url = reverse("create-rsvp")
        
        data = {
            "plan_id": self.plan_id
        }
        
        response = client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        
        # Verify the data was passed to insert_one correctly
        mock_collection.insert_one.assert_called_once()
        call_args = mock_collection.insert_one.call_args[0][0]
        self.assertEqual(call_args["plan_id"], self.plan_id)
        self.assertEqual(call_args["user_id"], str(self.user.id))
        self.assertIn("created_at", call_args)


def run_tests():
    """Run the RSVP API tests"""
    print("Running RSVP API Tests...")
    print("=" * 50)
    
    # Run pytest with verbose output
    pytest.main([__file__, "-v", "--tb=short"])


if __name__ == "__main__":
    run_tests()
