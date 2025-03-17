from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, RoleSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Role
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status,viewsets, permissions
from django.contrib.auth import get_user_model

#create your views here
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data.get('password'))
        user.save()    

#API d’authentification qui retourne le rôle de l'utilisateur.

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            username = request.data.get("username")
            try:
                user = User.objects.get(username=username)
                response.data["role"] = user.role
                response.data["user_id"] = user.id  # Optionnel pour le frontend
            except User.DoesNotExist:
                return Response(
                    {"error": "Utilisateur non trouvé"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return response


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


    