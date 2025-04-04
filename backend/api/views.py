from rest_framework import viewsets, permissions
from .serializers import CorrectionSerializer, UserSerializer, ExerciceSerializer
from .models import User, Exercice, Correction
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.views import APIView

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from django.http import FileResponse
from .models import Exercice

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}

"""

"""
@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def register_view(request):
    if request.method == 'OPTIONS':
        return Response(status=200)
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({
            'token': token, 
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""

"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Invalide le token

        return Response({"message": "Déconnexion réussie"}, status=200)
    except Exception as e:
        return Response({"error": "Token invalide"}, status=400)

"""

"""
class UserViewSet(viewsets.ReadOnlyModelViewSet):  # ReadOnly pour la sécurité
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAdminUser]  # Seul l'admin peut voir tous les users


"""
"""
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
"""
"""
class ExerciceViewSet(viewsets.ModelViewSet):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer
    #permission_classes = [permissions.IsAuthenticated]  # Accessible à tout user connecté

"""
"""
class CorrectionViewSet(viewsets.ModelViewSet):
    queryset = Correction.objects.all()
    serializer_class = CorrectionSerializer
    #permission_classes = [permissions.IsAuthenticated]  # Accessible à tout user connecté
"""

"""
class FichierExerciceView(APIView):
    def get(self, request, pk):
        exercice = Exercice.objects.get(pk=pk)
        return FileResponse(open(exercice.fichier.path, 'rb'))