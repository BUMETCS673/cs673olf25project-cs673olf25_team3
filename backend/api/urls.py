"""
api.urls

Defines all API endpoints exposed to the frontend and tests

Includes:
- User registration & profile endpoints
- JWT authentication (token obtain/refresh)
- Friends API (send/respond/list/remove friend requests)
- Plans API (CRUD operations for plans)

Notes:
- Friend routes use <str:...> converters because user and friend PKs
  are MongoDB-style ObjectIds (not integers)
- `/friends/list/` is kept explicitly because test cases expect this
  exact path, even though `/friends/` also lists friends
"""
# Framework-generated: 20%
# Human-written: 60%
# AI-generated: 20%

from django.urls import path
from .views import plans, users, rsvp
from .views.friends import send_friend_request, respond_to_friend_request, list_friends, remove_friend
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# API routes used by the frontend and tests
urlpatterns = [
    # User endpoints
    path('register/', users.register_user, name='register_user'),
    path('profile/', users.get_user_profile, name='get_user_profile'),
    # Users listing & detail used by the frontend for user search / selection.
    # Both endpoints require authentication and return only minimal public fields
    # (id, username, first_name, last_name) to avoid leaking any private data
    path('users/', users.list_users, name='list_users'),
    path('users/<str:user_id>/', users.get_user, name='get_user'),

    # Auth (JWT)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Friends endpoints - `/friends/list/` kept for test compatibility
    path('friends/list/', list_friends, name='list_friends_list'),

    # Friend endpoints - use string converters because PKs are ObjectId strings with django-mongodb-backend
    path('friends/request/<str:user_id>/', send_friend_request, name='send_friend_request'),
    path('friends/respond/<str:request_id>/', respond_to_friend_request, name='respond_to_friend_request'),
    path('friends/', list_friends, name='list_friends'),
  path('friends/remove/<str:request_id>/', remove_friend, name='remove_friend'),

    # Plans endpoints
    path('plans/', plans.get_plans, name='get-plans'),
    path('plans/add', plans.create_plan, name='create-plan'),
    path('plans/<str:plan_id>', plans.get_plans_by_id, name='get-plans-by-id'),
    path('plans/<str:plan_id>/edit', plans.update_plan, name='update-plan'),
    path('plans/<str:plan_id>/delete', plans.delete_plan, name='delete-plan'),

    # RSVP endpoints
    path('rsvp/add', rsvp.create_rsvp, name='create-rsvp'),
    path('rsvp/plan/<str:plan_id>', rsvp.get_rsvp_by_plan_id, name='get-rsvp-by-plan-id'),
    path('rsvp/user', rsvp.get_rsvp_by_user_id, name='get-rsvp-by-user-id'),
    path('rsvp/<str:rsvp_id>/delete', rsvp.delete_rsvp_by_id, name='delete-rsvp-by-id'),
    path('rsvp/plan/<str:plan_id>/delete', rsvp.delete_rsvp_by_plan_id, name='delete-rsvp-by-plan-id'),
]
