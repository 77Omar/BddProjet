from venv import logger
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
from .ai import corriger_exercice
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
import fitz  # PyMuPDF
from django.http import FileResponse
from .models import Exercice
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


"""
"""

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            username = request.data.get("username")
            try:
                user = User.objects.get(username=username)
                response.data["role"] = user.role
                response.data["user_id"] = user.id 
            except User.DoesNotExist:
                return Response(
                    {"error": "Utilisateur non trouvé"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return response
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
    #permission_classes = [permissions.IsAdminUser] 


"""
"""
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
"""
class ExerciceViewSet(viewsets.ModelViewSet):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer
    #permission_classes = [permissions.IsAuthenticated] 
"""


class ExerciceViewSet(viewsets.ModelViewSet):
    queryset = Exercice.objects.all()
    serializer_class = ExerciceSerializer

    def get_serializer_context(self):
        # Passe la requête au serializer
        context = super().get_serializer_context()
        context['request'] = self.request
        return context 
"""
"""
class CorrectionViewSet(viewsets.ModelViewSet):
    queryset = Correction.objects.all()
    serializer_class = CorrectionSerializer
    #permission_classes = [permissions.IsAuthenticated] 
"""

"""
class FichierExerciceView(APIView):
    def get(self, request, pk):
        exercice = Exercice.objects.get(pk=pk)
        return FileResponse(open(exercice.fichier.path, 'rb'))

"""
"""
class FichierReponseView(APIView):
    def get(self, request, pk):
        reponse = Correction.objects.get(pk=pk)
        return FileResponse(open(reponse.fichier_reponse.path, 'rb'))
    
"""

"""

def extraire_texte_pdf(fichier_pdf):
    """
    Prend un fichier PDF  et retourne le texte extrait.
    """
    texte = ""
    with fitz.open(stream=fichier_pdf.read(), filetype="pdf") as doc:
        for page in doc:
            texte += page.get_text("text")
    return texte.strip()

"""
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def soumettre_reponse(request):
    """
    Soumet une réponse PDF et déclenche la correction automatique.
    Données attendues:
    - exercice: ID de l'exercice (obligatoire)
    - etudiant: ID de l'étudiant (optionnel, normalement déduit du token)
    - fichier_reponse: Fichier PDF à corriger (obligatoire)
    """
    try:
        # 1. Validation des données entrantes
        exercice_id = request.data.get('exercice')
        if not exercice_id:
            return Response({'message': 'Le champ "exercice" est obligatoire'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        fichier_reponse = request.FILES.get('fichier_reponse')
        if not fichier_reponse:
            return Response({'message': 'Aucun fichier réponse fourni'}, 
                          status=status.HTTP_400_BAD_REQUEST)


        # 2. Vérification du type de fichier
        if not fichier_reponse.name.lower().endswith('.pdf'):
            return Response({'message': 'Le fichier doit être au format PDF'}, 
                          status=status.HTTP_400_BAD_REQUEST)


        # 3. Récupération de l'exercice
        try:
            exercice = Exercice.objects.get(id=exercice_id)
        except Exercice.DoesNotExist:
            return Response({'message': 'Exercice non trouvé'}, 
                          status=status.HTTP_404_NOT_FOUND)


        # 4. Extraction du texte des PDF
        try:
            texte_reponse = extraire_texte_pdf(fichier_reponse)
            texte_exercice = extraire_texte_pdf(exercice.fichier)
        except Exception as e:
            return Response({'message': f'Erreur lors de la lecture des PDF: {str(e)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)


        # 5. Correction automatique
        try:
            note, feedback = corriger_exercice(
                texte_reponse=texte_reponse,
                texte_exercice=texte_exercice
            )
        except Exception as e:
            return Response({'message': f'Erreur lors de la correction: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 6. Création de la correction
        correction = Correction.objects.create(
            exercice=exercice,
            etudiant=request.user,  # On utilise l'user du token plutôt que celui envoyé
            fichier_reponse=fichier_reponse,
            auto_note=note,
            feedback_ia=feedback,
            note=note,  # Note initiale = note auto, modifiable par le prof ensuite
        )

        # 7. Retour de la réponse
        return Response(
            CorrectionSerializer(correction).data,
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        # Journalisation de l'erreur
        logger.error(f"Erreur inattendue dans soumettre_reponse: {str(e)}")
        return Response(
            {'message': 'Une erreur interne est survenue'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
#recuperer les correction du user
"""
class CorrectionListAPIView(APIView):
    def get(self, request):
        etudiant_id = request.query_params.get('etudiant_id')
        
        if not etudiant_id:
            return Response({"error": "etudiant_id parameter is required"}, status=400)
            
        corrections = Correction.objects.filter(etudiant=etudiant_id)
        serializer = CorrectionSerializer(corrections, many=True)
        return Response(serializer.data)
"""


class CorrectionListAPIView(APIView):
    def get(self, request):
        etudiant_id = request.query_params.get('etudiant_id')
        
        if not etudiant_id:
            return Response({"error": "etudiant_id parameter is required"}, status=400)
            
        corrections = Correction.objects.filter(etudiant=etudiant_id)\
                                      .select_related('exercice', 'exercice__professeur')
        
        serializer = CorrectionSerializer(corrections, many=True)
        return Response(serializer.data)