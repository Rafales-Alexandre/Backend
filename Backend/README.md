# BACKEND API v1.0
Première approche concernant le javascript et node.js

J'ai commencé dans un premier temps à créer le projet avec les commandes suivantes :
-npm init -y

On créer un fichier index.js.
Puis l'installation des dépendances :
-npm i -s express nodemon bcrypt body-parser cookie-parser jsonwebtoken crypto

Afin que notre server se relance à chaque modification nous avons dans le package.json ajouté à la partie start "nodemon index.js"

Ensuite on met en place nos différentes variable et modules pour procéder à la création de l'api.

On définit l'app.listen pour pouvoir nous connecter à notre server ici 3000.

Pour le bien du TD j'ai créé 4 model.js pour chacune des options, ici la création des utilisateurs, l'envoie et la lecture de message, l'envoie et lecture d'une discussion et une dernière pour le cryptage des cookies.

les trois premières sont composé de deux fonctions une de lecture et une d'écriture, celle du cryptage de deux fonctions également une pour le cryptage et l'autre pour le décryptage.

Et les trois premières sont liée à un fichier .json du même nom qui servira de base de données.

Ensuite dans notre index.js on a procédé à la création des routes:

Utilisateur(/users): avec le post pour la création d'un utilisateur ainsi que le cryptage du password.

Authentification(/auth): cela nous permet de nous identifier et de procéder à la création d'un cookie qui nous permettra d'être reconnue sur le server tant qu'il est actif on y a ajouté la lecture du password crypté pour que les comptes utilisateurs puisse être identifié.

Contrôle d'identité(/users/me): permet de voir notre nom d'utilisateur sur lequel nous somme connecté, plus précisément le cookie.

Message(/messenger): permet de récupérer notre fichier messenger.json ainsi que de rajouter des messages, chaque message envoyé affichera le nom d'utilisateur du cookie automatiquement.

Discussion(/Discus): permet de créer des discussion ainsi que des cookies crypté de ces discussion pour permettre à l'utilisateur en cours d'y accéder et d'y écrire.

Je voulais créer une partie liée avec la fonction messenger mais je n'y suis pas arrivé et l'application crash.
