from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Role


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only":True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
     

class RoleSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'created_at', 'users']            