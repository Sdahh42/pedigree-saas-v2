# 🐕 PedigreeApp SaaS v2

**Application web professionnelle de gestion d'élevage canin**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)

## 📋 Description

PedigreeApp SaaS est une application web moderne permettant aux éleveurs canins de gérer efficacement leur activité :

- **Gestion des chiens** : Fiches complètes, photos, santé, génétique
- **Pedigrees** : Visualisation et export PDF jusqu'à 10 générations
- **Reproduction** : Suivi des chaleurs, accouplements, portées
- **Génétique** : Calcul COI, prédiction des couleurs, tests génétiques
- **Clients** : Gestion des acheteurs, liste d'attente
- **Finances** : Ventes, dépenses, statistiques

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 20+**
- **PostgreSQL 16+**
- **Redis 7+** (optionnel en dev)

### Installation

```bash
# 1. Cloner le projet
git clone <repo> pedigree-saas-v2
cd pedigree-saas-v2

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Initialiser la base de données
npx prisma migrate dev

# 5. Lancer en développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
pedigree-saas-v2/
├── docs/                    # Documentation complète
│   ├── 01-ARCHITECTURE.md   # Architecture technique
│   ├── 02-USER-STORIES.md   # User stories
│   ├── 03-DATA-MODEL.md     # Modèle de données
│   ├── 04-API-REFERENCE.md  # Documentation API
│   ├── 05-DEPLOYMENT.md     # Guide de déploiement
│   └── 06-BUSINESS-LOGIC.md # Logique métier
│
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── seed.ts              # Données initiales
│
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── (auth)/          # Pages d'authentification
│   │   ├── (dashboard)/     # Pages du dashboard
│   │   ├── (marketing)/     # Pages publiques
│   │   └── api/             # Routes API
│   │
│   ├── components/          # Composants React
│   │   ├── ui/              # Composants UI (shadcn)
│   │   ├── forms/           # Formulaires
│   │   └── layout/          # Layout
│   │
│   ├── lib/                 # Utilitaires
│   ├── services/            # Logique métier
│   ├── hooks/               # Custom hooks
│   ├── stores/              # State management
│   └── types/               # Types TypeScript
│
├── public/                  # Assets statiques
└── scripts/                 # Scripts utilitaires
```

## 💰 Plans tarifaires

| Fonctionnalité | FREE | PRO (9,99€/mois) | ELITE (19,99€/mois) |
|----------------|------|------------------|---------------------|
| Chiens | 10 | 100 | Illimité |
| Portées | 3 | 50 | Illimité |
| Clients | 10 | 200 | Illimité |
| Pedigree (générations) | 3 | 5 | 10 |
| Calcul COI | ❌ | ✅ | ✅ |
| Prédiction couleurs | ❌ | ✅ | ✅ |
| Import Embark/Wisdom | ❌ | ❌ | ✅ |
| Export Excel | ❌ | ✅ | ✅ |
| Multi-élevages | ❌ | ❌ | Jusqu'à 5 |
| Support | Communauté | Email prioritaire | Prioritaire |

## 🛠️ Stack technique

### Frontend
- **Next.js 14** - Framework React avec App Router
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **TailwindCSS** - Styling
- **shadcn/ui** - Composants UI
- **React Query** - Gestion des données serveur
- **Zustand** - State management

### Backend
- **Next.js API Routes** - API REST
- **Prisma** - ORM
- **PostgreSQL** - Base de données
- **Redis** - Cache et sessions
- **NextAuth.js** - Authentification
- **Stripe** - Paiements

### Infrastructure
- **VPS Hostinger KVM4** - Hébergement
- **Nginx** - Reverse proxy
- **PM2** - Process manager
- **Let's Encrypt** - SSL

## 📚 Documentation

La documentation complète est disponible dans le dossier `/docs` :

1. **[Architecture](./docs/01-ARCHITECTURE.md)** - Stack technique et structure
2. **[User Stories](./docs/02-USER-STORIES.md)** - Fonctionnalités détaillées
3. **[Data Model](./docs/03-DATA-MODEL.md)** - Schéma de base de données
4. **[API Reference](./docs/04-API-REFERENCE.md)** - Documentation des endpoints
5. **[Deployment](./docs/05-DEPLOYMENT.md)** - Guide de déploiement VPS
6. **[Business Logic](./docs/06-BUSINESS-LOGIC.md)** - Algorithmes et règles métier

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Type checking
npm run type-check
```

## 🚀 Déploiement

Voir le [guide de déploiement](./docs/05-DEPLOYMENT.md) pour les instructions complètes.

```bash
# Build production
npm run build

# Démarrer en production
npm start
```

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre en mode développement |
| `npm run build` | Build de production |
| `npm start` | Démarre en production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run type-check` | Vérifie les types TypeScript |
| `npm run db:migrate` | Applique les migrations |
| `npm run db:studio` | Ouvre Prisma Studio |

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriétaire - Tous droits réservés.

## 📞 Support

- **Email** : support@pedigreeapp.com
- **Documentation** : [docs.pedigreeapp.com](https://docs.pedigreeapp.com)
