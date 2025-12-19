/**
 * Types TypeScript de l'application
 * Définitions de types réutilisables
 */

// ===========================================
// TYPES DE BASE (réexport Prisma)
// ===========================================

export type {
  User,
  Kennel,
  Subscription,
  Dog,
  DogPhoto,
  Litter,
  Heat,
  Mating,
  HealthRecord,
  GeneticTest,
  Client,
  Sale,
  WaitingListEntry,
  Expense,
} from '@prisma/client';

// ===========================================
// ENUMS (réexport Prisma)
// ===========================================

export {
  UserRole,
  KennelMemberRole,
  Plan,
  SubscriptionStatus,
  Sex,
  BreedingStatus,
  HealthStatus,
  PresenceStatus,
  DogOrigin,
  LitterStatus,
  MatingType,
  HealthRecordType,
  GeneticTestResult,
  ClientType,
  PaymentMethod,
  WaitingListStatus,
  PreferredSex,
  ExpenseCategory,
} from '@prisma/client';

// ===========================================
// TYPES ÉTENDUS
// ===========================================

/**
 * Chien avec ses relations
 */
export interface DogWithRelations {
  id: string;
  name: string;
  registeredName: string | null;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  birthDate: Date | null;
  deathDate: Date | null;
  color: string | null;
  microchip: string | null;
  tattoo: string | null;
  registrationNumber: string | null;
  breedingStatus: 'NOT_BREEDING' | 'BREEDING' | 'RETIRED';
  healthStatus: 'HEALTHY' | 'SICK' | 'DECEASED' | 'UNKNOWN';
  presenceStatus: 'ACTIVE' | 'RETIRED' | 'DECEASED' | 'SOLD' | 'EXTERNAL';
  origin: 'INTERNAL' | 'EXTERNAL';
  isOwned: boolean;
  weight: number | null;
  height: number | null;
  coatType: string | null;
  titles: string | null;
  cotation: string | null;
  temperament: string | null;
  studFee: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  sire?: DogWithRelations | null;
  dam?: DogWithRelations | null;
  photos?: DogPhotoData[];
  healthRecords?: HealthRecordData[];
  geneticTests?: GeneticTestData[];
}

/**
 * Photo de chien
 */
export interface DogPhotoData {
  id: string;
  url: string;
  isPrimary: boolean;
  caption: string | null;
  createdAt: Date;
}

/**
 * Enregistrement santé
 */
export interface HealthRecordData {
  id: string;
  recordType: string;
  recordDate: Date;
  title: string;
  description: string | null;
  veterinarian: string | null;
  cost: number | null;
  nextDueDate: Date | null;
  attachmentUrl: string | null;
}

/**
 * Test génétique
 */
export interface GeneticTestData {
  id: string;
  testName: string;
  testDate: Date;
  result: string;
  laboratory: string | null;
  certificateNumber: string | null;
  attachmentUrl: string | null;
  notes: string | null;
}

/**
 * Noeud de pedigree (arbre récursif)
 */
export interface PedigreeNode {
  id: string;
  name: string;
  registeredName: string | null;
  sex: 'MALE' | 'FEMALE';
  birthDate: Date | null;
  color: string | null;
  titles: string | null;
  photoUrl: string | null;
  coi?: number;
  sire?: PedigreeNode | null;
  dam?: PedigreeNode | null;
}

/**
 * Résultat du calcul COI
 */
export interface COIResult {
  coi: number;
  percentage: string;
  interpretation: string;
  commonAncestors: CommonAncestor[];
}

/**
 * Ancêtre commun dans le calcul COI
 */
export interface CommonAncestor {
  id: string;
  name: string;
  contribution: number;
  paths: string[][];
}

/**
 * Prédiction de couleur
 */
export interface ColorPrediction {
  phenotype: string;
  genotype: string;
  probability: number;
  hex: string;
  description: string;
  warnings?: string[];
}

/**
 * Génotype pour la prédiction de couleur
 */
export interface DogGenotype {
  E: [string, string];
  B: [string, string];
  K: [string, string];
  A: [string, string];
  D: [string, string];
  S?: [string, string];
  M?: [string, string];
}

// ===========================================
// TYPES API
// ===========================================

/**
 * Réponse API paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Réponse API standard
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtres pour les chiens
 */
export interface DogFilters extends PaginationParams {
  search?: string;
  breed?: string;
  sex?: 'MALE' | 'FEMALE';
  breedingStatus?: 'NOT_BREEDING' | 'BREEDING' | 'RETIRED';
  presenceStatus?: 'ACTIVE' | 'RETIRED' | 'DECEASED' | 'SOLD' | 'EXTERNAL';
}

// ===========================================
// TYPES DASHBOARD
// ===========================================

/**
 * Statistiques du tableau de bord
 */
export interface DashboardStats {
  counts: {
    dogs: number;
    litters: number;
    clients: number;
  };
  limits: {
    dogs: number;
    litters: number;
    clients: number;
  };
  financial: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;
  };
  upcoming: {
    vaccines: UpcomingVaccine[];
    expectedLitters: ExpectedLitter[];
  };
  recent: {
    dogs: RecentDog[];
    sales: RecentSale[];
  };
}

export interface UpcomingVaccine {
  id: string;
  dogId: string;
  dogName: string;
  title: string;
  nextDueDate: Date;
}

export interface ExpectedLitter {
  id: string;
  sireName: string;
  damName: string;
  expectedDate: Date;
}

export interface RecentDog {
  id: string;
  name: string;
  sex: 'MALE' | 'FEMALE';
  breed: string;
  createdAt: Date;
}

export interface RecentSale {
  id: string;
  dogName: string;
  clientName: string;
  price: number;
  saleDate: Date;
}

// ===========================================
// TYPES FORMULAIRES
// ===========================================

/**
 * Données du formulaire de création de chien
 */
export interface DogFormData {
  name: string;
  registeredName?: string;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  birthDate?: string;
  deathDate?: string;
  color?: string;
  microchip?: string;
  tattoo?: string;
  registrationNumber?: string;
  sireId?: string;
  damId?: string;
  breedingStatus: 'NOT_BREEDING' | 'BREEDING' | 'RETIRED';
  healthStatus: 'HEALTHY' | 'SICK' | 'DECEASED' | 'UNKNOWN';
  presenceStatus: 'ACTIVE' | 'RETIRED' | 'DECEASED' | 'SOLD' | 'EXTERNAL';
  origin: 'INTERNAL' | 'EXTERNAL';
  isOwned: boolean;
  weight?: number;
  height?: number;
  coatType?: string;
  titles?: string;
  cotation?: string;
  temperament?: string;
  studFee?: number;
  notes?: string;
}

/**
 * Données du formulaire de création de portée
 */
export interface LitterFormData {
  sireId: string;
  damId: string;
  matingId?: string;
  birthDate: string;
  expectedDate?: string;
  totalPuppies: number;
  males: number;
  females: number;
  stillborn: number;
  status: 'EXPECTED' | 'BORN' | 'WEANING' | 'READY' | 'COMPLETED';
  notes?: string;
}

/**
 * Données du formulaire de création de client
 */
export interface ClientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  clientType: 'BUYER' | 'BREEDER' | 'BOTH';
  notes?: string;
}

/**
 * Données du formulaire de vente
 */
export interface SaleFormData {
  dogId: string;
  clientId?: string;
  saleDate: string;
  price: number;
  currency?: string;
  paymentMethod: 'CASH' | 'CHECK' | 'TRANSFER' | 'OTHER';
  contractSigned: boolean;
  notes?: string;
}
