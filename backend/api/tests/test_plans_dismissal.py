import os
import pytest
from django.urls import reverse
from datetime import datetime, timedelta, timezone
from api.utils.mongo import get_collection
from api.models.friends_models import Friend

pytestmark = pytest.mark.django_db


def _plans_coll():
    return get_collection('plans')


def _dismissals_coll():
    return get_collection('dismissals')


@pytest.fixture(autouse=True)
def cleanup():
    # Ensure collections are clean before and after each test
    _plans_coll().delete_many({})
    _dismissals_coll().delete_many({})
    yield
    _plans_coll().delete_many({})
    _dismissals_coll().delete_many({})


@pytest.fixture
def create_user(django_user_model):
    def _create(username):
        return django_user_model.objects.create_user(username=username, password='pass')
    return _create


def make_plan(created_by, title="Test Plan"):
    now = datetime.now(timezone.utc)
    start = now + timedelta(minutes=5)
    doc = {
        "title": title,
        "start_time": start,
        "end_time": start + timedelta(hours=1),
        "created_by": str(created_by.id),
        "created_at": now,
    }
    res = _plans_coll().insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return doc


# Note: feed defaults to own-only. Friends are included only with ?friends=true


def get_access_token(client, username):
    token_url = reverse('token_obtain_pair')
    resp = client.post(token_url, {"username": username, "password": "pass"}, content_type='application/json')
    assert resp.status_code == 200
    return resp.json()["access"]


