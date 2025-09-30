from django.urls import path

from .views import plans, users, tokens

# Framework-generated: 5%
# Human-written: 75%
# AI-generated: 20%
urlpatterns = [
    path('register/', users.register_user, name='register_user'),
    path('profile/', users.get_user_profile, name='get_user_profile'),
    
    # JWT authentication endpoints
    path('token/', tokens.JSONTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', tokens.JSONTokenRefreshView.as_view(), name='token_refresh'),
    
    # Plans endpoints
    path('plans/add', plans.create_plan, name='create-plan')
]
