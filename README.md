# Natalis - Gestion de la natalite

L'application devra permettre de :
L'application permet d'enregistrer et de suivre les actes de naissance d'une commune.

## Fonctionnalites

- Authentification JWT avec roles `admin` et `agent`.
- Tableau de bord avec total, repartition filles/garcons et lieux recenses.
- Creation, consultation, recherche, modification et suppression des dossiers.
- Recherche par nom, prenom, parent, lieu ou numero d'acte.
- Administration des utilisateurs reservee aux administrateurs.
- Export CSV des dossiers visibles dans le registre.
- Interface responsive servie directement par Express depuis `frontend/`.

## Installation

1. Copier `backend/.env.example` vers `backend/.env` et renseigner MongoDB et le secret JWT.
2. Installer les dependances : `cd backend` puis `npm install`.
3. Creer le premier administrateur : `node createAdmin.js`.
4. Demarrer l'application : `npm start`.
5. Ouvrir `http://localhost:5000`.

Les identifiants de l'administrateur cree par `createAdmin.js` sont definis dans ce script. Changez-les avant un deploiement.
