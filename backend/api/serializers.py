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
    
"""
class ExerciceSerializer(serializers.ModelSerializer):
    # Pour la lecture (GET)
    professeur = UserSerializer(read_only=True)
    
    # Pour l'écriture (POST/PUT/PATCH)
    professeur_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='professeur',
        write_only=True
    )

    class Meta:
        model = Exercice
        fields = ['id', 'titre', 'fichier', 'date_creation', 'professeur', 'professeur_id']
"""

class ExerciceSerializer(serializers.ModelSerializer):
    professeur = UserSerializer(read_only=True)
    professeur_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='professeur',
        write_only=True
    )
    # Nouveau champ en lecture seule
    a_repondu = serializers.SerializerMethodField()

    class Meta:
        model = Exercice
        fields = ['id', 'titre', 'fichier', 'date_creation', 
                'professeur', 'professeur_id', 'a_repondu']

    def get_a_repondu(self, obj):
        # Récupère l'utilisateur connecté depuis le contexte
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Vérifie si une correction existe pour cet exercice et cet utilisateur
            return Correction.objects.filter(
                exercice=obj,
                etudiant=request.user
            ).exists()
        return False

class CorrectionSerializer(serializers.ModelSerializer):
    professeur_id = serializers.IntegerField(source='exercice.professeur.id', read_only=True)
    professeur_username = serializers.CharField(source='exercice.professeur.username', read_only=True)
    exercice_titre = serializers.CharField(source='exercice.titre', read_only=True)

    class Meta:
        model = Correction
        fields = [
            'id',
            'exercice',
            'exercice_titre',
            'etudiant',
            'fichier_reponse',
            'note',
            'feedback',
            'auto_note',
            'feedback_ia',
            'date',
            'professeur_id',  
            'professeur_username'  
        ]