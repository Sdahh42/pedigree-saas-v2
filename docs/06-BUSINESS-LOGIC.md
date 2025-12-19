# 🧠 Logique Métier - PedigreeApp SaaS v2

## Vue d'ensemble

Ce document détaille les règles métier, algorithmes et processus clés de l'application.

---

## 1. Gestion des Abonnements

### 1.1 Plans et Limites

```typescript
// Définition des plans
const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: { monthly: 0, yearly: 0 },
    limits: {
      dogs: 10,
      litters: 3,
      clients: 10,
      kennels: 1,
      pedigreeGenerations: 3,
      storage: 100 * 1024 * 1024, // 100 MB
    },
    features: {
      coiCalculator: false,
      colorPrediction: false,
      geneticImport: false,
      excelExport: false,
      apiAccess: false,
      prioritySupport: false,
    }
  },
  PRO: {
    name: 'Pro',
    price: { monthly: 999, yearly: 9900 }, // centimes
    limits: {
      dogs: 100,
      litters: 50,
      clients: 200,
      kennels: 1,
      pedigreeGenerations: 5,
      storage: 1024 * 1024 * 1024, // 1 GB
    },
    features: {
      coiCalculator: true,
      colorPrediction: true,
      geneticImport: false,
      excelExport: true,
      apiAccess: false,
      prioritySupport: true,
    }
  },
  ELITE: {
    name: 'Elite',
    price: { monthly: 1999, yearly: 19900 },
    limits: {
      dogs: -1, // illimité
      litters: -1,
      clients: -1,
      kennels: 5,
      pedigreeGenerations: 10,
      storage: 10 * 1024 * 1024 * 1024, // 10 GB
    },
    features: {
      coiCalculator: true,
      colorPrediction: true,
      geneticImport: true,
      excelExport: true,
      apiAccess: true,
      prioritySupport: true,
    }
  }
};
```

### 1.2 Vérification des limites

```typescript
/**
 * Vérifie si l'utilisateur peut créer une nouvelle ressource
 * @param kennelId - ID de l'élevage
 * @param resourceType - Type de ressource (dogs, litters, clients)
 * @returns { allowed: boolean, current: number, limit: number, message?: string }
 */
async function checkLimit(kennelId: string, resourceType: 'dogs' | 'litters' | 'clients') {
  const kennel = await prisma.kennel.findUnique({
    where: { id: kennelId },
    include: { 
      subscription: true,
      _count: { select: { dogs: true, litters: true, clients: true } }
    }
  });

  const plan = PLANS[kennel.subscription.plan];
  const limit = plan.limits[resourceType];
  const current = kennel._count[resourceType];

  // -1 = illimité
  if (limit === -1) {
    return { allowed: true, current, limit: Infinity };
  }

  if (current >= limit) {
    return {
      allowed: false,
      current,
      limit,
      message: `Limite atteinte: ${current}/${limit} ${resourceType}. Passez au plan supérieur.`
    };
  }

  return { allowed: true, current, limit };
}
```

### 1.3 Cycle de vie d'un abonnement

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    FREE     │────▶│     PRO     │────▶│    ELITE    │
└─────────────┘     └─────────────┘     └─────────────┘
      ▲                   │                   │
      │                   │                   │
      └───────────────────┴───────────────────┘
                    Downgrade
```

**Règles de downgrade:**
- Si le nombre de ressources dépasse les limites du nouveau plan:
  - L'utilisateur doit supprimer/archiver les ressources excédentaires
  - OU le système archive automatiquement les plus anciennes
- Les données ne sont jamais supprimées, seulement archivées

---

## 2. Calcul du COI (Coefficient de Consanguinité)

### 2.1 Algorithme de Wright

Le COI est calculé selon la formule de Wright:

```
COI = Σ (0.5)^(n1+n2+1) × (1 + Fa)
```

Où:
- `n1` = nombre de générations entre le sujet et l'ancêtre commun via le père
- `n2` = nombre de générations entre le sujet et l'ancêtre commun via la mère
- `Fa` = coefficient de consanguinité de l'ancêtre commun

### 2.2 Implémentation

```typescript
/**
 * Calcule le COI pour un accouplement potentiel
 * @param sireId - ID du père
 * @param damId - ID de la mère
 * @param generations - Nombre de générations à analyser
 */
