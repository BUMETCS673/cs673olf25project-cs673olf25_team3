"""
Friend model for managing user-to-user relationships in the Friends API


Represents a friend request between two users with pending, accepted, and
rejected states. Includes metadata (timestamps, indexes, unique
constraints) and helper methods for updating request status
"""

# Framework-generated: 0%
# Human-written: 80%
# AI-generated: 20%
#   - Force authentication https://chatgpt.com/share/68d9876b-6204-8008-a5bf-c8f8d70faf31 

from django.conf import settings
from django.db import models
from django.utils import timezone

class Friend(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    )

    # store actual user references so tests can create Friend(sender=user, receiver=user)
    # Temporary null=True to avoid interactive migration prompts. Might need to backfill then remove null=True and enforce non-null constraint.
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='friend_requests_sent',
        on_delete=models.CASCADE,
        null=True, blank=True,
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='friend_requests_received',
        on_delete=models.CASCADE,
        null=True, blank=True,
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['sender', 'status']),
            models.Index(fields=['receiver', 'status']),
        ]
        constraints = [
            models.UniqueConstraint(fields=['sender', 'receiver'], name="unique_sender_receiver")
        ]

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"

    def accept(self):
        self.status = 'accepted'
        self.save()

    def reject(self):
        self.status = 'rejected'
        self.save()