@pytest.mark.django_db
def test_dismiss_hides_plan_from_dismisser(client, create_user):
    # Arrange: user creates their own plan, which appears in own-only feed
    user_a = create_user('user_a')
    plan = make_plan(user_a)

    # Login user_a
    access = get_access_token(client, 'user_a')

    # Sanity: user_a sees the plan before dismissing (own-only feed)
    plans_url = reverse('get-plans')
    resp = client.get(plans_url, HTTP_AUTHORIZATION=f'Bearer {access}')
    assert resp.status_code == 200
    data = resp.json()
    assert any(p.get('_id') == plan['_id'] or p.get('id') == plan['_id'] for p in data)

    # Act: user_a dismisses the plan
    dismiss_url = reverse('dismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.post(dismiss_url, HTTP_AUTHORIZATION=f'Bearer {access}')
    assert resp.status_code in (200, 204)

    # Assert: plan no longer appears for user_a
    resp = client.get(plans_url, HTTP_AUTHORIZATION=f'Bearer {access}')
    assert resp.status_code == 200
    data = resp.json()
    assert not any(p.get('_id') == plan['_id'] or p.get('id') == plan['_id'] for p in data)


@pytest.mark.django_db
def test_owner_cannot_see_who_dismissed_and_listing_works(client, create_user):
    # Arrange
    user_a = create_user('user_a2')
    user_b = create_user('user_b2')
    plan = make_plan(user_b)

    # user_a dismisses
    access_a = get_access_token(client, 'user_a2')
    dismiss_url = reverse('dismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.post(dismiss_url, HTTP_AUTHORIZATION=f'Bearer {access_a}')
    assert resp.status_code in (200, 204)

    # Owner (user_b) fetches the plan by id and should not see any dismissal metadata
    access_b = get_access_token(client, 'user_b2')
    get_by_id_url = reverse('get-plans-by-id', kwargs={'plan_id': plan['_id']})
    resp = client.get(get_by_id_url, HTTP_AUTHORIZATION=f'Bearer {access_b}')
    assert resp.status_code == 200
    body = resp.json().get('data') or resp.json()
    assert 'dismissals' not in body and 'dismissed_by' not in body and 'dismissed_at' not in body

    # Listing dismissed plans for user_a should include the plan
    list_url = reverse('list-dismissed-plans')
    resp = client.get(list_url, HTTP_AUTHORIZATION=f'Bearer {access_a}')
    assert resp.status_code == 200
    arr = resp.json()
    assert any(p.get('_id') == plan['_id'] for p in arr)

    # Undismiss and confirm it disappears from list and reappears in feed
    undismiss_url = reverse('undismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.delete(undismiss_url, HTTP_AUTHORIZATION=f'Bearer {access_a}')
    assert resp.status_code in (200, 204)

    resp = client.get(list_url, HTTP_AUTHORIZATION=f'Bearer {access_a}')
    assert resp.status_code == 200
    arr = resp.json()
    assert not any(p.get('_id') == plan['_id'] for p in arr)

    # Note: feed defaults own-only, reappearance in friend's feed requires a friend link.
    # This test focuses on privacy and the dismissed list lifecycle


@pytest.mark.django_db
def test_dismiss_friend_plan_then_undismiss_reappears_in_friends_feed(client, create_user):
    # Arrange: two users who are friends
    alice = create_user('alice')
    bob = create_user('bob')
    # Create accepted friendship between alice and bob
    Friend.objects.create(sender=bob, receiver=alice, status='accepted')

    # Bob creates a plan
    plan = make_plan(bob, title="Bob's Plan")

    # Alice logs in and sees Bob's plan in friends feed
    access_alice = get_access_token(client, 'alice')
    plans_url = reverse('get-plans') + '?friends=true'
    resp = client.get(plans_url, HTTP_AUTHORIZATION=f'Bearer {access_alice}')
    assert resp.status_code == 200
    data = resp.json()
    assert any(p.get('_id') == plan['_id'] for p in data)

    # Alice dismisses Bob's plan
    dismiss_url = reverse('dismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.post(dismiss_url, HTTP_AUTHORIZATION=f'Bearer {access_alice}')
    assert resp.status_code in (200, 204)

    # It disappears from her friends feed
    resp = client.get(plans_url, HTTP_AUTHORIZATION=f'Bearer {access_alice}')
    assert resp.status_code == 200
    data = resp.json()
    assert not any(p.get('_id') == plan['_id'] for p in data)

    # Undismiss
    undismiss_url = reverse('undismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.delete(undismiss_url, HTTP_AUTHORIZATION=f'Bearer {access_alice}')
    assert resp.status_code in (200, 204)

    # Plan reappears in the friends feed
    resp = client.get(plans_url, HTTP_AUTHORIZATION=f'Bearer {access_alice}')
    assert resp.status_code == 200
    data = resp.json()
    assert any(p.get('_id') == plan['_id'] for p in data)


@pytest.mark.django_db
def test_plan_deletion_cleans_up_dismissals(client, create_user):
    # Arrange
    owner = create_user('owner')
    other = create_user('other')
    plan = make_plan(owner, title="Owner's Plan")

    # Other user dismisses owner's plan
    access_other = get_access_token(client, 'other')
    dismiss_url = reverse('dismiss-plan', kwargs={'plan_id': plan['_id']})
    resp = client.post(dismiss_url, HTTP_AUTHORIZATION=f'Bearer {access_other}')
    assert resp.status_code in (200, 204)

    # Sanity: dismissal record exists
    assert _dismissals_coll().count_documents({"plan_id": plan['_id'], "user_id": str(other.id)}) == 1

    # Owner deletes the plan
    access_owner = get_access_token(client, 'owner')
    delete_url = reverse('delete-plan', kwargs={'plan_id': plan['_id']})
    resp = client.delete(delete_url, HTTP_AUTHORIZATION=f'Bearer {access_owner}')
    assert resp.status_code in (200, 204)

    # Dismissal cleanup: record is removed
    assert _dismissals_coll().count_documents({"plan_id": plan['_id']}) == 0

    # And list dismissed returns empty for the other user
    list_url = reverse('list-dismissed-plans')
    resp = client.get(list_url, HTTP_AUTHORIZATION=f'Bearer {access_other}')
    assert resp.status_code == 200
    arr = resp.json()
    assert not any(p.get('_id') == plan['_id'] for p in arr)
