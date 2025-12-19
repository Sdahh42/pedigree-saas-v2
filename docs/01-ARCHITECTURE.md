# 🏗️ Architecture Technique - PedigreeApp SaaS v2

## Vue d'ensemble

PedigreeApp SaaS est une application web moderne de gestion d'élevage canin, conçue pour être déployée sur un VPS Hostinger KVM4.

## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| **Next.js 14** | 14.x | App Router, SSR, API Routes intégrées |
| **React 18** | 18.x | UI moderne avec Suspense et Concurrent Features |
| **TypeScript** | 5.x | Typage fort, meilleure DX |
| **TailwindCSS** | 3.x | Styling rapide et cohérent |
| **shadcn/ui** | latest | Composants accessibles et personnalisables |
| **Zustand** | 4.x | State management léger |
| **React Query** | 5.x | Cache et synchronisation serveur |
| **React Hook Form** | 7.x | Formulaires performants |
| **Zod** | 3.x | Validation de schémas |
| **Recharts** | 2.x | Graphiques et visualisations |
| **Lucide React** | latest | Icônes modernes |

### Backend (API Routes Next.js + Services)
| Technologie | Version | Justification |
|-------------|---------|---------------|
| **Next.js API Routes** | 14.x | Serverless-ready, intégré au frontend |
| **Prisma** | 5.x | ORM type-safe avec migrations |
| **PostgreSQL** | 16.x | Base de données relationnelle robuste |
| **Redis** | 7.x | Cache, sessions, rate limiting |
| **NextAuth.js** | 5.x | Authentification complète |
| **Stripe** | latest | Paiements et abonnements |
| **Resend** | latest | Emails transactionnels |
| **Uploadthing** | latest | Upload de fichiers |

