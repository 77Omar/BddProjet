from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Role, Etudiant, Professeur, Sujet, Exercise, CorrectionModel, Reponse

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'

class ProfesseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professeur
        fields = '__all__'

class SujetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sujet
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class CorrectionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectionModel
        fields = '__all__'

class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = '__all__'

"""
"""
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