from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Role

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='student')
    avatar = serializers.ImageField(required=False, allow_null=True)
    password = serializers.CharField(write_only=True)  # Ajouter ceci

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',  # Ajouter le champ password
            'email',
            'first_name',
            'last_name', 
            'role',
            'phone',
            'avatar',
            'is_active',
            'date_joined'
        ]
        extra_kwargs = {
            'password': {'write_only': True}  # Configuration supplémentaire
        }

    def create(self, validated_data):
        # Extraire le mot de passe avant de créer l'utilisateur
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Utiliser le mot de passe extrait
        user.save()
        return user

class RoleSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'created_at', 'users']