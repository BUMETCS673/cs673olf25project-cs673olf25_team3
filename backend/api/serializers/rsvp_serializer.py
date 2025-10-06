# Framework-generated: 0%
# Human-written: 100%
# AI-generated: 0%

from rest_framework import serializers


class RSVPSerializer(serializers.Serializer):
    plan_id = serializers.CharField(required=True)
    user_id = serializers.CharField(required=True)
    created_at = serializers.DateTimeField(required=True)