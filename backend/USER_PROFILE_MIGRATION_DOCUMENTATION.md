# User Profile Migration Documentation

## Overview
This document describes the process of extending the Django User model with additional fields (`date_of_birth` and `bio`) for the Planning Jam application. Due to the complexity of migrating a custom User model in an existing MongoDB-based Django project, we implemented a UserProfile model approach instead.

## Migration Strategy

### Why UserProfile Instead of Custom User Model?
1. **Existing Data**: The project already had users in the database using Django's default User model
2. **Migration Complexity**: Switching to a custom User model would require complex data migration
3. **MongoDB Compatibility**: The project uses MongoDB with `django_mongodb_backend`, which adds additional complexity
4. **Safety**: UserProfile approach is safer and doesn't risk data loss

### Implementation Details

#### 1. Created UserProfile Model
**File**: `backend/api/models/user_models.py`

```python
class UserProfile(models.Model):
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
```

#### 2. Updated Model Exports
**File**: `backend/api/models/__init__.py`

```python
from .user_models import UserProfile
__all__ = ["Friend", "UserProfile"]
```

#### 3. Updated Serializers
**File**: `backend/api/serializers/auth_serializer.py`

**UserRegistrationSerializer Changes**:
- Added `date_of_birth` and `bio` fields
- Updated `create()` method to create UserProfile alongside User
- Handles profile data extraction and creation

**UserSerializer Changes**:
- Added `date_of_birth` and `bio` fields with `source='profile.field_name'`
- Fields are read-only and pull data from the related UserProfile

#### 4. Generated Migration
**File**: `backend/api/migrations/0004_userprofile.py`

```python
class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_remove_friend_unique_sender_receiver_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', django_mongodb_backend.fields.ObjectIdAutoField(...)),
                ('date_of_birth', models.DateField(...)),
                ('bio', models.TextField(...)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(...)),
            ],
            options={
                'db_table': 'api_userprofile',
            },
        ),
    ]
```

## Migration Process

### Step 1: Create the UserProfile Model
```bash
# Created user_models.py with UserProfile class
# Updated models/__init__.py to export UserProfile
```

### Step 2: Update Serializers
```bash
# Modified auth_serializer.py to handle profile fields
# Added profile creation logic to UserRegistrationSerializer
# Updated UserSerializer to read from profile relationship
```

### Step 3: Generate Migration
```bash
cd backend
.venv/Scripts/python.exe manage.py makemigrations api
```

### Step 4: Apply Migration
```bash
.venv/Scripts/python.exe manage.py migrate
```

### Step 5: Test the Implementation
```bash
# Tested model creation
.venv/Scripts/python.exe manage.py shell -c "from api.models import UserProfile; from django.contrib.auth.models import User; from django.contrib.auth.hashers import make_password; user = User.objects.create_user(username='testuser2', email='test2@example.com', password='testpass123', first_name='Test', last_name='User'); profile = UserProfile.objects.create(user=user, date_of_birth='1990-01-01', bio='Test bio'); print(f'User created: {user.username}'); print(f'Profile created: {profile.bio}')"

# Tested serializer
.venv/Scripts/python.exe manage.py shell -c "from api.serializers.auth_serializer import UserSerializer; from django.contrib.auth.models import User; user = User.objects.get(username='testuser2'); serializer = UserSerializer(user); print('UserSerializer data:'); print(serializer.data)"
```

## API Usage

### Registration with New Fields
```json
POST /api/register/
{
    "username": "newuser",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "bio": "This is my bio",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```

### Profile Response
```json
GET /api/profile/
{
    "id": "68e7139862cbffb47ae284f2",
    "username": "newuser",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01",
    "bio": "This is my bio",
    "date_joined": "2025-10-09T01:44:47.065000Z"
}
```

## Database Schema

### New Table: `api_userprofile`
- `id`: ObjectId (Primary Key)
- `user_id`: Foreign Key to `auth_user`
- `date_of_birth`: Date (nullable)
- `bio`: Text (max 500 characters, nullable)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-updated)

### Existing Table: `auth_user`
- No changes to existing User table
- New users will have corresponding UserProfile records

## Benefits of This Approach

1. **Data Safety**: No risk of losing existing user data
2. **Backward Compatibility**: Existing code continues to work
3. **Gradual Migration**: Can migrate existing users to have profiles over time
4. **Flexibility**: Easy to add more profile fields in the future
5. **MongoDB Compatible**: Works well with the existing MongoDB setup

## Future Considerations

1. **Data Migration**: Consider creating UserProfile records for existing users
2. **API Updates**: Update other endpoints that might need profile data
3. **Frontend Integration**: Update frontend to handle new fields
4. **Validation**: Add more sophisticated validation for date_of_birth and bio fields

## Files Modified

1. `backend/api/models/user_models.py` - New UserProfile model
2. `backend/api/models/__init__.py` - Updated exports
3. `backend/api/serializers/auth_serializer.py` - Updated serializers
4. `backend/api/migrations/0004_userprofile.py` - New migration
5. `backend/USER_PROFILE_MIGRATION_DOCUMENTATION.md` - This documentation

## Migration Commands Used

```bash
# Generate migration
.venv/Scripts/python.exe manage.py makemigrations api

# Apply migration
.venv/Scripts/python.exe manage.py migrate

# Test models
.venv/Scripts/python.exe manage.py shell
```

## Testing Results

✅ UserProfile model creation successful
✅ User creation with profile successful  
✅ Serializer returns profile fields correctly
✅ Migration applied without errors
✅ No linting errors detected

The migration has been successfully completed and tested.
