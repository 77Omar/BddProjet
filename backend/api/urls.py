from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import (
    CorrectionListAPIView,
    CorrectionViewSet,
    CurrentUserView,
    FichierExerciceView,
    UserViewSet,
    register_view,
    logout_view,
    ExerciceViewSet,
    soumettre_reponse,
    FichierReponseView,

)

router = DefaultRouter()
router.register(r'exercises', ExerciceViewSet)
router.register(r'notes', CorrectionViewSet)
router.register(r'users', UserViewSet)

auth_patterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]

urlpatterns = [
    path('correction/', soumettre_reponse, name='correction'),
    path('api/Mes_notes/', CorrectionListAPIView.as_view(), name='correction-list'),
    path('api/exercices/<int:pk>/fichier/', FichierExerciceView.as_view()),
    path('api/reponse/<int:pk>/fichier/', FichierReponseView.as_view()),

    path('api/auth/', include(auth_patterns)),
    path('api/', include(router.urls)),
]