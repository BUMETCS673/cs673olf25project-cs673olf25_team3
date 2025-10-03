"""
api.serializers.fields

Custom DRF field for handling MongoDB ObjectIds

- Converts MongoDB ObjectId values to strings when serializing
- Converts string inputs back into ObjectId instances when deserializing
- Raises validation error if input cannot be cast to a valid ObjectId
"""
# Framework-generated: 10%
# Human-written: 70%
# AI-generated: 20%

from rest_framework import serializers
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        # Outgoing: Mongo ObjectId -> str
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def to_internal_value(self, data):
        # Incoming: str -> Mongo ObjectId
        try:
            return ObjectId(str(data))
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId")
