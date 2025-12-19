/**
 * Constantes de l'application
 * Valeurs réutilisables dans tout le projet
 */

// ===========================================
// PLANS ET LIMITES
// ===========================================

export const PLANS = {
  FREE: {
    name: 'Gratuit',
    description: 'Pour débuter',
    price: { monthly: 0, yearly: 0 },
    limits: {
      dogs: 10,
      litters: 3,
      clients: 10,
      kennels: 1,
      pedigreeGenerations: 3,
      storageBytes: 100 * 1024 * 1024, // 100 MB
    },
    features: {
      coiCalculator: false,
      colorPrediction: false,
      geneticImport: false,
      excelExport: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  PRO: {
    name: 'Pro',
    description: 'Pour les éleveurs actifs',
    price: { monthly: 999, yearly: 9900 }, // centimes
    limits: {
      dogs: 100,
      litters: 50,
      clients: 200,
      kennels: 1,
      pedigreeGenerations: 5,
      storageBytes: 1024 * 1024 * 1024, // 1 GB
    },
    features: {
      coiCalculator: true,
      colorPrediction: true,
      geneticImport: false,
      excelExport: true,
      apiAccess: false,
      prioritySupport: true,
    },
  },
  ELITE: {
    name: 'Elite',
    description: 'Pour les professionnels',
    price: { monthly: 1999, yearly: 19900 },
    limits: {
      dogs: -1, // illimité
      litters: -1,
      clients: -1,
      kennels: 5,
      pedigreeGenerations: 10,
      storageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    },
    features: {
      coiCalculator: true,
      colorPrediction: true,
      geneticImport: true,
      excelExport: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

// ===========================================
// RACES DE CHIENS (les plus courantes en France)
// ===========================================

export const DOG_BREEDS = [
  'Berger Allemand',
  'Berger Australien',
  'Berger Belge Malinois',
  'Berger Blanc Suisse',
  'Border Collie',
  'Bouledogue Français',
  'Boxer',
  'Braque Allemand',
  'Braque de Weimar',
  'Bulldog Anglais',
  'Caniche',
  'Cavalier King Charles',
  'Chihuahua',
  'Cocker Anglais',
  'Cocker Américain',
  'Colley',
  'Dalmatien',
  'Dobermann',
  'Dogue Allemand',
  'Épagneul Breton',
  'Golden Retriever',
  'Husky Sibérien',
  'Jack Russell Terrier',
  'Labrador Retriever',
  'Malinois',
  'Rottweiler',
  'Setter Anglais',
  'Setter Irlandais',
  'Shiba Inu',
  'Shih Tzu',
  'Spitz Allemand',
  'Staffordshire Bull Terrier',
  'Teckel',
  'Terre-Neuve',
  'Welsh Corgi',
  'West Highland White Terrier',
  'Yorkshire Terrier',
  'Autre',
] as const;

// ===========================================
// COULEURS DE ROBE
// ===========================================

export const DOG_COLORS = [
  'Noir',
  'Blanc',
  'Fauve',
  'Bringé',
  'Noir et feu',
  'Noir et blanc',
  'Tricolore',
  'Bleu',
  'Bleu merle',
  'Rouge merle',
  'Chocolat',
  'Chocolat et feu',
  'Crème',
  'Sable',
  'Gris',
  'Rouge',
  'Abricot',
  'Fauve charbonné',
  'Autre',
] as const;

// ===========================================
// TYPES DE POIL
// ===========================================

export const COAT_TYPES = [
  'Court',
  'Mi-long',
  'Long',
  'Dur',
  'Frisé',
  'Lisse',
  'Double',
  'Sans poil',
] as const;

// ===========================================
// STATUTS
// ===========================================

export const BREEDING_STATUSES = {
  NOT_BREEDING: { label: 'Non reproducteur', color: 'gray' },
  BREEDING: { label: 'Reproducteur', color: 'green' },
  RETIRED: { label: 'Retraité', color: 'orange' },
} as const;

export const HEALTH_STATUSES = {
  HEALTHY: { label: 'En bonne santé', color: 'green' },
  SICK: { label: 'Malade', color: 'red' },
  DECEASED: { label: 'Décédé', color: 'gray' },
  UNKNOWN: { label: 'Inconnu', color: 'gray' },
} as const;

export const PRESENCE_STATUSES = {
  ACTIVE: { label: 'Présent', color: 'green' },
  RETIRED: { label: 'Retraité', color: 'orange' },
  DECEASED: { label: 'Décédé', color: 'gray' },
  SOLD: { label: 'Vendu', color: 'blue' },
  EXTERNAL: { label: 'Externe', color: 'purple' },
} as const;

export const LITTER_STATUSES = {
  EXPECTED: { label: 'Attendue', color: 'blue' },
  BORN: { label: 'Née', color: 'green' },
  WEANING: { label: 'Sevrage', color: 'orange' },
  READY: { label: 'Prête', color: 'purple' },
  COMPLETED: { label: 'Terminée', color: 'gray' },
} as const;

export const GENETIC_TEST_RESULTS = {
  CLEAR: { label: 'Sain (N/N)', color: 'green' },
  CARRIER: { label: 'Porteur (N/m)', color: 'orange' },
  AFFECTED: { label: 'Atteint (m/m)', color: 'red' },
  PENDING: { label: 'En attente', color: 'blue' },
  UNKNOWN: { label: 'Inconnu', color: 'gray' },
} as const;

// ===========================================
// TYPES D'ACCOUPLEMENT
// ===========================================

export const MATING_TYPES = {
  NATURAL: { label: 'Naturel', description: 'Saillie naturelle' },
  AI_FRESH: { label: 'IA Frais', description: 'Insémination artificielle - sperme frais' },
  AI_CHILLED: { label: 'IA Réfrigéré', description: 'Insémination artificielle - sperme réfrigéré' },
  AI_FROZEN: { label: 'IA Congelé', description: 'Insémination artificielle - sperme congelé' },
} as const;

// ===========================================
// CATÉGORIES DE DÉPENSES
// ===========================================

export const EXPENSE_CATEGORIES = {
  FOOD: { label: 'Alimentation', icon: 'Utensils' },
  VETERINARY: { label: 'Vétérinaire', icon: 'Stethoscope' },
  BREEDING: { label: 'Reproduction', icon: 'Heart' },
  EQUIPMENT: { label: 'Équipement', icon: 'Package' },
  INSURANCE: { label: 'Assurance', icon: 'Shield' },
  SHOWS: { label: 'Expositions', icon: 'Trophy' },
  TRAVEL: { label: 'Transport', icon: 'Car' },
  OTHER: { label: 'Autre', icon: 'MoreHorizontal' },
} as const;

// ===========================================
// TYPES DE DOSSIER SANTÉ
// ===========================================

export const HEALTH_RECORD_TYPES = {
  VACCINE: { label: 'Vaccin', icon: 'Syringe' },
  VET_VISIT: { label: 'Visite vétérinaire', icon: 'Stethoscope' },
  TEST: { label: 'Test/Analyse', icon: 'TestTube' },
  SURGERY: { label: 'Chirurgie', icon: 'Scissors' },
  MEDICATION: { label: 'Médicament', icon: 'Pill' },
  INJURY: { label: 'Blessure', icon: 'Bandage' },
  OTHER: { label: 'Autre', icon: 'FileText' },
} as const;

// ===========================================
// INTERPRÉTATION COI
// ===========================================

export const COI_THRESHOLDS = {
  EXCELLENT: { max: 0.0625, label: 'Très faible', color: 'green', description: 'Excellent - Accouplement recommandé' },
  GOOD: { max: 0.125, label: 'Faible', color: 'lime', description: 'Bon - Accouplement acceptable' },
  MODERATE: { max: 0.25, label: 'Modéré', color: 'yellow', description: 'Modéré - À surveiller' },
  HIGH: { max: 0.375, label: 'Élevé', color: 'orange', description: 'Élevé - Déconseillé' },
  VERY_HIGH: { max: 1, label: 'Très élevé', color: 'red', description: 'Très élevé - Fortement déconseillé' },
} as const;

// ===========================================
// NAVIGATION
// ===========================================

export const DASHBOARD_NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Tableau de bord', icon: 'LayoutDashboard' },
  { href: '/dashboard/dogs', label: 'Chiens', icon: 'Dog' },
  { href: '/dashboard/litters', label: 'Portées', icon: 'Baby' },
  { href: '/dashboard/breeding', label: 'Reproduction', icon: 'Heart' },
  { href: '/dashboard/health', label: 'Santé', icon: 'Stethoscope' },
  { href: '/dashboard/genetics', label: 'Génétique', icon: 'Dna' },
  { href: '/dashboard/pedigrees', label: 'Pedigrees', icon: 'GitBranch' },
  { href: '/dashboard/clients', label: 'Clients', icon: 'Users' },
  { href: '/dashboard/sales', label: 'Ventes', icon: 'DollarSign' },
  { href: '/dashboard/analytics', label: 'Statistiques', icon: 'BarChart3' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: 'Settings' },
] as const;
