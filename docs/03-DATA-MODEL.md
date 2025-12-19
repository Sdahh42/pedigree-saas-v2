# 📊 Modèle de Données - PedigreeApp SaaS v2

## Vue d'ensemble

Ce document décrit le schéma de base de données PostgreSQL utilisé par l'application.
Le modèle est géré via Prisma ORM.

---

## Diagramme Entité-Relation (simplifié)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│   Kennel    │───────│ Subscription│
└─────────────┘       └─────────────┘       └─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│     Dog     │◄──────│   Litter    │       │   Client    │
└─────────────┘       └─────────────┘       └─────────────┘
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│HealthRecord │       │   Mating    │       │    Sale     │
│ GeneticTest │       │    Heat     │       │ WaitingList │
│  DogPhoto   │       └─────────────┘       └─────────────┘
└─────────────┘
```

---

## Entités Détaillées

### User (Utilisateur)

Représente un compte utilisateur de l'application.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| email | String | UNIQUE, NOT NULL | Email de connexion |
| emailVerified | DateTime | NULL | Date de vérification email |
| passwordHash | String | NULL | Hash bcrypt du mot de passe |
| name | String | NULL | Nom complet |
| image | String | NULL | URL photo de profil |
| phone | String | NULL | Téléphone |
| role | Enum | DEFAULT 'USER' | USER, ADMIN |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Relations:**
- `accounts` → Account[] (OAuth providers)
- `sessions` → Session[]
- `kennels` → Kennel[] (élevages possédés)
- `kennelMemberships` → KennelMember[] (accès partagés)

---

### Kennel (Élevage)

Représente un élevage avec ses informations.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| name | String | NOT NULL | Nom de l'élevage |
| affix | String | NULL | Affixe officiel |
| email | String | NULL | Email de contact |
| phone | String | NULL | Téléphone |
| address | String | NULL | Adresse |
| city | String | NULL | Ville |
| postalCode | String | NULL | Code postal |
| country | String | DEFAULT 'FR' | Pays |
| website | String | NULL | Site web |
| siret | String | NULL | Numéro SIRET |
| logo | String | NULL | URL du logo |
| ownerId | UUID | FK → User | Propriétaire |
| subscriptionId | UUID | FK → Subscription | Abonnement actif |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Relations:**
- `owner` → User
- `subscription` → Subscription
- `members` → KennelMember[]
- `dogs` → Dog[]
- `litters` → Litter[]
- `clients` → Client[]
- `expenses` → Expense[]

---

### Subscription (Abonnement)

Gère les abonnements Stripe.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage associé |
| stripeCustomerId | String | NULL | ID client Stripe |
| stripeSubscriptionId | String | NULL | ID abonnement Stripe |
| stripePriceId | String | NULL | ID prix Stripe |
| plan | Enum | DEFAULT 'FREE' | FREE, PRO, ELITE |
| status | Enum | DEFAULT 'ACTIVE' | ACTIVE, PAST_DUE, CANCELED, TRIALING |
| currentPeriodStart | DateTime | NULL | Début période |
| currentPeriodEnd | DateTime | NULL | Fin période |
| cancelAtPeriodEnd | Boolean | DEFAULT false | Annulation prévue |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Limites par plan:**
```typescript
const PLAN_LIMITS = {
  FREE: { dogs: 10, litters: 3, clients: 10, pedigreeGenerations: 3 },
  PRO: { dogs: 100, litters: 50, clients: 200, pedigreeGenerations: 5 },
  ELITE: { dogs: -1, litters: -1, clients: -1, pedigreeGenerations: 10 } // -1 = illimité
}
```

---

### Dog (Chien)

Entité principale représentant un chien.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| name | String | NOT NULL | Nom usuel |
| registeredName | String | NULL | Nom LOF/pedigree |
| breed | String | NOT NULL | Race |
| sex | Enum | NOT NULL | MALE, FEMALE |
| birthDate | DateTime | NULL | Date de naissance |
| deathDate | DateTime | NULL | Date de décès |
| color | String | NULL | Couleur de robe |
| microchip | String | NULL | Numéro de puce |
| tattoo | String | NULL | Numéro de tatouage |
| registrationNumber | String | NULL | Numéro LOF |
| sireId | UUID | FK → Dog | Père |
| damId | UUID | FK → Dog | Mère |
| breedingStatus | Enum | DEFAULT 'NOT_BREEDING' | NOT_BREEDING, BREEDING, RETIRED |
| healthStatus | Enum | DEFAULT 'HEALTHY' | HEALTHY, SICK, DECEASED, UNKNOWN |
| presenceStatus | Enum | DEFAULT 'ACTIVE' | ACTIVE, RETIRED, DECEASED, SOLD, EXTERNAL |
| origin | Enum | DEFAULT 'INTERNAL' | INTERNAL, EXTERNAL |
| isOwned | Boolean | DEFAULT true | Propriété de l'élevage |
| weight | Float | NULL | Poids en kg |
| height | Float | NULL | Taille en cm |
| coatType | String | NULL | Type de poil |
| titles | String | NULL | Titres obtenus |
| cotation | String | NULL | Cotation LOF |
| temperament | String | NULL | Tempérament |
| studFee | Float | NULL | Prix de saillie |
| notes | Text | NULL | Notes libres |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Relations:**
- `kennel` → Kennel
- `sire` → Dog (père)
- `dam` → Dog (mère)
- `offspring` → Dog[] (descendants)
- `photos` → DogPhoto[]
- `healthRecords` → HealthRecord[]
- `geneticTests` → GeneticTest[]
- `littersAsSire` → Litter[]
- `littersAsDam` → Litter[]
- `sales` → Sale[]

**Index:**
- `kennelId`
- `breed`
- `sex`
- `microchip` (UNIQUE par kennel)
- `registrationNumber` (UNIQUE par kennel)

---

### DogPhoto (Photo de chien)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| dogId | UUID | FK → Dog | Chien |
| url | String | NOT NULL | URL de l'image |
| isPrimary | Boolean | DEFAULT false | Photo principale |
| caption | String | NULL | Légende |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### Litter (Portée)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| sireId | UUID | FK → Dog | Père |
| damId | UUID | FK → Dog | Mère |
| matingId | UUID | FK → Mating | Accouplement lié |
| birthDate | DateTime | NOT NULL | Date de naissance |
| expectedDate | DateTime | NULL | Date prévue |
| totalPuppies | Int | DEFAULT 0 | Nombre total |
| males | Int | DEFAULT 0 | Mâles |
| females | Int | DEFAULT 0 | Femelles |
| stillborn | Int | DEFAULT 0 | Mort-nés |
| status | Enum | DEFAULT 'EXPECTED' | EXPECTED, BORN, WEANING, READY, COMPLETED |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Relations:**
- `kennel` → Kennel
- `sire` → Dog
- `dam` → Dog
- `mating` → Mating
- `puppies` → Dog[]

---

### Heat (Chaleurs)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| dogId | UUID | FK → Dog | Femelle |
| startDate | DateTime | NOT NULL | Date de début |
| endDate | DateTime | NULL | Date de fin |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### Mating (Accouplement)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| sireId | UUID | FK → Dog | Mâle |
| damId | UUID | FK → Dog | Femelle |
| matingDate | DateTime | NOT NULL | Date d'accouplement |
| matingType | Enum | DEFAULT 'NATURAL' | NATURAL, AI_FRESH, AI_CHILLED, AI_FROZEN |
| success | Boolean | NULL | Résultat |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### HealthRecord (Dossier santé)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| dogId | UUID | FK → Dog | Chien |
| recordType | Enum | NOT NULL | VACCINE, VET_VISIT, TEST, SURGERY, MEDICATION, INJURY, OTHER |
| recordDate | DateTime | NOT NULL | Date |
| title | String | NOT NULL | Titre |
| description | Text | NULL | Description |
| veterinarian | String | NULL | Vétérinaire |
| cost | Float | NULL | Coût |
| nextDueDate | DateTime | NULL | Prochain rappel |
| attachmentUrl | String | NULL | Pièce jointe |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### GeneticTest (Test génétique)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| dogId | UUID | FK → Dog | Chien |
| testName | String | NOT NULL | Nom du test |
| testDate | DateTime | NOT NULL | Date du test |
| result | Enum | NOT NULL | CLEAR, CARRIER, AFFECTED, PENDING, UNKNOWN |
| laboratory | String | NULL | Laboratoire |
| certificateNumber | String | NULL | N° certificat |
| attachmentUrl | String | NULL | Certificat |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### Client

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| firstName | String | NOT NULL | Prénom |
| lastName | String | NOT NULL | Nom |
| email | String | NULL | Email |
| phone | String | NULL | Téléphone |
| address | String | NULL | Adresse |
| city | String | NULL | Ville |
| postalCode | String | NULL | Code postal |
| country | String | DEFAULT 'FR' | Pays |
| clientType | Enum | DEFAULT 'BUYER' | BUYER, BREEDER, BOTH |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

**Relations:**
- `kennel` → Kennel
- `sales` → Sale[]
- `waitingListEntries` → WaitingListEntry[]

---

### Sale (Vente)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| dogId | UUID | FK → Dog | Chien vendu |
| clientId | UUID | FK → Client | Acheteur |
| saleDate | DateTime | NOT NULL | Date de vente |
| price | Float | NOT NULL | Prix |
| currency | String | DEFAULT 'EUR' | Devise |
| paymentMethod | Enum | DEFAULT 'TRANSFER' | CASH, CHECK, TRANSFER, OTHER |
| contractSigned | Boolean | DEFAULT false | Contrat signé |
| contractUrl | String | NULL | URL contrat |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

### WaitingListEntry (Liste d'attente)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| clientId | UUID | FK → Client | Client |
| litterId | UUID | FK → Litter | Portée ciblée |
| preferredSex | Enum | NULL | MALE, FEMALE, NO_PREFERENCE |
| preferredColor | String | NULL | Couleur souhaitée |
| position | Int | NOT NULL | Position dans la file |
| depositPaid | Boolean | DEFAULT false | Acompte versé |
| depositAmount | Float | NULL | Montant acompte |
| status | Enum | DEFAULT 'WAITING' | WAITING, MATCHED, COMPLETED, CANCELLED |
| notes | Text | NULL | Notes |
| createdAt | DateTime | DEFAULT now() | Date de création |
| updatedAt | DateTime | AUTO | Date de mise à jour |

---

### Expense (Dépense)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| kennelId | UUID | FK → Kennel | Élevage |
| category | Enum | NOT NULL | FOOD, VETERINARY, BREEDING, EQUIPMENT, INSURANCE, SHOWS, TRAVEL, OTHER |
| amount | Float | NOT NULL | Montant |
| currency | String | DEFAULT 'EUR' | Devise |
| expenseDate | DateTime | NOT NULL | Date |
| dogId | UUID | FK → Dog | Chien concerné |
| litterId | UUID | FK → Litter | Portée concernée |
| description | String | NULL | Description |
| vendor | String | NULL | Fournisseur |
| receiptUrl | String | NULL | Facture |
| createdAt | DateTime | DEFAULT now() | Date de création |

---

## Enums

```prisma
enum UserRole {
  USER
  ADMIN
}

