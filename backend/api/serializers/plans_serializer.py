# Framework-generated: 0%
# Human-written: 100%
# AI-generated: 0%

from rest_framework import serializers

class LocationSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    address1 = serializers.CharField()
    address2 = serializers.CharField(required=False)
    city = serializers.CharField()
    state = serializers.CharField()
    zipcode = serializers.IntegerField()

class PlansSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False)
    location = LocationSerializer()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    created_by = serializers.CharField()
    created_at = serializers.DateTimeField()
    

    def validate(self, data):
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({
                "end_time": "End time must be after start time."
            })
        return data