async function calculateCOI(sireId: string, damId: string, generations: number): Promise<COIResult> {
  // 1. Récupérer les ancêtres du père
  const sireAncestors = await getAncestors(sireId, generations);
  
  // 2. Récupérer les ancêtres de la mère
  const damAncestors = await getAncestors(damId, generations);
  
  // 3. Trouver les ancêtres communs
  const commonAncestors = findCommonAncestors(sireAncestors, damAncestors);
  
  // 4. Calculer la contribution de chaque ancêtre commun
  let totalCOI = 0;
  const contributions = [];
  
  for (const ancestor of commonAncestors) {
    const sirePaths = sireAncestors.get(ancestor.id);
    const damPaths = damAncestors.get(ancestor.id);
    
    for (const sirePath of sirePaths) {
      for (const damPath of damPaths) {
        const n1 = sirePath.length;
        const n2 = damPath.length;
        const Fa = ancestor.coi || 0;
        
        const contribution = Math.pow(0.5, n1 + n2 + 1) * (1 + Fa);
        totalCOI += contribution;
        
        contributions.push({
          ancestorId: ancestor.id,
          ancestorName: ancestor.name,
          contribution,
          sirePath,
          damPath
        });
      }
    }
  }
  
  return {
    coi: totalCOI,
    percentage: (totalCOI * 100).toFixed(2) + '%',
    interpretation: interpretCOI(totalCOI),
    commonAncestors: contributions
  };
}

/**
 * Interprétation du COI
 */
function interpretCOI(coi: number): string {
  if (coi < 0.0625) return 'Très faible - Excellent';
  if (coi < 0.125) return 'Faible - Bon';
  if (coi < 0.25) return 'Modéré - Acceptable';
  if (coi < 0.375) return 'Élevé - À surveiller';
  return 'Très élevé - Déconseillé';
}
```

### 2.3 Cache des résultats

Les calculs COI sont mis en cache (Redis) pendant 5 minutes car:
- Le calcul est coûteux (récursif sur plusieurs générations)
- Les données changent rarement
- Même accouplement souvent consulté plusieurs fois

---

## 3. Prédiction des Couleurs

### 3.1 Loci génétiques supportés

| Locus | Nom | Allèles | Effet |
|-------|-----|---------|-------|
| E | Extension | E, Em, Eg, e | Production d'eumélanine |
| B | Brown | B, b | Noir vs Chocolat |
| K | Dominant Black | KB, kbr, ky | Patron de couleur |
| A | Agouti | Ay, aw, at, a | Distribution du pigment |
| D | Dilution | D, d | Dilution de la couleur |
| S | Spotting | S, sp, sw | Panachure blanche |
| M | Merle | M, m | Patron merle |

### 3.2 Algorithme de prédiction

```typescript
/**
 * Prédit les couleurs possibles d'une portée
 */
function predictColors(sireGenotype: Genotype, damGenotype: Genotype): ColorPrediction[] {
  const predictions: Map<string, ColorPrediction> = new Map();
  
  // Générer toutes les combinaisons possibles (carré de Punnett)
  const combinations = generatePunnettSquare(sireGenotype, damGenotype);
  
  for (const combo of combinations) {
    const phenotype = determinePhenotype(combo.genotype);
    const key = phenotype.name;
    
    if (predictions.has(key)) {
      predictions.get(key)!.probability += combo.probability;
    } else {
      predictions.set(key, {
        phenotype: phenotype.name,
        genotype: formatGenotype(combo.genotype),
        probability: combo.probability,
        hex: phenotype.hex,
        description: phenotype.description,
        warnings: phenotype.warnings
      });
    }
  }
  
  return Array.from(predictions.values())
    .sort((a, b) => b.probability - a.probability);
}

/**
 * Détermine le phénotype à partir du génotype
 */
function determinePhenotype(genotype: Genotype): Phenotype {
  const warnings: string[] = [];
  
  // Vérifier le double merle (danger santé)
  if (genotype.M && genotype.M[0] === 'M' && genotype.M[1] === 'M') {
    warnings.push('⚠️ Double Merle: Risques de surdité et cécité');
  }
  
  // Logique de détermination de la couleur
  // 1. Vérifier E locus (extension)
  if (genotype.E[0] === 'e' && genotype.E[1] === 'e') {
    // ee = jaune/rouge, ignore les autres loci
    return {
      name: genotype.B.includes('b') && !genotype.B.includes('B') 
        ? 'Crème' : 'Jaune/Rouge',
      hex: '#f5d742',
      description: 'Robe unie jaune à rouge',
      warnings
    };
  }
  
  // 2. Vérifier K locus
  if (genotype.K.includes('KB')) {
    // Noir dominant
    const baseColor = getBaseColor(genotype);
    return {
      name: baseColor.name,
      hex: baseColor.hex,
      description: `Robe unie ${baseColor.name.toLowerCase()}`,
      warnings
    };
  }
  
  // 3. Vérifier A locus (si ky/ky)
  // ... logique complète pour chaque combinaison
  
  return determinedPhenotype;
}
```

### 3.3 Alertes santé

Le système génère des alertes pour les combinaisons à risque:

| Combinaison | Risque | Alerte |
|-------------|--------|--------|
| M/M (Double Merle) | Surdité, cécité | ⚠️ Critique |
| d/d + certaines couleurs | Alopécie | ⚠️ Modéré |
| Certains croisements | Maladies génétiques | ℹ️ Info |

---

## 4. Génération de Pedigree

### 4.1 Structure de données

```typescript
interface PedigreeNode {
  id: string;
  name: string;
  registeredName?: string;
  sex: 'MALE' | 'FEMALE';
  birthDate?: Date;
  color?: string;
  titles?: string;
  photoUrl?: string;
  coi?: number;
  sire?: PedigreeNode;
  dam?: PedigreeNode;
}
```

### 4.2 Algorithme de construction

```typescript
/**
 * Construit l'arbre de pedigree récursivement
 */
