"""
api.serializers.friends

Serializer for the Friend model used by the Friends API

- Wraps Friend model into JSON-friendly representation
- Uses custom ObjectIdField for Mongo-style IDs
- Exposes sender_id and receiver_id instead of nested User objects
- Provides explicit create/update methods for controlled persistence
"""

# Framework-generated: 20%
# Human-written: 60%
# AI-generated: 20%

from rest_framework import serializers
from api.models.friends_models import Friend
from .fields import ObjectIdField

class FriendSerializer(serializers.ModelSerializer):
    id = ObjectIdField(source='_id', read_only=True)
    sender_id = ObjectIdField()
    receiver_id = ObjectIdField()

    class Meta:
        model = Friend
        fields = ['id', 'sender_id', 'receiver_id', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        return Friend.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance