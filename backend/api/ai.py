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
NOTE: 13.5/20  
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


"""

"""

def corriger_exercice2(texte_exercice):
    prompt = f"""
SYSTÈME: Vous êtes un professeur de bases de données. Vous devez fournir UNIQUEMENT les corrections techniques des questions ci-dessous.

EXERCICE :
{texte_exercice}

FORMAT DE RÉPONSE EXIGÉ :
-----DEBUT CORRECTION-----
1) [une seule ligne SQL valide sans commentaire]
2) [une seule ligne SQL valide sans commentaire]
...
-----FIN CORRECTION-----

CONSIGNES STRICTES :
- PAS de commentaires SQL (ni `--`, ni `#`)
- PAS de texte hors des marqueurs
- PAS de code inutile ou de justifications
- UNE seule ligne SQL par question, terminée par `;`

SANCTION :
Le non-respect du format entraînera la suppression automatique de la réponse.
"""

    try:
        response = ollama.chat("deepseek-coder", messages=[{"role": "user", "content": prompt}])
        output = response["message"]["content"].strip()
        print("🧠 Réponse brute de l'IA :", output)

        # Extraire uniquement ce qu’il y a entre les deux marqueurs
        match = re.search(r"-----DEBUT CORRECTION-----\s*(.*?)\s*-----FIN CORRECTION-----", output, re.DOTALL)
        if not match:
            return "Aucune correction générée."

        bloc = match.group(1).strip()

        # Nettoyage agressif :
        bloc = re.sub(r'--.*', '', bloc)  # supprimer commentaires "--"
        bloc = re.sub(r'#.*', '', bloc)   # supprimer commentaires "#"
        bloc = re.sub(r'\(.*?supprim.*?\)', '', bloc, flags=re.IGNORECASE)  # supprimer justifications entre parenthèses
        bloc = re.sub(r'`', '', bloc)  # supprimer accents de code
        bloc = re.sub(r'[^;\n]+;', lambda m: m.group(0).strip() + '\n', bloc)  # s'assurer qu'on a une ligne par requête

        # Extraire requêtes numérotées
        corrections = re.findall(r'(\d\))\s*(.+?;)', bloc)
        if not corrections:
            return "Aucune correction générée."

        return {num: sql.strip() for num, sql in corrections}

    except Exception as e:
        return "Aucune correction générée.", f"❌ Erreur IA : {str(e)}"
    




def corriger_exercice22(texte_exercice):
    prompt = f"""
SYSTÈME: Vous êtes un professeur de bases de données. Vous devez fournir UNIQUEMENT les corrections techniques des questions ci-dessous.

EXERCICE :
{texte_exercice}

FORMAT DE RÉPONSE EXIGÉ :
-----DEBUT CORRECTION-----
1) [une seule ligne SQL valide sans commentaire]
...
-----FIN CORRECTION-----

CONSIGNES STRICTES :
- PAS de commentaires SQL (ni `--`, ni `#`)
- PAS de texte hors des marqueurs
- PAS de code inutile ou de justifications
- UNE seule ligne SQL par question, terminée par `;`

SANCTION :
Le non-respect du format entraînera la suppression automatique de la réponse.
"""

    try:
        response = ollama.chat("deepseek-coder", messages=[{"role": "user", "content": prompt}])
        output = response["message"]["content"]
        print("🧠 Réponse brute de l'IA :", output)

        # 1. Essayer d'extraire via les balises
        match = re.search(r"-----DEBUT CORRECTION-----\s*(.*?)\s*-----FIN CORRECTION-----", output, re.DOTALL)
        if match:
            bloc = match.group(1)
        else:
            bloc = re.sub(r'```sql|```', '', output)  # Retirer bloc Markdown s'il y a
            bloc = output  # fallback au texte brut

        # Nettoyage agressif
        bloc = re.sub(r'--.*', '', bloc)
        bloc = re.sub(r'#.*', '', bloc)
        bloc = re.sub(r'\(.*?supprim.*?\)', '', bloc, flags=re.IGNORECASE)
        bloc = re.sub(r'`', '', bloc)

        # 2. Essayer les lignes numérotées
        corrections = re.findall(r'(\d\))\s*(.+?;)', bloc)
        if corrections:
            return {num: sql.strip() for num, sql in corrections}

        # 3. Sinon : capturer la première requête SQL plausible
        requete_match = re.search(r'(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE).*?;', bloc, re.IGNORECASE | re.DOTALL)
        if requete_match:
            requete = requete_match.group(0).strip()
            return {'1)': requete}

        return "Aucune correction générée."

    except Exception as e:
        return "Aucune correction générée.", f"❌ Erreur IA : {str(e)}"