async function buildPedigree(dogId: string, depth: number, maxDepth: number): Promise<PedigreeNode | null> {
  if (depth > maxDepth) return null;
  
  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    select: {
      id: true,
      name: true,
      registeredName: true,
      sex: true,
      birthDate: true,
      color: true,
      titles: true,
      sireId: true,
      damId: true,
      photos: { where: { isPrimary: true }, take: 1 }
    }
  });
  
  if (!dog) return null;
  
  const [sire, dam] = await Promise.all([
    dog.sireId ? buildPedigree(dog.sireId, depth + 1, maxDepth) : null,
    dog.damId ? buildPedigree(dog.damId, depth + 1, maxDepth) : null
  ]);
  
  return {
    id: dog.id,
    name: dog.name,
    registeredName: dog.registeredName,
    sex: dog.sex,
    birthDate: dog.birthDate,
    color: dog.color,
    titles: dog.titles,
    photoUrl: dog.photos[0]?.url,
    sire,
    dam
  };
}
```

### 4.3 Export PDF

Le PDF est généré côté serveur avec les options:

```typescript
interface PedigreeExportOptions {
  generations: number;       // 3, 5 ou 10
  includePhotos: boolean;    // Photos des chiens
  includeHealth: boolean;    // Statut santé
  includeCoi: boolean;       // Coefficient de consanguinité
  includeTitles: boolean;    // Titres et récompenses
  includeColors: boolean;    // Couleurs de robe
  paperSize: 'A4' | 'A3';
  orientation: 'portrait' | 'landscape';
  kennelLogo: boolean;       // Logo de l'élevage en en-tête
}
```

---

## 5. Gestion des Ventes

### 5.1 Workflow de vente

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Chiot né   │────▶│  Disponible │────▶│   Réservé   │────▶│    Vendu    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                   │
                          │                   │
                          ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Gardé     │     │   Annulé    │
                    └─────────────┘     └─────────────┘
```

### 5.2 Actions automatiques lors d'une vente

```typescript
async function processSale(saleData: SaleInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Créer la vente
    const sale = await tx.sale.create({
      data: {
        dogId: saleData.dogId,
        clientId: saleData.clientId,
        kennelId: saleData.kennelId,
        saleDate: saleData.saleDate,
        price: saleData.price,
        paymentMethod: saleData.paymentMethod,
        contractSigned: saleData.contractSigned
      }
    });
    
    // 2. Mettre à jour le statut du chien
    await tx.dog.update({
      where: { id: saleData.dogId },
      data: {
        presenceStatus: 'SOLD',
        isOwned: false
      }
    });
    
    // 3. Mettre à jour la liste d'attente si applicable
    if (saleData.waitingListEntryId) {
      await tx.waitingListEntry.update({
        where: { id: saleData.waitingListEntryId },
        data: { status: 'COMPLETED' }
      });
    }
    
    // 4. Envoyer un email de confirmation (async)
    await queueEmail('sale-confirmation', {
      to: saleData.clientEmail,
      dogName: saleData.dogName,
      price: saleData.price
    });
    
    return sale;
  });
}
```

---

## 6. Statistiques et Analytics

### 6.1 Métriques calculées

```typescript
interface KennelStats {
  // Compteurs
  totalDogs: number;
  activeDogs: number;
  breedingDogs: number;
  totalLitters: number;
  totalClients: number;
  
  // Financier
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageSalePrice: number;
  
  // Reproduction
  averageLitterSize: number;
  maleToFemaleRatio: number;
  breedingSuccessRate: number;
  
  // Santé
  upcomingVaccines: number;
  overdueVaccines: number;
}
```

### 6.2 Calcul des statistiques financières

