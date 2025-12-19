/**
 * Prédicteur de couleurs de robe
 * Implémente la génétique mendélienne pour prédire les couleurs d'une portée
 * 
 * Loci supportés:
 * - E (Extension): Contrôle la production d'eumélanine
 * - B (Brown): Modifie le noir en chocolat
 * - K (Dominant Black): Contrôle le patron de couleur
 * - A (Agouti): Distribution du pigment
 * - D (Dilution): Dilue la couleur
 * - S (Spotting): Panachure blanche
 * - M (Merle): Patron merle
 */

import type { ColorPrediction, DogGenotype } from '@/types';

// ===========================================
// TYPES ET INTERFACES
// ===========================================

interface Allele {
  symbol: string;
  name: string;
  dominant: boolean;
}

interface Locus {
  name: string;
  description: string;
  alleles: Allele[];
}

interface Phenotype {
  name: string;
  hex: string;
  description: string;
  warnings: string[];
}

interface PunnettCell {
  genotype: DogGenotype;
  probability: number;
}

// ===========================================
// CONSTANTES GÉNÉTIQUES
// ===========================================

export const LOCI: Record<string, Locus> = {
  E: {
    name: 'Extension',
    description: 'Contrôle la production de pigment noir (eumélanine)',
    alleles: [
      { symbol: 'E', name: 'Extension normale', dominant: true },
      { symbol: 'Em', name: 'Masque noir', dominant: true },
      { symbol: 'Eg', name: 'Grizzle', dominant: true },
      { symbol: 'e', name: 'Jaune/Rouge récessif', dominant: false },
    ],
  },
  B: {
    name: 'Brown',
    description: 'Modifie le noir en chocolat/marron',
    alleles: [
      { symbol: 'B', name: 'Noir', dominant: true },
      { symbol: 'b', name: 'Chocolat', dominant: false },
    ],
  },
  K: {
    name: 'Dominant Black',
    description: 'Contrôle le patron de couleur',
    alleles: [
      { symbol: 'KB', name: 'Noir dominant', dominant: true },
      { symbol: 'kbr', name: 'Bringé', dominant: false },
      { symbol: 'ky', name: 'Permet expression Agouti', dominant: false },
    ],
  },
  A: {
    name: 'Agouti',
    description: 'Détermine le patron de distribution du pigment',
    alleles: [
      { symbol: 'Ay', name: 'Fauve dominant', dominant: true },
      { symbol: 'aw', name: 'Agouti sauvage', dominant: false },
      { symbol: 'at', name: 'Noir et feu (tan points)', dominant: false },
      { symbol: 'a', name: 'Noir récessif', dominant: false },
    ],
  },
  D: {
    name: 'Dilution',
    description: 'Dilue la couleur (noir → bleu, chocolat → lilas)',
    alleles: [
      { symbol: 'D', name: 'Non dilué', dominant: true },
      { symbol: 'd', name: 'Dilué', dominant: false },
    ],
  },
  S: {
    name: 'Spotting',
    description: 'Contrôle la panachure blanche',
    alleles: [
      { symbol: 'S', name: 'Couleur unie', dominant: true },
      { symbol: 'sp', name: 'Panachure partielle', dominant: false },
      { symbol: 'sw', name: 'Panachure extrême', dominant: false },
    ],
  },
  M: {
    name: 'Merle',
    description: 'Patron merle (dilution en mosaïque)',
    alleles: [
      { symbol: 'M', name: 'Merle', dominant: true },
      { symbol: 'm', name: 'Non merle', dominant: false },
    ],
  },
};

// Couleurs de base avec leurs codes hex
const COLOR_HEX: Record<string, string> = {
  'Noir': '#1a1a1a',
  'Chocolat': '#5c3317',
  'Bleu': '#4a6670',
  'Lilas': '#9b8b9e',
  'Fauve': '#d4a574',
  'Rouge': '#b5651d',
  'Crème': '#f5deb3',
  'Noir et feu': '#2d2d2d',
  'Chocolat et feu': '#6b4423',
  'Bleu et feu': '#5a7a8a',
  'Bringé': '#8b7355',
  'Sable': '#c2b280',
  'Bleu merle': '#7a9ba8',
  'Rouge merle': '#c9a88a',
};

// ===========================================
// FONCTIONS PRINCIPALES
// ===========================================

/**
 * Prédit les couleurs possibles d'une portée
 * 
 * @param sireGenotype - Génotype du père
 * @param damGenotype - Génotype de la mère
 * @returns Liste des prédictions avec probabilités
 */
