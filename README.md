# Shift Optimizer

API REST backend pour la **génération automatique de plannings** en entreprise, avec gestion des contraintes employés et algorithme d'optimisation.

> Projet personnel — Frontend React avecgamification? en cours de développement. Backend également en cours de développement.

---

## Stack technique

- **Node.js** + **TypeScript**
- **Fastify** — framework web rapide et moderne
- **Prisma** — ORM avec migrations
- **PostgreSQL** (Prisma Postgres Cloud)
- **JWT** — authentification sécurisée
- **Bcrypt** — hashage des mots de passe

---

## Installation

### Prérequis

- Node.js v24+ (LTS)
- Un compte [Prisma Postgres](https://prisma.io)

### Étapes

```bash
# Cloner le repo
git clone https://github.com/nanadocte/shift-optimizer.git
cd shift-optimizer

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```
---

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="votre_url_prisma_postgres"
JWT_SECRET="votre_clé_secrète_jwt"
```

---

##  Lancement

```bash
# Développement (hot reload)
npm run dev

# Visualiser la base de données
npx prisma studio

# Le serveur démarre sur http://localhost:3000
```


---

## Endpoints API

### Auth
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/auth/login` | Connexion | ❌ |

### Utilisateurs
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/users` | Tous les utilisateurs | ✅ |
| GET | `/users/:id` | Un utilisateur | ✅ |
| POST | `/users` | Créer un utilisateur | ✅ Admin |
| PUT | `/users/:id` | Modifier un utilisateur | ✅ Admin/Owner |
| DELETE | `/users/:id` | Supprimer un utilisateur | ✅ Admin/Owner |

### Préférences & Contraintes
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/preferences` | Toutes les préférences | ✅ |
| POST | `/preferences` | Créer une préférence | ✅ |
| PUT | `/preferences/:id` | Modifier | ✅ |
| DELETE | `/preferences/:id` | Supprimer | ✅ |
| GET | `/contraintes` | Toutes les contraintes | ✅ |
| POST | `/contraintes` | Créer une contrainte | ✅ |
| PUT | `/contraintes/:id` | Modifier | ✅ |
| DELETE | `/contraintes/:id` | Supprimer | ✅ |

### Planning
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/shifts` | Tous les shifts | ✅ |
| POST | `/shifts` | Créer un shift | ✅ |
| PUT | `/shifts/:id` | Modifier un shift | ✅ |
| DELETE | `/shifts/:id` | Supprimer un shift | ✅ |
| GET | `/shiftstemplates` | Tous les templates | ✅ |
| POST | `/shiftstemplates` | Créer un template | ✅ Admin |
| PUT | `/shiftstemplates/:id` | Modifier | ✅ Admin |
| DELETE | `/shiftstemplates/:id` | Supprimer | ✅ Admin |
| POST | `/planning/generate` | Générer le planning | ✅ Admin |

### Générer un planning

```json
POST /planning/generate
{
  "weekStart": "2026-03-09",
  "allowOverTime": false
}
```

---

## Algorithme de génération

L'algorithme génère automatiquement un planning hebdomadaire en respectant :

1. **Le job requis** — seuls les employés avec le bon poste sont éligibles
2. **Les contraintes** — indisponibilités récurrentes ou ponctuelles avec vérification des chevauchements horaires
3. **Les heures contractuelles** — calcul mensuel légal (151.67h pour un 35h) 
4. **L'équité** — priorité aux employés ayant le moins d'heures ce mois
5. **Les événements ponctuels** — ShiftTemplates avec date précise

En cas de manque de personnel, un `warning` est retourné pour alerter le manager. Possibilité d'heure supplémentaires si "allowOverTime" = true

---

## Structure du projet

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   └── planning/
│       ├── planning.routes.ts
│       ├── planning.controller.ts
│       └── planning.service.ts
├── plugins/
│   └── authentification.ts
└── index.ts
prisma/
└── schema.prisma
```

---

## Améliorations prévues

- Frontend React (possibilité de gamification ?)
- Gestion des préférences dans l'algorithme
- Jours de repos obligatoires (2 consécutifs)
- Système d'invitation par mail
- Tests automatisés
- Gestion de routes sécurisées pour planning, contraintes et préférences.