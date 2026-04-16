# 2025_2026_nsi_1e02_projet3_gp6

Giulio Neplaz
Bogdan Kaltrachian
Valentine Malavasi
Axel Viala

commande installe flask :
& 'c:\Users\valen\AppData\Local\Programs\Python\Python313\python.exe'-m pip install flask
& 'c:\Users\valen\AppData\Local\Programs\Python\Python313\python.exe'-m pip install node       # (with own user)

projet :
Jeu ==> course de voitures
vue : de haut (circuit, voiture contrôllable avec le clavier)
3 niveaux (3 circuits, de plus en plus de virages, 3 voitures à débloquer)
temps enregistré à chaque fois, le but est de battre son temps et les autres coureurs
JEU EN LIGNE ?? ==>  pythonanywhere (host python)
BOT VOITURE IA ????

etapes utilisation site web (point de vue utilisateur):
1. entrée site
2. entrée nom d'utilisateur, password
3. entrée dans le menu principal du jeu
4. choix du niveau entre 4 niveaux (affichage au-dessus: easy,medium,hard,impossible )
5. choix de voiture entre 3 voitures qui s'améliorent en fonction du niveau (avec leurs stats)
6. choix de circuit entre 3 circuits de plus en plus durs (ex: monaco)
7. appuyer bouton start (compte à rebours: feu tricolore de départ style F1)
8. possibilité d'appyuer sur pause (affichage trois boutons: continue, restart, quit)

etapes conception site web (point de vue developpeur):
1. hébergeur python (pythonanywhere)
2. mémoire (json)


parties code (architecture) :
front end HTML/JS, backend python
architecture proposée par IA :

/mon-projet
│
├── backend/                 # Code Python backend (Flask)
│   ├── app.py               # Point d’entrée de l’application Flask
│   ├── static/              # Fichiers statiques (JS, CSS, images)
│   │   ├── js/
│   │   │   └── game.js      # Code JavaScript du jeu
│   │   └── css/
│   │       └── style.css    # Styles CSS
│   ├── templates/           # Templates HTML (avec Jinja2)
│   │   └── index.html       # Page principale du jeu
│   └── data/
│       └── save.json        # Fichier JSON pour stocker les données du jeu
│
├── requirements.txt         # Dépendances Python
└── README.md                # Documentation du projet

description :
1. Backend (Flask)
app.py :
Sert la page HTML principale (index.html) via une route Flask.
Expose des API REST (ex : /api/save, /api/load) pour recevoir/envoyer des données JSON.
Lit et écrit dans data/save.json pour stocker les données du jeu.
2. Frontend (HTML/JS/CSS)
templates/index.html :

Page HTML chargée dans le navigateur.
Charge les fichiers JS et CSS depuis static/.
Contient la structure de la page et le canevas du jeu.
static/js/game.js :

Contient le code JavaScript du jeu (logique, animations, interactions).
Communique avec le backend via fetch() pour envoyer et recevoir des données JSON.
static/css/style.css :

Styles visuels pour le jeu et la page.
3. Données JSON
data/save.json :
Stocke des données persistantes (ex : scores, états de jeu).
Manipulé côté serveur via Python


To do :
augmenter longueur rectangle
design graphique : maisons et voitures a esquiver
+ barre vitesse 
menu déroulant accessible avec toches clavier 1234&é"' pour changer voitures
page accueil login
hébergement jeu en ligne
monétisation ?