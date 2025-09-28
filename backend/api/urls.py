from django.urls import path
from .views import plans, users
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Framework-generated: 5%
# Human-written: 75%
# AI-generated: 20%
urlpatterns = [
    path('register/', users.register_user, name='register_user'),
    path('profile/', users.get_user_profile, name='get_user_profile'),
    
    # JWT authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Plans endpoints
    path('plans/add', plans.create_plan, name='create-plan')
]
