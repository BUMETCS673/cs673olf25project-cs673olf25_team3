from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from ..models import UserProfile

# Framework-generated: 5%
# Human-written: 45%
# AI-generated: 50%
User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    bio = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'date_of_birth', 'bio', 'password', 'password_confirm')
    
    def validate_email(self, value):
        """
        Validate that the email is unique.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        # Extract profile data
        profile_data = {
            'date_of_birth': validated_data.pop('date_of_birth', None),
            'bio': validated_data.pop('bio', '')
        }
        
        # Create user
        validated_data.pop('password_confirm')
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        
        # Create user profile
        UserProfile.objects.create(user=user, **profile_data)
        
        return user

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)  # Handle ObjectId as string
    date_of_birth = serializers.DateField(source='profile.date_of_birth', read_only=True)
    bio = serializers.CharField(source='profile.bio', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_of_birth', 'bio', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile fields
    """
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    bio = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'date_of_birth', 'bio')
    
    def update(self, instance, validated_data):
        # Extract profile-specific data
        profile_data = {
            'date_of_birth': validated_data.pop('date_of_birth', None),
            'bio': validated_data.pop('bio', None)
        }
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create profile
        profile, created = UserProfile.objects.get_or_create(user=instance)
        for attr, value in profile_data.items():
            if value is not None:  # Only update if value is provided
                setattr(profile, attr, value)
        profile.save()
        
        return instance