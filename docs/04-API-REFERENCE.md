# 🔌 API Reference - PedigreeApp SaaS v2

## Vue d'ensemble

L'API REST de PedigreeApp est construite avec Next.js API Routes.
Toutes les routes sont préfixées par `/api`.

## Authentification

### Headers requis

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Obtenir un token

Le token JWT est automatiquement géré par NextAuth.js via les cookies de session.
Pour les appels API externes (plan ELITE), utilisez les API Keys.

---

## Endpoints

### 🔐 Auth

#### POST /api/auth/register
Créer un nouveau compte.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response 201:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/[...nextauth]
Géré par NextAuth.js - Login, Logout, Session.

---

### 🏠 Kennels (Élevages)

#### GET /api/kennels
Liste des élevages de l'utilisateur.

**Response 200:**
```json
{
  "kennels": [
    {
      "id": "uuid",
      "name": "Élevage du Soleil",
      "affix": "Du Soleil",
      "plan": "PRO",
      "dogsCount": 45,
      "littersCount": 12
    }
  ]
}
```

#### POST /api/kennels
Créer un élevage.

**Body:**
```json
{
  "name": "Élevage du Soleil",
  "affix": "Du Soleil",
  "email": "contact@elevage.com",
  "phone": "+33612345678",
  "address": "123 Rue des Chiens",
  "city": "Paris",
  "postalCode": "75001",
  "country": "FR"
}
```

#### GET /api/kennels/:id
Détail d'un élevage.

#### PATCH /api/kennels/:id
Modifier un élevage.

#### DELETE /api/kennels/:id
Supprimer un élevage (soft delete).

---

### 🐕 Dogs (Chiens)

#### GET /api/kennels/:kennelId/dogs
Liste des chiens d'un élevage.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page (défaut: 1) |
| limit | number | Par page (défaut: 20, max: 100) |
| search | string | Recherche nom/puce/LOF |
| breed | string | Filtrer par race |
| sex | MALE/FEMALE | Filtrer par sexe |
| breedingStatus | enum | Filtrer par statut reproduction |
| presenceStatus | enum | Filtrer par statut présence |
| sortBy | string | Champ de tri |
| sortOrder | asc/desc | Ordre de tri |

