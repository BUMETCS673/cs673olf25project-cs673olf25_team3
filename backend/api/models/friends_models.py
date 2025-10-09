"""
api.models.friends_models

Friend model definition for the Friends API

Defines a simple relationship between two users (sender and receiver),
with support for pending, accepted, and rejected states. Includes
timestamps, constraints to prevent duplicates, and helper methods for
accepting or rejecting requests
"""
# Framework-generated: 10%
# Human-written: 60%
# AI-generated: 30%

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
    # Temporary null=True to avoid interactive migration prompts. Might need to backfill then remove null=True and enforce non-null constraint
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

    # Tracks lifecycle of the friend request (default: pending)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Created timestamp set once, updated_at auto-updates on save
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
        # Helpful string for admin/debugging (ex. "abbott -> costello (pending)")
        return f"{self.sender} -> {self.receiver} ({self.status})"

    def accept(self):
        self.status = 'accepted'
        self.save()

    def reject(self):
        self.status = 'rejected'
        self.save()
