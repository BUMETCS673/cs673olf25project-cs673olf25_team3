from django.urls import path
from .views import plans, users, rsvp
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
    path('plans/', plans.get_plans, name='get-plans'),
    path('plans/add', plans.create_plan, name='create-plan'),
    path('plans/<str:plan_id>', plans.get_plans_by_id, name='get-plans-by-id'),
    path('plans/<str:plan_id>/edit', plans.update_plan, name='update-plan'),
    path('plans/<str:plan_id>/delete', plans.delete_plan, name='delete-plan'),

    # RSVP endpoints
    path('rsvp/add', rsvp.create_rsvp, name='create-rsvp'),
    path('rsvp/<str:plan_id>', rsvp.get_rsvp_by_plan_id, name='get-rsvp-by-plan-id'),
    path('rsvp/<str:user_id>', rsvp.get_rsvp_by_user_id, name='get-rsvp-by-user-id'),
    path('rsvp/<str:rsvp_id>/delete', rsvp.delete_rsvp_by_id, name='delete-rsvp-by-id'),
    path('rsvp/<str:plan_id>/delete/plan', rsvp.delete_rsvp_by_plan_id, name='delete-rsvp-by-plan-id'),
]
