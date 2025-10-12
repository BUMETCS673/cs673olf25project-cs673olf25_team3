# Framework-generated: 0%
# Human-written: 5%
# AI-generated: 95%

"""
User Profile model for Planning Jam application

Extends Django's default User model with additional fields:
- date_of_birth: User's birth date
- bio: User's biography/description

Uses OneToOneField relationship to avoid migration conflicts.
"""

from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    """
    User Profile model extending Django's default User model
    
    Additional fields:
    - date_of_birth: DateField for user's birth date (optional)
    - bio: TextField for user's biography/description (optional)
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    date_of_birth = models.DateField(
        null=True, 
        blank=True,
        help_text="User's date of birth"
    )
    
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="User's biography or description (max 500 characters)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'api_userprofile'
        
    def __str__(self):
        return f"{self.user.username}'s profile"
