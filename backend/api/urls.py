from django.urls import include, path
from .views import CorrectionModelViewSet, EtudiantViewSet, ExerciseViewSet, ProfesseurViewSet, ReponseViewSet, RoleListCreate, RoleUpdate, RoleDelete, SujetViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'professeurs', ProfesseurViewSet)
router.register(r'sujets', SujetViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'correction-models', CorrectionModelViewSet)
router.register(r'reponses', ReponseViewSet)

urlpatterns = [
    path('roles/', RoleListCreate.as_view(), name='role-list-create'),
    path('roles/<int:pk>/', RoleUpdate.as_view(), name='role-update'),
    path('roles/delete/<int:pk>/', RoleDelete.as_view(), name='role-delete'),
    
    path('api/', include(router.urls)),
]
