# Framework-generated: 0%
# Human-written: 80%
# AI-generated: 20%
#   - Force authentication https://chatgpt.com/share/68d9876b-6204-8008-a5bf-c8f8d70faf31 

from datetime import datetime
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from bson import ObjectId
from django.contrib.auth.models import User
from unittest.mock import patch, MagicMock
from api.utils.mongo import get_collection

pytestmark = pytest.mark.django_db

@pytest.mark.usefixtures("db")
class TestPlansAPI:

    @pytest.fixture
    def api_client(self):
        """Returns the initialized DRF APIClient."""
        return APIClient()
    

    @pytest.fixture
    def test_user(self, db):
        user = User.objects.create_user(username="testuser", password="password123")
        return user


    @pytest.fixture
    def auth_client(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        return api_client, test_user


    # -----------------------
    # POST /api/plans/add
    # -----------------------
    @patch("api.views.plans.add_plan")
    def test_create_plan_success(self, mock_add_plan, auth_client):
        client, user = auth_client
        url = reverse("create-plan")

        mock_add_plan.return_value = {
            "status": 201,
            "message": "Plan created",
            "data": {"_id": "123", "title": "Test Plan"}
        }

        payload = {
            "title": "Test Plan",
            "description": "Fun event",
            "location": {"address1": "1 main st", "city": "Boston", "state": "MA", "zipcode": "12345"},
            "start_time": "2025-10-12T10:00:00Z",
            "end_time": "2025-10-12T12:00:00Z"
        }

        response = client.post(url, payload, format="json")

        assert response.status_code == 201
        assert response.data["data"]["title"] == "Test Plan"
        mock_add_plan.assert_called_once()

    # -----------------------
    # GET /api/plans/
    # -----------------------
    @patch("api.views.plans.get_filtered_plans")
    def test_get_plans(self, mock_get_filtered, auth_client):
        client, user = auth_client

        mock_get_filtered.return_value = [
            {"_id": ObjectId(), "title": "Mock Plan", "created_by": str(user.id)}
        ]

        url = reverse("get-plans")
        response = client.get(url)

        assert response.status_code == 200
        assert len(response.data) == 1
        assert "title" in response.data[0]
        mock_get_filtered.assert_called_once()

    # -----------------------
    # GET /api/plans/<plan_id>
    # -----------------------
    @patch("api.views.plans.plans_collection.find_one")
    def test_get_plan_by_id_success(self, mock_find_one, auth_client):
        client, user = auth_client
        plan_id = str(ObjectId())
        url = reverse("get-plans-by-id", args=[plan_id])

        mock_find_one.return_value = {
            "_id": ObjectId(),
            "title": "Birthday Party",
            "created_by": str(user.id)
        }

        response = client.get(url)

        assert response.status_code == 200
        assert response.data["data"]["title"] == "Birthday Party"

    def test_get_plan_by_id_invalid_id(self, auth_client):
        client, _ = auth_client
        url = reverse("get-plans-by-id", args=["invalid_id"])
        response = client.get(url)
        assert response.status_code == 400
        assert "error" in response.data

    # -----------------------
    # PUT /api/plans/<plan_id>/edit
    # -----------------------
    @patch("api.views.plans.update_user_plan")
    def test_update_plan_success(self, mock_update_plan, auth_client):
        client, user = auth_client
        plan_id = str(ObjectId())
        url = reverse("update-plan", args=[plan_id])

        mock_update_plan.return_value = {
            "status": 200,
            "message": "Plan updated",
            "data": {"title": "Updated Plan"}
        }

        payload = {"title": "Updated Plan"}
        response = client.put(url, payload, format="json")

        assert response.status_code == 200
        assert response.data["data"]["title"] == "Updated Plan"
        mock_update_plan.assert_called_once()

    # -----------------------
    # DELETE /api/plans/<plan_id>/delete
    # -----------------------
    @patch("api.views.plans.delete_plan_by_user")
    def test_delete_plan_success(self, mock_delete_plan, auth_client):
        client, user = auth_client
        plan_id = str(ObjectId())
        url = reverse("delete-plan", args=[plan_id])

        mock_delete_plan.return_value = {"status": 200, "message": "Deleted"}

        response = client.delete(url)

        assert response.status_code == 200
        assert response.data["status"] == 200
        mock_delete_plan.assert_called_once()