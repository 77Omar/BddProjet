from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Correction, CorrectionAuto, Exercice

User = get_user_model()

""" class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role'] """
"""
"""
class UserSerializer(serializers.ModelSerializer):
    #role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='etudiant')
    #avatar = serializers.ImageField(required=False, allow_null=True)
    #password = serializers.CharField(write_only=True)  # Ajouter ceci

    class Meta:
        model = User
        fields = [
           'id',
            'username',
            'password',  
            'email',
            'first_name',
            'last_name', 
            'role',
            'phone',
            'is_active',
            'date_joined'
        ]
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)  # ← Ne crash pas si password est absent
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  # ← Optionnel : pour éviter un compte sans mot de passe
        user.save()
        return user

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'password', 'role']

#     def validate_role(self, value):
#         """ Vérifie que le rôle est valide """
#         if value not in ['prof', 'etudiant', 'admin']:  # Ajoutez 'admin' ici
#             raise serializers.ValidationError("Le rôle doit être 'prof', 'etudiant' ou 'admin'.")
#         return value

#     def create(self, validated_data):
#         """ Crée un nouvel utilisateur avec un mot de passe hashé """
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password'],
#             role=validated_data['role']
#         )
#         return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'password', 'phone', 'role', 'is_active'
        ]

    def validate_role(self, value):
        if value not in ['prof', 'etudiant', 'admin']:
            raise serializers.ValidationError("Le rôle doit être 'prof', 'etudiant' ou 'admin'.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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

class CorrectionAutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectionAuto
        fields = ['id', 'exercice', 'correction', 'etat', 'date_creation', 'date_modification']
        read_only_fields = ['date_creation', 'date_modification']