from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Role


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='student')  # Ajouter ce champ

    class Meta:
        model = User
        fields = ["id", "username", "password", "role"]  # Ajouter 'role'
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            role=validated_data['role'],  # Ajouter le rôle
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
     

class RoleSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'created_at', 'users']            