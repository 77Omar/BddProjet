from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RoleListCreate, RoleUpdate, RoleDelete, UserViewSet

# Création du router pour UserViewSet
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# URL patterns pour les rôles
urlpatterns = [
    path('roles/', RoleListCreate.as_view(), name='role-list-create'),
    path('roles/<int:pk>/', RoleUpdate.as_view(), name='role-update'),
    path('roles/delete/<int:pk>/', RoleDelete.as_view(), name='role-delete'),
]

# Ajout des routes générées par le router
urlpatterns += router.urls