export function predictColors(
  sireGenotype: DogGenotype,
  damGenotype: DogGenotype
): ColorPrediction[] {
  // Générer toutes les combinaisons possibles
  const combinations = generateAllCombinations(sireGenotype, damGenotype);
  
  // Regrouper par phénotype
  const phenotypeMap = new Map<string, ColorPrediction>();
  
  for (const combo of combinations) {
    const phenotype = determinePhenotype(combo.genotype);
    const key = phenotype.name;
    
    if (phenotypeMap.has(key)) {
      const existing = phenotypeMap.get(key)!;
      existing.probability += combo.probability;
    } else {
      phenotypeMap.set(key, {
        phenotype: phenotype.name,
        genotype: formatGenotype(combo.genotype),
        probability: combo.probability,
        hex: phenotype.hex,
        description: phenotype.description,
        warnings: phenotype.warnings.length > 0 ? phenotype.warnings : undefined,
      });
    }
  }
  
  // Convertir en array et trier par probabilité
  return Array.from(phenotypeMap.values())
    .sort((a, b) => b.probability - a.probability);
}

/**
 * Génère toutes les combinaisons possibles de génotypes
 */
function generateAllCombinations(
  sireGenotype: DogGenotype,
  damGenotype: DogGenotype
): PunnettCell[] {
  const results: PunnettCell[] = [];
  
  // Pour chaque locus, calculer les combinaisons possibles
  const locusResults: Record<string, { alleles: [string, string]; prob: number }[]> = {};
  
  for (const locus of ['E', 'B', 'K', 'A', 'D'] as const) {
    locusResults[locus] = punnettSquare(
      sireGenotype[locus],
      damGenotype[locus]
    );
  }
  
  // Générer toutes les combinaisons (produit cartésien)
  const eCombos = locusResults['E'];
  const bCombos = locusResults['B'];
  const kCombos = locusResults['K'];
  const aCombos = locusResults['A'];
  const dCombos = locusResults['D'];
  
  for (const e of eCombos) {
    for (const b of bCombos) {
      for (const k of kCombos) {
        for (const a of aCombos) {
          for (const d of dCombos) {
            const probability = e.prob * b.prob * k.prob * a.prob * d.prob;
            
            results.push({
              genotype: {
                E: e.alleles,
                B: b.alleles,
                K: k.alleles,
                A: a.alleles,
                D: d.alleles,
              },
              probability,
            });
          }
        }
      }
    }
  }
  
  return results;
}

/**
 * Calcule le carré de Punnett pour un locus
 */
function punnettSquare(
  sireAlleles: [string, string],
  damAlleles: [string, string]
): { alleles: [string, string]; prob: number }[] {
  const results: { alleles: [string, string]; prob: number }[] = [];
  const seen = new Map<string, number>();
  
  // 4 combinaisons possibles
  const combos: [string, string][] = [
    [sireAlleles[0], damAlleles[0]],
    [sireAlleles[0], damAlleles[1]],
    [sireAlleles[1], damAlleles[0]],
    [sireAlleles[1], damAlleles[1]],
  ];
  
  for (const [a1, a2] of combos) {
    // Normaliser l'ordre (dominant en premier)
    const sorted = sortAlleles(a1, a2);
    const key = `${sorted[0]}/${sorted[1]}`;
    
    if (seen.has(key)) {
      seen.set(key, seen.get(key)! + 0.25);
    } else {
      seen.set(key, 0.25);
    }
  }
  
  for (const [key, prob] of seen.entries()) {
    const [a1, a2] = key.split('/');
    results.push({ alleles: [a1, a2], prob });
  }
  
  return results;
}

/**
 * Trie les allèles (dominant en premier)
 */
function sortAlleles(a1: string, a2: string): [string, string] {
  // Ordre de dominance simplifié
  const order: Record<string, number> = {
    'E': 1, 'Em': 1, 'Eg': 1, 'e': 2,
    'B': 1, 'b': 2,
    'KB': 1, 'kbr': 2, 'ky': 3,
    'Ay': 1, 'aw': 2, 'at': 3, 'a': 4,
    'D': 1, 'd': 2,
    'S': 1, 'sp': 2, 'sw': 3,
    'M': 1, 'm': 2,
  };
  
  const o1 = order[a1] || 99;
  const o2 = order[a2] || 99;
  
  return o1 <= o2 ? [a1, a2] : [a2, a1];
}

/**
 * Détermine le phénotype à partir du génotype
 */
