from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import (
    CorrectionViewSet,
    CurrentUserView,
    FichierExerciceView,
    UserViewSet,
    register_view,
    logout_view,
    ExerciceViewSet,
    # Vos autres ViewSets...
)

router = DefaultRouter()
router.register(r'exercises', ExerciceViewSet)
router.register(r'correction', CorrectionViewSet)
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
    path('api/exercices/<int:pk>/fichier/', FichierExerciceView.as_view()),
    path('api/auth/', include(auth_patterns)),
    path('api/', include(router.urls)),
]