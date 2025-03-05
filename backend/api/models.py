from django.db import models
from django.contrib.auth.models import User

   
# Création du modèle Role
class Role(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Lien avec l'utilisateur
    users = models.ManyToManyField(User, related_name='roles', blank=True)

    def __str__(self):
        return self.name   