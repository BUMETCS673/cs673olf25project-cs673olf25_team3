from rest_framework import serializers
from api.models import Friend
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