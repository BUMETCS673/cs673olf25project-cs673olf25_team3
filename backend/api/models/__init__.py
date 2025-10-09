"""
api.models package
Exports models for convenient imports. Keeps backward compatibility for `from api.models import Friend`
"""

from .friends_models import Friend
from .user_models import UserProfile

__all__ = ["Friend", "UserProfile"]
