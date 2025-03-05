from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, RoleSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Role

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


    