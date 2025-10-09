"""
api.models package
Exports models for convenient imports. Keeps backward compatibility for `from api.models import Friend`
"""

from .friends_models import Friend

__all__ = ["Friend"]
