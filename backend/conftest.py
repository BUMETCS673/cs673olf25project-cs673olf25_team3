import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    """Return a DRF APIClient instance."""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Factory fixture to create users in the test database.

    Usage: user = create_user('username', 'email@example.com', 'pass')
    """
    def _create_user(username, email, password):
        return User.objects.create_user(username=username, email=email, password=password)

    return _create_user


@pytest.fixture
def auth_client(api_client, create_user):
    """Authenticate an APIClient with a freshly created user and return (client, user).

    The fixture will create a user with username 'testuser1' and password 'testpass123'
    and obtain a JWT token via the project's token endpoint.
    """
    user = create_user('testuser1', 'test1@test.com', 'testpass123')
    resp = api_client.post('/api/token/', {'username': 'testuser1', 'password': 'testpass123'})
    token = resp.data.get('access')
    if token:
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    return api_client, user