### Infrastructure (VPS Hostinger KVM4)
| Composant | Configuration |
|-----------|---------------|
| **OS** | Ubuntu 22.04 LTS |
| **Reverse Proxy** | Nginx |
| **Process Manager** | PM2 |
| **SSL** | Let's Encrypt (Certbot) |
| **Base de données** | PostgreSQL 16 (local) |
| **Cache** | Redis 7 (local) |
| **Backups** | Cron + rclone vers S3 |

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                         │
│                    - SSL Termination                             │
│                    - Rate Limiting                               │
│                    - Gzip Compression                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PM2 Process Manager                           │
│                    - Auto-restart                                │
│                    - Load Balancing                              │
│                    - Monitoring                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    FRONTEND (React)                      │    │
│  │  - Pages & Layouts (App Router)                         │    │
│  │  - Components (shadcn/ui)                               │    │
│  │  - State Management (Zustand + React Query)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API ROUTES                            │    │
│  │  - REST Endpoints (/api/*)                              │    │
│  │  - Server Actions                                       │    │
│  │  - Middleware (Auth, Rate Limit)                        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │   File Storage  │
│   - Users       │ │   - Sessions    │ │   - Images      │
│   - Dogs        │ │   - Cache       │ │   - Documents   │
│   - Litters     │ │   - Rate Limit  │ │   - Exports     │
│   - Clients     │ │                 │ │                 │
│   - Sales       │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Structure des Dossiers

```
pedigree-saas-v2/
├── docs/                          # Documentation
│   ├── 01-ARCHITECTURE.md         # Ce fichier
│   ├── 02-USER-STORIES.md         # User stories par fonctionnalité
│   ├── 03-DATA-MODEL.md           # Modèle de données
│   ├── 04-API-REFERENCE.md        # Documentation API
│   ├── 05-DEPLOYMENT.md           # Guide de déploiement
│   └── 06-BUSINESS-LOGIC.md       # Logique métier détaillée
│
├── prisma/                        # Base de données
│   ├── schema.prisma              # Schéma Prisma
│   ├── migrations/                # Migrations
│   └── seed.ts                    # Données initiales
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Routes authentification
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/          # Routes protégées
│   │   │   ├── dashboard/
│   │   │   ├── dogs/
│   │   │   ├── litters/
│   │   │   ├── breeding/
│   │   │   ├── health/
│   │   │   ├── genetics/
│   │   │   ├── pedigrees/
│   │   │   ├── clients/
│   │   │   ├── sales/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── (marketing)/          # Pages publiques
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── pricing/
│   │   │   └── features/
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   ├── dogs/
│   │   │   ├── litters/
│   │   │   ├── clients/
│   │   │   ├── sales/
│   │   │   ├── genetics/
│   │   │   ├── pedigrees/
│   │   │   ├── stripe/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/               # Composants React
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── forms/                # Formulaires
│   │   ├── tables/               # Tables de données
│   │   ├── charts/               # Graphiques
│   │   ├── pedigree/             # Arbre généalogique
│   │   └── layout/               # Layout components
│   │
│   ├── lib/                      # Utilitaires
│   │   ├── prisma.ts             # Client Prisma
│   │   ├── redis.ts              # Client Redis
│   │   ├── stripe.ts             # Client Stripe
│   │   ├── auth.ts               # Configuration NextAuth
│   │   ├── email.ts              # Service email
│   │   ├── utils.ts              # Fonctions utilitaires
│   │   └── validators.ts         # Schémas Zod
│   │
│   ├── services/                 # Logique métier
│   │   ├── dogs.service.ts
│   │   ├── litters.service.ts
│   │   ├── genetics.service.ts
│   │   ├── coi-calculator.ts     # Calcul COI
│   │   ├── color-predictor.ts    # Prédiction couleurs
│   │   ├── pedigree.service.ts
│   │   ├── billing.service.ts
│   │   └── export.service.ts
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── use-dogs.ts
│   │   ├── use-litters.ts
│   │   ├── use-subscription.ts
│   │   └── use-toast.ts
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── app-store.ts
│   │   └── ui-store.ts
│   │
│   └── types/                    # Types TypeScript
│       ├── index.ts
│       ├── dog.ts
│       ├── litter.ts
│       └── api.ts
│
├── public/                       # Assets statiques
│   ├── images/
│   └── fonts/
│
├── scripts/                      # Scripts utilitaires
│   ├── deploy.sh
│   └── backup.sh
│
├── .env.example                  # Variables d'environnement
├── .env.local                    # Variables locales (gitignored)
├── next.config.js                # Configuration Next.js
├── tailwind.config.ts            # Configuration Tailwind
├── tsconfig.json                 # Configuration TypeScript
├── package.json
└── README.md
```

## Sécurité

### Authentification
- **NextAuth.js v5** avec providers:
  - Credentials (email/password)
  - Google OAuth (optionnel)
  - Magic Link (optionnel)
- Sessions JWT stockées en cookies HttpOnly
- CSRF protection intégrée

### Autorisation
- Middleware Next.js pour routes protégées
- Row Level Security (RLS) via Prisma
- Vérification des limites par plan

### Protection des données
- Chiffrement des mots de passe (bcrypt)
- Validation des entrées (Zod)
- Sanitization des sorties
- Rate limiting par IP et par user

## Plans Tarifaires SaaS

### FREE (0€/mois)
- 10 chiens max
- 3 portées max
- 10 clients max
- Pedigrees 3 générations
- Export PDF uniquement
- Support communautaire

### PRO (9,99€/mois ou 99€/an)
- 100 chiens
- 50 portées
- 200 clients
- Pedigrees 5 générations
- Calcul COI
- Prédiction couleurs
- Export PDF/Excel/CSV
- Support email prioritaire

### ELITE (19,99€/mois ou 199€/an)
- Chiens illimités
- Portées illimitées
- Clients illimités
- Pedigrees 10 générations
- Génétique avancée (import Embark/Wisdom)
- Multi-élevages (jusqu'à 5)
- API access
- Support prioritaire + téléphone

## Performance

### Optimisations Frontend
- Server Components par défaut
- Streaming SSR
- Image optimization (next/image)
- Code splitting automatique
- Prefetching des routes

### Optimisations Backend
- Connection pooling PostgreSQL
- Redis caching (queries fréquentes)
- Pagination côté serveur
- Indexes optimisés

### Métriques cibles
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTFB < 200ms

## Monitoring

### Application
- Logs structurés (Pino)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics ou custom)

### Infrastructure
- PM2 monitoring
- Nginx access/error logs
- PostgreSQL slow query log
- Redis monitoring

## Backup & Recovery

### Stratégie de backup
- **PostgreSQL**: pg_dump quotidien, WAL archiving
- **Uploads**: Sync vers S3-compatible (Backblaze B2)
- **Rétention**: 30 jours rolling

### Plan de recovery
- RTO (Recovery Time Objective): 1 heure
- RPO (Recovery Point Objective): 24 heures
