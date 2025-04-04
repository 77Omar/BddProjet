from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [('prof', 'Professeur'), ('etudiant', 'Étudiant')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='etudiant')
    google_id = models.CharField(max_length=255, blank=True, null=True)
    github_id = models.CharField(max_length=255, blank=True, null=True)
    microsoft_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Ajoutez ces deux blocs juste après les champs existants
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True,
    )

class Exercice(models.Model):
    professeur = models.ForeignKey(User, on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    fichier = models.FileField(upload_to='exercices/')
    date_creation = models.DateTimeField(auto_now_add=True)

class Correction(models.Model):
    exercice = models.ForeignKey(Exercice, on_delete=models.CASCADE)
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE)
    fichier_reponse = models.FileField(upload_to='reponses/')
    note = models.FloatField(default=0)
    feedback = models.TextField(blank=True, null=True)
