import re
import ollama

def extraire_note_feedback(output):
    # Regex plus permissive pour la note
    note_match = re.search(
        r'note\s*[:=-]\s*(\d+(?:\.\d+)?)\s*/\s*20', 
        output, 
        re.IGNORECASE
    )
    
    # Regex améliorée pour le feedback
    feedback_match = re.search(
        r'feedback\s*[:=-]\s*(.+?)(?=(?:\n\s*[A-Z]+[:=-]|$))', 
        output, 
        re.IGNORECASE | re.DOTALL
    )
    
    note = float(note_match.group(1)) if note_match else 0.0
    feedback = feedback_match.group(1).strip() if feedback_match else "Aucun feedback généré."
    
    if not note_match:
        feedback = "Aucun feedback généré.\n⚠️ Format de note incorrect dans la réponse de l'IA."
    
    return note, feedback

def corriger_exercice(texte_reponse, texte_exercice):
    prompt = f"""
Tu es un professeur de base de données.

Voici l'exercice donné :
{texte_exercice}

Voici la réponse de l'étudiant :
{texte_reponse}

Corrige cette réponse, attribue une NOTE sur 20, puis donne un feedback clair. 

Réponds STRICTEMENT dans ce format :

NOTE: X/20  
FEEDBACK: ton commentaire ici...

Exemple :  
NOTE: 14.5/20  
FEEDBACK: La structure générale est bonne, mais certaines requêtes SQL sont mal formulées. Par exemple...

Attention, ne mets RIEN d’autre que ce format.
"""


    try:
        response = ollama.chat("deepseek-coder", messages=[{"role": "user", "content": prompt}])
        output = response["message"]["content"].strip()

        print("🧠 Réponse brute de l'IA :", output)

        note, feedback = extraire_note_feedback(output)

        # 🔁 Retry une fois si la note n'a pas été trouvée
        if note == 0.0:
            retry_prompt = f"""
Corrige ce devoir :

ENONCÉ : {texte_exercice}

RÉPONSE : {texte_reponse}

Donne UNIQUEMENT :
NOTE: x/20  
FEEDBACK: ton feedback ici...
Aucun mot en dehors de ce format.
"""
            retry_response = ollama.chat("deepseek-coder", messages=[{"role": "user", "content": retry_prompt}])
            retry_output = retry_response["message"]["content"].strip()
            print("🔁 Deuxième tentative de l'IA :", retry_output)
            note, feedback = extraire_note_feedback(retry_output)

        return note, feedback

    except Exception as e:
        return 0.0, f"❌ Erreur IA : {str(e)}"
