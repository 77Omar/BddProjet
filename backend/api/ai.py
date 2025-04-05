import re
import ollama

def corriger_exercice(texte_reponse, texte_exercice):
    prompt = f"""
Tu es un professeur de bases de données.

Voici l'énoncé de l'exercice :
{texte_exercice}

Voici la réponse de l'étudiant :
{texte_reponse}

Corrige cette réponse.

Ta réponse doit OBLIGATOIREMENT suivre exactement ce format :

NOTE: X/20  
FEEDBACK: ton commentaire ici...

Remplace X par une note décimale entre 0 et 20 (exemple : 14.5/20). N'écris RIEN d'autre. Pas de phrases avant ou après. Juste le format demandé.
"""

    try:
        # Appel à l'IA
        response = ollama.chat("deepseek-coder", messages=[{"role": "user", "content": prompt}])
        output = response["message"]["content"]

        # Extraction de la note
        match = re.search(r'NOTE:\s*(\d+(?:\.\d+)?)/20', output)
        note = float(match.group(1)) if match else 0.0

        # Extraction du feedback
        feedback_match = re.search(r'FEEDBACK:\s*(.+)', output, re.DOTALL)
        feedback = feedback_match.group(1).strip() if feedback_match else "Aucun feedback généré."

        # Si la note n’a pas été trouvée, ajouter une indication
        if note == 0.0 and not match:
            feedback += "\n L'IA n'a pas fourni de note correctement formatée (NOTE: x/20)."

        return note, feedback

    except Exception as e:
        return 0.0, f"Erreur IA : {str(e)}"
