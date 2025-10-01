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