function determinePhenotype(genotype: DogGenotype): Phenotype {
  const warnings: string[] = [];
  
  // Vérifier le double merle (danger santé)
  if (genotype.M && genotype.M[0] === 'M' && genotype.M[1] === 'M') {
    warnings.push('⚠️ Double Merle: Risques élevés de surdité et cécité');
  }
  
  // Vérifier si ee (jaune/rouge)
  const isEE = genotype.E[0] !== 'e' || genotype.E[1] !== 'e';
  
  if (!isEE) {
    // ee = jaune/rouge, ignore les autres loci pour la couleur de base
    const isDilute = genotype.D[0] === 'd' && genotype.D[1] === 'd';
    const isChocolate = genotype.B[0] === 'b' && genotype.B[1] === 'b';
    
    let name = 'Fauve';
    if (isDilute) {
      name = 'Crème';
    } else if (isChocolate) {
      name = 'Rouge'; // Nez chocolat
    }
    
    return {
      name,
      hex: COLOR_HEX[name] || '#d4a574',
      description: `Robe unie ${name.toLowerCase()}`,
      warnings,
    };
  }
  
  // Déterminer la couleur de base (noir ou chocolat)
  const isChocolate = genotype.B[0] === 'b' && genotype.B[1] === 'b';
  const isDilute = genotype.D[0] === 'd' && genotype.D[1] === 'd';
  
  let baseColor = 'Noir';
  if (isChocolate && isDilute) {
    baseColor = 'Lilas';
  } else if (isChocolate) {
    baseColor = 'Chocolat';
  } else if (isDilute) {
    baseColor = 'Bleu';
  }
  
  // Vérifier le locus K
  const hasKB = genotype.K[0] === 'KB' || genotype.K[1] === 'KB';
  const hasBrindle = genotype.K[0] === 'kbr' || genotype.K[1] === 'kbr';
  
  if (hasKB) {
    // Noir dominant (ou chocolat/bleu/lilas)
    return {
      name: baseColor,
      hex: COLOR_HEX[baseColor] || '#1a1a1a',
      description: `Robe unie ${baseColor.toLowerCase()}`,
      warnings,
    };
  }
  
  // Locus A s'exprime (ky/ky ou ky/kbr)
  const agouti = genotype.A[0]; // Premier allèle (dominant)
  
  if (agouti === 'Ay') {
    // Fauve dominant
    const name = isDilute ? 'Crème' : 'Fauve';
    return {
      name,
      hex: COLOR_HEX[name] || '#d4a574',
      description: `Robe fauve${isDilute ? ' diluée' : ''}`,
      warnings,
    };
  }
  
  if (agouti === 'aw') {
    // Agouti sauvage / Sable
    return {
      name: 'Sable',
      hex: COLOR_HEX['Sable'] || '#c2b280',
      description: 'Robe sable (agouti)',
      warnings,
    };
  }
  
  if (agouti === 'at') {
    // Noir et feu
    const name = `${baseColor} et feu`;
    return {
      name,
      hex: COLOR_HEX[name] || COLOR_HEX['Noir et feu'],
      description: `Robe ${baseColor.toLowerCase()} avec marques feu`,
      warnings,
    };
  }
  
  // a/a = noir récessif
  return {
    name: baseColor,
    hex: COLOR_HEX[baseColor] || '#1a1a1a',
    description: `Robe unie ${baseColor.toLowerCase()} (récessif)`,
    warnings,
  };
}

/**
 * Formate le génotype pour l'affichage
 */
function formatGenotype(genotype: DogGenotype): string {
  const parts: string[] = [];
  
  for (const [locus, alleles] of Object.entries(genotype)) {
    if (alleles) {
      parts.push(`${alleles[0]}/${alleles[1]}`);
    }
  }
  
  return parts.join(' ');
}

/**
 * Crée un génotype par défaut (homozygote dominant)
 */
export function createDefaultGenotype(): DogGenotype {
  return {
    E: ['E', 'E'],
    B: ['B', 'B'],
    K: ['ky', 'ky'],
    A: ['Ay', 'Ay'],
    D: ['D', 'D'],
  };
}

/**
 * Valide un génotype
 */
export function validateGenotype(genotype: Partial<DogGenotype>): string[] {
  const errors: string[] = [];
  
  const requiredLoci = ['E', 'B', 'K', 'A', 'D'] as const;
  
  for (const locus of requiredLoci) {
    if (!genotype[locus]) {
      errors.push(`Le locus ${locus} est requis`);
    } else if (!Array.isArray(genotype[locus]) || genotype[locus]!.length !== 2) {
      errors.push(`Le locus ${locus} doit avoir exactement 2 allèles`);
    }
  }
  
  return errors;
}
