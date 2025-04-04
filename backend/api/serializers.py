from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Correction, Exercice

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']
"""
"""
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']

    def validate_role(self, value):
        """ Vérifie que le rôle est valide """
        if value not in ['prof', 'etudiant']:
            raise serializers.ValidationError("Le rôle doit être 'prof' ou 'etudiant'.")
        return value

    def create(self, validated_data):
        """ Crée un nouvel utilisateur avec un mot de passe hashé """
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class ExerciceSerializer(serializers.ModelSerializer):
    professeur=UserSerializer()
    class Meta:
        model = Exercice
        fields = '__all__'

class CorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correction
        fields = '__all__'