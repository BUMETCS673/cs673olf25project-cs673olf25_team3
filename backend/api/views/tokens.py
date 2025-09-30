# Framework-generated: 0%
# Human-written: 0%
# AI-generated: 100% 
#   - override token api view with JSON responses - https://chatgpt.com/share/68dc2d36-9910-8008-b4c0-05ea89493638

from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Subclass and override renderer_classes
class JSONTokenObtainPairView(TokenObtainPairView):
    renderer_classes = [JSONRenderer]

class JSONTokenRefreshView(TokenRefreshView):
    renderer_classes = [JSONRenderer]