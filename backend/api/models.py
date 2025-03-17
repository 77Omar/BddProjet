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
    

class Etudiant(models.Model):
    """
    Represente un etudiant heritant de user
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    numero_etudiant = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.user.username

class Professeur(models.Model):
    """
    Represente un professeur qui herite de user
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matricule = models.CharField(max_length=20, unique=True)
    specialite = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} ({self.specialite})"

class Sujet(models.Model):
    """
    Représente un Sujet.
    """
    prof = models.ForeignKey(Professeur, on_delete=models.CASCADE, related_name='sujets')
    titre = models.CharField(max_length=255,null=True, blank=True, default=None)
    description = models.TextField(null=True, blank=True, default=None)
    file = models.FileField(upload_to='uploads/') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre


class Exercise(models.Model):
    """
    Représente un exercice dans un Sujet.
    """
    sujet = models.ForeignKey(Sujet, on_delete=models.CASCADE, related_name='exercises')
    titre = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titre} (Sujet: {self.sujet.titre})"


class CorrectionModel(models.Model):
    """
    Représente un modèle de correction pour un exercice.
    """
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='correction_models')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Exercise: {self.exercise.titre})"
    
class Reponse(models.Model):
    """
    Represente une reponse soumis par un etudiant
    """
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='reponses')
    sujet = models.ForeignKey(Sujet, on_delete=models.CASCADE, related_name='reponses')
    matiere = models.CharField(max_length=50)
    correction_IA = models.TextField(null=True, blank=True, default=None)
    note_IA =models.FloatField(null=True, blank=True, default=None) 
    note_prof = models.FloatField(null=True, blank=True, default=None)
    file = models.FileField(upload_to='uploads/') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
         return f"{self.etudiant.user.username} - {self.sujet.titre}"