enum Plan {
  FREE
  PRO
  ELITE
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  TRIALING
}

enum Sex {
  MALE
  FEMALE
}

enum BreedingStatus {
  NOT_BREEDING
  BREEDING
  RETIRED
}

enum HealthStatus {
  HEALTHY
  SICK
  DECEASED
  UNKNOWN
}

enum PresenceStatus {
  ACTIVE
  RETIRED
  DECEASED
  SOLD
  EXTERNAL
}

enum DogOrigin {
  INTERNAL
  EXTERNAL
}

enum LitterStatus {
  EXPECTED
  BORN
  WEANING
  READY
  COMPLETED
}

enum MatingType {
  NATURAL
  AI_FRESH
  AI_CHILLED
  AI_FROZEN
}

enum HealthRecordType {
  VACCINE
  VET_VISIT
  TEST
  SURGERY
  MEDICATION
  INJURY
  OTHER
}

enum GeneticTestResult {
  CLEAR
  CARRIER
  AFFECTED
  PENDING
  UNKNOWN
}

enum ClientType {
  BUYER
  BREEDER
  BOTH
}

enum PaymentMethod {
  CASH
  CHECK
  TRANSFER
  OTHER
}

enum WaitingListStatus {
  WAITING
  MATCHED
  COMPLETED
  CANCELLED
}

