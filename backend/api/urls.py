from django.urls import path
from .views import RoleListCreate, RoleUpdate, RoleDelete

urlpatterns = [
    path('roles/', RoleListCreate.as_view(), name='role-list-create'),
    path('roles/<int:pk>/', RoleUpdate.as_view(), name='role-update'),
    path('roles/delete/<int:pk>/', RoleDelete.as_view(), name='role-delete'),
]