```typescript
async function getFinancialStats(kennelId: string, period: { start: Date, end: Date }) {
  const [sales, expenses] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        kennelId,
        saleDate: { gte: period.start, lte: period.end }
      },
      _sum: { price: true },
      _count: true,
      _avg: { price: true }
    }),
    prisma.expense.aggregate({
      where: {
        kennelId,
        expenseDate: { gte: period.start, lte: period.end }
      },
      _sum: { amount: true }
    })
  ]);
  
  const revenue = sales._sum.price || 0;
  const totalExpenses = expenses._sum.amount || 0;
  
  return {
    revenue,
    expenses: totalExpenses,
    profit: revenue - totalExpenses,
    salesCount: sales._count,
    averageSalePrice: sales._avg.price || 0,
    profitMargin: revenue > 0 ? ((revenue - totalExpenses) / revenue * 100) : 0
  };
}
```

---

## 7. Notifications et Rappels

### 7.1 Types de notifications

| Type | Déclencheur | Canal |
|------|-------------|-------|
| Vaccin à venir | 7 jours avant | App + Email |
| Vaccin en retard | Date dépassée | App + Email |
| Naissance prévue | 7 jours avant | App |
| Chaleurs prévues | 14 jours avant | App |
| Limite plan atteinte | 80% de la limite | App |
| Paiement échoué | Webhook Stripe | Email |

### 7.2 Système de rappels

```typescript
// Cron job quotidien
async function processReminders() {
  const today = new Date();
  const in7Days = addDays(today, 7);
  
  // Vaccins à venir
  const upcomingVaccines = await prisma.healthRecord.findMany({
    where: {
      recordType: 'VACCINE',
      nextDueDate: {
        gte: today,
        lte: in7Days
      },
      reminderSent: false
    },
    include: {
      dog: { include: { kennel: { include: { owner: true } } } }
    }
  });
  
  for (const vaccine of upcomingVaccines) {
    // Créer notification in-app
    await createNotification({
      userId: vaccine.dog.kennel.owner.id,
      type: 'VACCINE_REMINDER',
      title: `Rappel vaccin: ${vaccine.dog.name}`,
      message: `Le vaccin "${vaccine.title}" est prévu le ${formatDate(vaccine.nextDueDate)}`,
      link: `/dogs/${vaccine.dog.id}/health`
    });
    
    // Envoyer email si activé
    if (vaccine.dog.kennel.owner.emailNotifications) {
      await sendEmail('vaccine-reminder', {
        to: vaccine.dog.kennel.owner.email,
        dogName: vaccine.dog.name,
        vaccineName: vaccine.title,
        dueDate: vaccine.nextDueDate
      });
    }
    
    // Marquer comme envoyé
    await prisma.healthRecord.update({
      where: { id: vaccine.id },
      data: { reminderSent: true }
    });
  }
}
```

---

## 8. Sécurité et Isolation des Données

### 8.1 Multi-tenancy

Chaque requête est scopée à l'élevage (kennel) de l'utilisateur:

```typescript
// Middleware d'isolation
async function withKennelScope(req: Request, handler: Function) {
  const session = await getSession(req);
  const kennelId = req.params.kennelId;
  
  // Vérifier que l'utilisateur a accès à cet élevage
  const hasAccess = await prisma.kennel.findFirst({
    where: {
      id: kennelId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } }
      ]
    }
  });
  
  if (!hasAccess) {
    throw new ForbiddenError('Accès non autorisé à cet élevage');
  }
  
  // Injecter le kennelId dans le contexte
  req.kennelId = kennelId;
  
  return handler(req);
}
```

### 8.2 Validation des entrées

Toutes les entrées sont validées avec Zod:

```typescript
const createDogSchema = z.object({
  name: z.string().min(1).max(100),
  registeredName: z.string().max(200).optional(),
  breed: z.string().min(1).max(100),
  sex: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().datetime().optional(),
  microchip: z.string().regex(/^\d{15}$/).optional(),
  // ... autres champs
});

// Utilisation
const validated = createDogSchema.parse(req.body);
```

---

## 9. Import/Export de Données

### 9.1 Formats supportés

| Format | Import | Export | Données |
|--------|--------|--------|---------|
| CSV | ✅ | ✅ | Chiens, Clients |
| Excel | ✅ | ✅ | Tous |
| JSON | ✅ | ✅ | Backup complet |
| PDF | ❌ | ✅ | Pedigrees, Rapports |

### 9.2 Export RGPD

```typescript
async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      kennels: {
        include: {
          dogs: true,
          litters: true,
          clients: true,
          sales: true,
          expenses: true
        }
      }
    }
  });
  
  return {
    exportDate: new Date().toISOString(),
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    },
    kennels: user.kennels.map(kennel => ({
      name: kennel.name,
      dogs: kennel.dogs,
      litters: kennel.litters,
      clients: kennel.clients.map(c => ({
        ...c,
        // Masquer les données sensibles des clients tiers
        email: maskEmail(c.email),
        phone: maskPhone(c.phone)
      })),
      sales: kennel.sales,
      expenses: kennel.expenses
    }))
  };
}
```
