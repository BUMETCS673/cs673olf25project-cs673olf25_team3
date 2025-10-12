# Framework-generated: 0%
# Human-written: 80%
# AI-generated: 20%
#   - Force authentication https://chatgpt.com/share/68d9876b-6204-8008-a5bf-c8f8d70faf31 

import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User

pytestmark = pytest.mark.django_db

client = APIClient()

class TestPlansAPI:
    def test_create_plan(self):
        url = reverse("create-plan")  

        # force authentication
        user = User.objects.create_user(username="testuser", password="testpwd1234")
        client.force_authenticate(user=user)

        # build the request data
        data = {
            "title": "Game Night", 
            "description": "Lots of fun and laughters with friends.", 
            "location": {"address1": "1 main st", "city": "Boston", "state": "MA", "zipcode": "12345"},
            "start_time": "2025-09-28 12:00:00",
            "end_time": "2025-09-28 15:00:00"
        }

        # create the API request
        response = client.post(url, data, format="json")
        
        # Assertion Tests
        assert response.status_code == 201
        assert "id" in response.data['data']
        assert response.data['data']["title"] == "Game Night"

