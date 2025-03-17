from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from .serializers import CorrectionModelSerializer, EtudiantSerializer, ExerciseSerializer, ProfesseurSerializer, ReponseSerializer, SujetSerializer, UserSerializer, RoleSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CorrectionModel, Etudiant, Exercise, Professeur, Reponse, Role, Sujet

#create your views here
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Liste et création des rôles
class RoleListCreate(generics.ListCreateAPIView):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrer selon les rôles de l'utilisateur (si nécessaire)
        return Role.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

# Mise à jour d'un rôle
class RoleUpdate(generics.UpdateAPIView):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Role.objects.all()

# Suppression d'un rôle
class RoleDelete(generics.DestroyAPIView):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrer pour ne permettre que la suppression de rôles spécifiques si nécessaire
        return Role.objects.all()

    def perform_destroy(self, instance):
        instance.delete()

"""

"""
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    
class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

class ProfesseurViewSet(viewsets.ModelViewSet):
    queryset = Professeur.objects.all()
    serializer_class = ProfesseurSerializer

class SujetViewSet(viewsets.ModelViewSet):
    queryset = Sujet.objects.all()
    serializer_class = SujetSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class CorrectionModelViewSet(viewsets.ModelViewSet):
    queryset = CorrectionModel.objects.all()
    serializer_class = CorrectionModelSerializer

class ReponseViewSet(viewsets.ModelViewSet):
    queryset = Reponse.objects.all()
    serializer_class = ReponseSerializer
    