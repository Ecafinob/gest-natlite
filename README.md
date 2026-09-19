# Natalis - Gestion de la natalite

Application web de gestion des actes de naissance d'une commune. Elle fournit une interface responsive, une API Express et une base MongoDB. L'authentification repose sur des tokens JWT et deux roles sont disponibles: `admin` et `agent`.

## Fonctionnalites

- Connexion et inscription avec mot de passe hache par `bcrypt`.
- Authentification JWT valable une heure.
- Tableau de bord avec statistiques par sexe et par lieu.
- Creation et consultation des actes de naissance.
- Recherche paginee par enfant, parent, lieu ou numero d'acte.
- Modification et suppression des actes reservees aux administrateurs.
- Gestion des utilisateurs reservee aux administrateurs.
- Export CSV des actes visibles dans le registre.
- Interface statique servie par Express en local et par Vercel en production.

## Architecture

```text
gest-natlite/
|-- api/                  Fonctions serverless Vercel
|-- backend/
|   |-- app.js            Configuration Express et routes
|   |-- server.js         Demarrage local sur le port 5000
|   |-- config/           Connexion MongoDB
|   |-- controllers/      Traitement des requetes HTTP
|   |-- middleware/       Authentification JWT et autorisation par role
|   |-- models/           Schemas Mongoose
|   |-- routes/           Routes de l'API
|   |-- services/         Acces aux donnees et logique metier
|   |-- utils/            Utilitaires, dont les numeros d'acte
|   |-- createAdmin.js    Creation du premier administrateur
|   `-- .env              Variables locales, non versionnees
|-- frontend/
|   |-- index.html        Page et templates de l'application
|   |-- app.js            Etat, appels API et interactions
|   `-- styles.css        Styles de l'interface
|-- vercel.json           Fonctions et rewrites Vercel
`-- package.json          Scripts et dependances
```

## Prerequis

- Node.js 18 ou une version plus recente.
- Un cluster MongoDB Atlas ou une instance MongoDB accessible.
- Une base de donnees et un utilisateur MongoDB autorise a s'y connecter.

## Installation locale

Depuis la racine du projet:

```bash
npm install
```

Copier `backend/.env.example` vers `backend/.env`, puis renseigner:

```env
MONGO_URI=mongodb+srv://utilisateur:mot-de-passe@cluster.mongodb.net/gest-natlite
JWT_SECRET=un-secret-long-et-aleatoire
```

Ne jamais publier ce fichier ni placer ces valeurs dans le frontend. Si le mot de passe MongoDB contient des caracteres speciaux, ils doivent etre encodes dans l'URL de connexion.

Demarrer le serveur:

```bash
npm start
```

L'application est disponible sur `http://localhost:5000`.

Le script `backend/createAdmin.js` cree un administrateur dans la base configuree par `MONGO_URI`. Avant de l'utiliser, remplacer les identifiants definis dans le script, puis executer:

```bash
cd backend
node createAdmin.js
```

## Variables d'environnement

| Variable | Obligatoire | Utilisation |
| --- | --- | --- |
| `MONGO_URI` | Oui | URL de connexion MongoDB |
| `JWT_SECRET` | Oui | Signature et verification des tokens JWT |
| `PORT` | Localement | Port du serveur Express, `5000` par defaut |

En production, les variables doivent etre configurees dans Vercel pour l'environnement `Production`. Le fichier `backend/.env` n'est pas deploye par Vercel.

## Authentification

Connexion:

```http
POST /auth/login
Content-Type: application/json

{
	"email": "admin@example.com",
	"motDePasse": "mot-de-passe"
}
```

La reponse contient un token JWT. Pour les routes protegees, envoyer le token dans l'en-tete:

```http
Authorization: Bearer <jwt>
```

Apres un changement de `JWT_SECRET`, les anciens tokens deviennent invalides. Il faut se reconnecter et supprimer le token conserve dans le navigateur si necessaire.

## API

En local, les routes sont accessibles directement. Sur Vercel, prefixer les routes par `/api`.

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Creer un utilisateur agent |
| `POST` | `/auth/login` | Public | Ouvrir une session |
| `POST` | `/naissances` | Admin, agent | Creer un acte |
| `GET` | `/naissances` | Authentifie | Lister et rechercher les actes |
| `GET` | `/naissances/statistiques` | Authentifie | Obtenir les statistiques |
| `GET` | `/naissances/numero-acte/:numeroActe` | Authentifie | Rechercher par numero |
| `GET` | `/naissances/:id` | Authentifie | Consulter un acte |
| `PUT` | `/naissances/:id` | Admin | Modifier un acte |
| `DELETE` | `/naissances/:id` | Admin | Supprimer un acte |
| `POST` | `/utilisateurs` | Admin | Creer un utilisateur |
| `GET` | `/utilisateurs` | Admin | Lister les utilisateurs |
| `GET` | `/utilisateurs/:id` | Admin | Consulter un utilisateur |
| `PUT` | `/utilisateurs/:id` | Admin | Modifier un utilisateur |
| `DELETE` | `/utilisateurs/:id` | Admin | Supprimer un utilisateur |

La liste des actes accepte les parametres `page`, `limit` et `recherche`. Exemple:

```text
GET /naissances?page=1&limit=10&recherche=Martin
```

Un acte contient notamment `nomEnfant`, `prenomEnfant`, `sexe`, `dateNaissance`, `lieuNaissance`, `nomPere` et `nomMere`. Le `numeroActe` est genere automatiquement lors de la creation.

## Deploiement sur Vercel

1. Importer le depot avec la racine du projet `gest-natlite` comme **Root Directory**.
2. Ajouter `MONGO_URI` et `JWT_SECRET` dans **Settings > Environment Variables** pour `Production`.
3. Verifier que MongoDB Atlas autorise les connexions provenant de Vercel, par exemple avec `0.0.0.0/0` si cette ouverture est acceptable pour ton environnement.
4. Deployer ou redeployer le projet apres chaque modification des variables.
5. Tester `https://ton-domaine.vercel.app/api/auth/login`.

Vercel utilise `api/[...path].js` comme fonction serverless. Il ne faut pas configurer un port Vercel: `PORT` est utilise uniquement par le serveur local `backend/server.js`.

## Depannage

- `404`: verifier le Root Directory et l'URL `/api/...` en production.
- `500 Base de donnees indisponible`: verifier `MONGO_URI`, le mot de passe encode et les autorisations reseau MongoDB Atlas.
- `401 Email ou mot de passe incorrect`: verifier que l'utilisateur existe dans la base ciblee par le `MONGO_URI` de Vercel.
- `401 Token invalide ou expire`: se reconnecter apres un changement de `JWT_SECRET`.
- Les logs de la fonction sont disponibles dans **Vercel > Deployments > Functions > Logs**.

## Securite

- Ne jamais committer `.env`, les mots de passe ou les secrets JWT.
- Changer les identifiants par defaut du script `createAdmin.js`.
- Utiliser un secret JWT aleatoire, long et different entre developpement et production.
- Limiter les acces MongoDB Atlas aux reseaux necessaires lorsque l'infrastructure le permet.
