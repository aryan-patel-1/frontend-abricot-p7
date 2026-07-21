# Abricot

Abricot est une application de gestion collaborative de projets et de tâches. Ce dépôt contient le frontend Next.js ; il communique avec une API Express et Prisma conservée dans un dépôt séparé.

## Fonctionnalités

- inscription et connexion avec une session JWT
- tableau de bord des tâches assignées en vue liste ou Kanban
- recherche locale dans les tâches du tableau de bord
- création et gestion de projets, contributeurs, tâches et commentaires
- génération de tâches avec une intelligence artificielle
- consultation du compte et déconnexion

## Technologies

- Next.js 16 et React 19
- TypeScript
- Tailwind CSS 4
- Vitest et Testing Library
- API Express, Prisma et SQLite côté backend

## Prérequis

- Node.js 20.9 ou une version plus récente
- npm
- le backend Abricot disponible, par défaut, sur `http://localhost:8000`

## Installation

Depuis ce dossier :

```bash
npm install
```

Le backend se trouve habituellement dans le dossier voisin `backend-abricot-p7-main`. Suivre son propre README pour préparer sa configuration, sa base SQLite et ses variables d’environnement, puis le démarrer avant le frontend.

## Configuration de l’API

Sans configuration supplémentaire, le frontend envoie ses requêtes vers `/api`. Les règles de réécriture de `next.config.ts` les transmettent alors au backend local sur le port `8000`.

Pour utiliser une autre adresse, créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Cette variable contient uniquement l’adresse publique du backend. Les secrets, notamment la clé utilisée par la génération IA, doivent rester dans la configuration du backend.

## Démarrage

```bash
npm run dev
```

Ouvrir ensuite [http://localhost:3000/login](http://localhost:3000/login). La documentation Swagger du backend est disponible sur [http://localhost:8000/api-docs](http://localhost:8000/api-docs) lorsque le serveur Express fonctionne.

## Organisation des données

Les pages et composants ne construisent pas directement les appels métier. Ils passent par les services de `app/services/` :

```txt
page ou composant
→ service métier
→ apiRequest
→ API Express
→ Prisma et SQLite
```

`apiRequest` ajoute les en-têtes JSON et, pour les routes protégées, le token enregistré dans le navigateur :

```txt
Authorization: Bearer <token>
```

La majorité des réponses du backend suivent cette enveloppe :

```ts
{
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

Le service renvoie seulement `data` aux pages et transforme les erreurs du backend en `ApiError`. La génération IA est une exception : son endpoint renvoie directement un tableau `tasks`, que le frontend valide avant de l’afficher.

## Routes principales

| Fonctionnalité | Page | Source des données |
| --- | --- | --- |
| Connexion | `/login` | `POST /auth/login` |
| Inscription | `/register` | `POST /auth/register` |
| Tableau de bord | `/main/dashboard` | `GET /dashboard/assigned-tasks` |
| Liste des projets | `/main/projects` | `GET /projects` |
| Détail d’un projet | `/main/projects/[id]` | `GET /projects/:id` et `GET /projects/:id/tasks` |
| Génération IA | modale du détail projet | `POST /api/ai/generate-tasks` |
| Profil | `/main/account` | session `abricot_user` enregistrée dans le navigateur |

La recherche du dashboard ne lance pas une nouvelle requête. Elle filtre en mémoire les tâches déjà récupérées, à partir de trois caractères, sur le titre, la description et le nom du projet.

La page de profil relit actuellement les informations sauvegardées lors de la connexion. Les routes backend de profil existent, mais ne sont pas encore utilisées par cet écran.

## Structure du frontend

```txt
app/
├── components/       composants, modales et hooks réutilisables
├── login/            page de connexion
├── register/         page d’inscription
├── main/
│   ├── account/      compte utilisateur
│   ├── dashboard/    tâches assignées
│   └── projects/     projets et détail des tâches
├── mocks/            données locales de démonstration
└── services/         appels API et gestion de session

__tests__/             tests des interactions principales
public/                images et icônes
```

## Mode mock

Le choix entre l’API réelle et les données de démonstration est centralisé dans `app/services/dataProvider.ts`. `USE_MOCK` doit rester désactivé pour utiliser le backend. Le mode mock est réservé au développement local.

## Commandes disponibles

```bash
npm run dev          # démarre le serveur de développement
npm run lint         # analyse le code avec ESLint
npx tsc --noEmit     # vérifie les types TypeScript
npm run test         # exécute les tests Vitest
npm run build        # crée le build de production
npm run start        # démarre le build de production
```