**Response 200:**
```json
{
  "dogs": [
    {
      "id": "uuid",
      "name": "Rex",
      "registeredName": "Rex du Soleil",
      "breed": "Berger Allemand",
      "sex": "MALE",
      "birthDate": "2022-05-15",
      "color": "Noir et feu",
      "microchip": "250269812345678",
      "breedingStatus": "BREEDING",
      "healthStatus": "HEALTHY",
      "primaryPhoto": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### POST /api/kennels/:kennelId/dogs
Créer un chien.

**Body:**
```json
{
  "name": "Rex",
  "registeredName": "Rex du Soleil",
  "breed": "Berger Allemand",
  "sex": "MALE",
  "birthDate": "2022-05-15",
  "color": "Noir et feu",
  "microchip": "250269812345678",
  "sireId": "uuid-pere",
  "damId": "uuid-mere",
  "breedingStatus": "BREEDING",
  "isOwned": true,
  "notes": "Champion de beauté 2023"
}
```

**Response 201:**
```json
{
  "success": true,
  "dog": { ... }
}
```

#### GET /api/kennels/:kennelId/dogs/:id
Détail complet d'un chien.

**Response 200:**
```json
{
  "dog": {
    "id": "uuid",
    "name": "Rex",
    "registeredName": "Rex du Soleil",
    "breed": "Berger Allemand",
    "sex": "MALE",
    "birthDate": "2022-05-15",
    "color": "Noir et feu",
    "microchip": "250269812345678",
    "sire": { "id": "uuid", "name": "Max" },
    "dam": { "id": "uuid", "name": "Bella" },
    "photos": [...],
    "healthRecords": [...],
    "geneticTests": [...],
    "littersAsSire": [...],
    "sales": [...]
  }
}
```

#### PATCH /api/kennels/:kennelId/dogs/:id
Modifier un chien.

#### DELETE /api/kennels/:kennelId/dogs/:id
Supprimer un chien.

---

### 📸 Dog Photos

#### POST /api/kennels/:kennelId/dogs/:dogId/photos
Upload une photo.

**Body (multipart/form-data):**
- `file`: Image (jpg, png, webp, max 5MB)
- `isPrimary`: boolean
- `caption`: string

#### DELETE /api/kennels/:kennelId/dogs/:dogId/photos/:photoId
Supprimer une photo.

#### PATCH /api/kennels/:kennelId/dogs/:dogId/photos/:photoId/primary
Définir comme photo principale.

---

### 📜 Pedigrees

#### GET /api/kennels/:kennelId/dogs/:dogId/pedigree
Récupérer le pedigree d'un chien.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| generations | number | Nombre de générations (3-10 selon plan) |

**Response 200:**
```json
{
  "dog": {
    "id": "uuid",
    "name": "Rex",
    "sex": "MALE",
    "color": "Noir et feu",
    "titles": "CH",
    "sire": {
      "id": "uuid",
      "name": "Max",
      "sire": { ... },
      "dam": { ... }
    },
    "dam": {
      "id": "uuid",
      "name": "Bella",
      "sire": { ... },
      "dam": { ... }
    }
  },
  "coi": {
    "percentage": 3.125,
    "interpretation": "Faible"
  }
}
```

#### POST /api/kennels/:kennelId/dogs/:dogId/pedigree/export
Générer un PDF du pedigree.

**Body:**
```json
{
  "generations": 5,
  "includePhotos": true,
  "includeHealth": true,
  "includeCoi": true,
  "includeTitles": true,
  "paperSize": "A4",
  "orientation": "landscape"
}
```

**Response 200:**
```json
{
  "downloadUrl": "https://...",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

---

### 🍼 Litters (Portées)

#### GET /api/kennels/:kennelId/litters
Liste des portées.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| status | enum | Filtrer par statut |
| year | number | Filtrer par année |

#### POST /api/kennels/:kennelId/litters
Créer une portée.

**Body:**
```json
{
  "sireId": "uuid",
  "damId": "uuid",
  "birthDate": "2024-01-15",
  "totalPuppies": 8,
  "males": 5,
  "females": 3,
  "stillborn": 0,
  "status": "BORN"
}
```

#### GET /api/kennels/:kennelId/litters/:id
Détail d'une portée avec chiots.

#### PATCH /api/kennels/:kennelId/litters/:id
Modifier une portée.

#### DELETE /api/kennels/:kennelId/litters/:id
Supprimer une portée.

---

### 💕 Breeding (Reproduction)

#### GET /api/kennels/:kennelId/heats
Liste des chaleurs.

#### POST /api/kennels/:kennelId/heats
Enregistrer des chaleurs.

**Body:**
```json
{
  "dogId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-21",
  "notes": "Cycle normal"
}
```

#### GET /api/kennels/:kennelId/matings
Liste des accouplements.

#### POST /api/kennels/:kennelId/matings
Enregistrer un accouplement.

**Body:**
```json
{
  "sireId": "uuid",
  "damId": "uuid",
  "matingDate": "2024-01-10",
  "matingType": "NATURAL",
  "notes": "Saillie réussie"
}
```

---

### 🧬 Genetics

#### GET /api/kennels/:kennelId/dogs/:dogId/genetic-tests
Tests génétiques d'un chien.

#### POST /api/kennels/:kennelId/dogs/:dogId/genetic-tests
Ajouter un test génétique.

**Body:**
```json
{
  "testName": "DM (Myélopathie Dégénérative)",
  "testDate": "2024-01-15",
  "result": "CLEAR",
  "laboratory": "Antagene",
  "certificateNumber": "ANT-2024-12345"
}
```

#### POST /api/kennels/:kennelId/genetics/coi
Calculer le COI d'un accouplement potentiel.

**Body:**
```json
{
  "sireId": "uuid",
  "damId": "uuid",
  "generations": 5
}
```

**Response 200:**
```json
{
  "coi": 3.125,
  "percentage": "3.13%",
  "interpretation": "Faible - Accouplement recommandé",
  "commonAncestors": [
    {
      "id": "uuid",
      "name": "Champion Max",
      "contribution": 1.5625,
      "paths": [
        ["Rex", "Max Sr", "Champion Max"],
        ["Bella", "Luna", "Champion Max"]
      ]
    }
  ]
}
```

#### POST /api/kennels/:kennelId/genetics/color-prediction
Prédire les couleurs d'une portée (PRO+).

**Body:**
```json
{
  "sireId": "uuid",
  "damId": "uuid",
  "sireGenotype": {
    "E": ["E", "e"],
    "B": ["B", "b"],
    "K": ["ky", "ky"],
    "A": ["at", "at"],
    "D": ["D", "D"]
  },
  "damGenotype": {
    "E": ["E", "E"],
    "B": ["B", "B"],
    "K": ["ky", "ky"],
    "A": ["at", "a"],
    "D": ["D", "d"]
  }
}
```

**Response 200:**
```json
{
  "predictions": [
    {
      "phenotype": "Noir et feu",
      "probability": 0.5,
      "hex": "#1a1a1a",
      "genotype": "E/- B/- ky/ky at/at D/-"
    },
    {
      "phenotype": "Chocolat et feu",
      "probability": 0.25,
      "hex": "#5c3317",
      "genotype": "E/- b/b ky/ky at/at D/-"
    }
  ],
  "warnings": []
}
```

---

### 🏥 Health

#### GET /api/kennels/:kennelId/dogs/:dogId/health-records
Historique santé d'un chien.

#### POST /api/kennels/:kennelId/dogs/:dogId/health-records
Ajouter un enregistrement santé.

**Body:**
```json
{
  "recordType": "VACCINE",
  "recordDate": "2024-01-15",
  "title": "Vaccin CHPL",
  "description": "Rappel annuel",
  "veterinarian": "Dr. Martin",
  "cost": 65.00,
  "nextDueDate": "2025-01-15"
}
```

#### GET /api/kennels/:kennelId/health/upcoming
Vaccins et rappels à venir.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| days | number | Horizon en jours (défaut: 30) |

---

### 👥 Clients

#### GET /api/kennels/:kennelId/clients
Liste des clients.

#### POST /api/kennels/:kennelId/clients
Créer un client.

#### GET /api/kennels/:kennelId/clients/:id
Détail client avec historique.

#### PATCH /api/kennels/:kennelId/clients/:id
Modifier un client.

#### DELETE /api/kennels/:kennelId/clients/:id
Supprimer un client.

---

### 📋 Waiting List

#### GET /api/kennels/:kennelId/waiting-list
Liste d'attente.

#### POST /api/kennels/:kennelId/waiting-list
Ajouter à la liste d'attente.

**Body:**
```json
{
  "clientId": "uuid",
  "preferredSex": "FEMALE",
  "preferredColor": "Noir",
  "depositPaid": true,
  "depositAmount": 500
}
```

#### PATCH /api/kennels/:kennelId/waiting-list/:id
Modifier une entrée (position, statut).

#### DELETE /api/kennels/:kennelId/waiting-list/:id
Retirer de la liste.

---

### 💰 Sales & Finances

#### GET /api/kennels/:kennelId/sales
Liste des ventes.

#### POST /api/kennels/:kennelId/sales
Enregistrer une vente.

**Body:**
```json
{
  "dogId": "uuid",
  "clientId": "uuid",
  "saleDate": "2024-01-20",
  "price": 1500,
  "paymentMethod": "TRANSFER",
  "contractSigned": true
}
```

#### GET /api/kennels/:kennelId/expenses
Liste des dépenses.

#### POST /api/kennels/:kennelId/expenses
Enregistrer une dépense.

**Body:**
```json
{
  "category": "VETERINARY",
  "amount": 150,
  "expenseDate": "2024-01-15",
  "description": "Consultation + vaccin",
  "dogId": "uuid"
}
```

#### GET /api/kennels/:kennelId/finances/stats
Statistiques financières.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| period | month/year | Période |
| year | number | Année |
| month | number | Mois (si period=month) |

**Response 200:**
```json
{
  "revenue": 15000,
  "expenses": 3500,
  "profit": 11500,
  "salesCount": 10,
  "expensesByCategory": {
    "VETERINARY": 1500,
    "FOOD": 1200,
    "EQUIPMENT": 800
  },
  "monthlyTrend": [
    { "month": "2024-01", "revenue": 3000, "expenses": 800 },
    { "month": "2024-02", "revenue": 4500, "expenses": 900 }
  ]
}
```

---

### 📊 Dashboard & Analytics

#### GET /api/kennels/:kennelId/dashboard
Données du tableau de bord.

**Response 200:**
```json
{
  "counts": {
    "dogs": 45,
    "litters": 12,
    "clients": 89
  },
  "limits": {
    "dogs": 100,
    "litters": 50,
    "clients": 200
  },
  "financial": {
    "monthlyRevenue": 4500,
    "monthlyExpenses": 1200,
    "monthlyProfit": 3300
  },
  "upcoming": {
    "vaccines": [...],
    "expectedLitters": [...]
  },
  "recent": {
    "dogs": [...],
    "sales": [...]
  }
}
```

---

### 💳 Billing (Stripe)

#### GET /api/billing/plans
Liste des plans disponibles.

#### POST /api/billing/checkout
Créer une session de paiement Stripe.

**Body:**
```json
{
  "kennelId": "uuid",
  "priceId": "price_xxx",
  "successUrl": "https://app.../success",
  "cancelUrl": "https://app.../cancel"
}
```

**Response 200:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

#### POST /api/billing/portal
Accéder au portail client Stripe.

**Body:**
```json
{
  "kennelId": "uuid",
  "returnUrl": "https://app.../settings"
}
```

#### POST /api/webhooks/stripe
Webhook Stripe (signature vérifiée).

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Accès refusé (plan insuffisant) |
| 404 | Not Found - Ressource inexistante |
| 409 | Conflict - Conflit (ex: email déjà utilisé) |
| 422 | Unprocessable Entity - Validation échouée |
| 429 | Too Many Requests - Rate limit atteint |
| 500 | Internal Server Error |

**Format d'erreur:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est invalide",
    "details": [
      { "field": "email", "message": "Format email invalide" }
    ]
  }
}
```

---

## Rate Limiting

| Endpoint | Limite |
|----------|--------|
| Auth (login) | 5 req/15min par IP |
| API générale | 100 req/min par user |
| Export PDF | 10 req/min par user |
| Upload | 20 req/min par user |

Headers de réponse:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```
