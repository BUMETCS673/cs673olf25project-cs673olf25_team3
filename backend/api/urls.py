from django.urls import path
from .views import plans, users
from .views.friends import send_friend_request, respond_to_friend_request, list_friends, remove_friend
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# API routes used by the frontend and tests
# Note: friend routes use string converters because our user PKs are stored
# as non-integer IDs ObjectId style. We also keep an explicit `/friends/list/`
# path because tests expect that exact endpoint currently
urlpatterns = [
    path('register/', users.register_user, name='register_user'),
    path('profile/', users.get_user_profile, name='get_user_profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('plans/add', plans.create_plan, name='create-plan'),

    # explicit list path expected by tests (/api/friends/list/)
    path('friends/list/', list_friends, name='list_friends_list'),

    # Friend endpoints
    # Use string converters because PKs are ObjectId strings with django-mongodb-backend
    path('friends/request/<str:user_id>/', send_friend_request, name='send_friend_request'),
    path('friends/respond/<str:request_id>/', respond_to_friend_request, name='respond_to_friend_request'),
    path('friends/', list_friends, name='list_friends'),
    path('friends/remove/<str:friend_id>/', remove_friend, name='remove_friend'),
]