enum ExpenseCategory {
  FOOD
  VETERINARY
  BREEDING
  EQUIPMENT
  INSURANCE
  SHOWS
  TRAVEL
  OTHER
}

enum PreferredSex {
  MALE
  FEMALE
  NO_PREFERENCE
}
```

---

## Index et Performances

### Index recommandés

```sql
-- Dogs
CREATE INDEX idx_dogs_kennel ON dogs(kennel_id);
CREATE INDEX idx_dogs_breed ON dogs(breed);
CREATE INDEX idx_dogs_sex ON dogs(sex);
CREATE INDEX idx_dogs_sire ON dogs(sire_id);
CREATE INDEX idx_dogs_dam ON dogs(dam_id);
CREATE UNIQUE INDEX idx_dogs_microchip ON dogs(kennel_id, microchip) WHERE microchip IS NOT NULL;

-- Litters
CREATE INDEX idx_litters_kennel ON litters(kennel_id);
CREATE INDEX idx_litters_birth_date ON litters(birth_date);
CREATE INDEX idx_litters_status ON litters(status);

-- Health Records
CREATE INDEX idx_health_dog ON health_records(dog_id);
CREATE INDEX idx_health_next_due ON health_records(next_due_date) WHERE next_due_date IS NOT NULL;

-- Sales
CREATE INDEX idx_sales_kennel ON sales(kennel_id);
CREATE INDEX idx_sales_date ON sales(sale_date);

-- Expenses
CREATE INDEX idx_expenses_kennel ON expenses(kennel_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
```

### Requêtes fréquentes optimisées

1. **Liste des chiens d'un élevage** - Index sur `kennel_id`
2. **Pedigree (ancêtres)** - Index sur `sire_id`, `dam_id`
3. **Vaccins à venir** - Index sur `next_due_date`
4. **Statistiques financières** - Index sur `sale_date`, `expense_date`
