from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [('prof', 'Professeur'), ('etudiant', 'Étudiant'),('admin', 'admin')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='etudiant')
    google_id = models.CharField(max_length=255, blank=True, null=True)
    github_id = models.CharField(max_length=255, blank=True, null=True)
    microsoft_id = models.CharField(max_length=255, blank=True, null=True)
    
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
    note = models.FloatField(default=0) # note du prof
    feedback = models.TextField(blank=True, null=True) # commentaire du prof
    auto_note = models.FloatField(default=0)  # Note initiale attribuée par l'IA
    feedback_ia = models.TextField(blank=True, null=True)  # Commentaires de l'IA
    date = models.DateTimeField(auto_now_add=True,null=True)

    def __str__(self):
        return f"Correction de {self.etudiant.username} pour {self.exercice.titre}"


class CorrectionAuto(models.Model):
    """
    permet d'enregistrer les corrections automatiques des exercice 
    """
    exercice = models.ForeignKey(Exercice, on_delete=models.CASCADE, related_name='corrections_auto')
    correction = models.TextField() 
    etat = models.BooleanField(default=False) 
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Correction auto pour {self.exercice.titre} ({'Validée' if self.etat else 'En attente'})"