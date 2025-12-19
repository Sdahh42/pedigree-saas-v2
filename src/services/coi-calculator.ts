/**
 * Calculateur de Coefficient de Consanguinité (COI)
 * Utilise la formule de Wright pour calculer le COI d'un accouplement potentiel
 * 
 * Le COI mesure la probabilité que deux allèles à un locus donné soient
 * identiques par descendance (IBD - Identical By Descent)
 */

import { prisma } from '@/lib/prisma';
import type { COIResult, CommonAncestor } from '@/types';

// ===========================================
// TYPES INTERNES
// ===========================================

interface Ancestor {
  id: string;
  name: string;
  generation: number;
  path: string[];
}

interface AncestorMap {
  [dogId: string]: Ancestor[];
}

// ===========================================
// CACHE EN MÉMOIRE
// ===========================================

// Cache simple pour les ancêtres (évite les requêtes répétées)
const ancestorCache = new Map<string, AncestorMap>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

/**
 * Nettoie le cache expiré
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > CACHE_TTL) {
      ancestorCache.delete(key);
      cacheTimestamps.delete(key);
    }
  }
}

// ===========================================
// FONCTIONS PRINCIPALES
// ===========================================

/**
 * Calcule le COI pour un accouplement potentiel entre deux chiens
 * 
 * @param sireId - ID du père potentiel
 * @param damId - ID de la mère potentielle
 * @param generations - Nombre de générations à analyser (3-10)
 * @returns Résultat du calcul COI avec ancêtres communs
 */
export async function calculateCOI(
  sireId: string,
  damId: string,
  generations: number = 5
): Promise<COIResult> {
  // Valider les paramètres
  if (!sireId || !damId) {
    throw new Error('Les IDs du père et de la mère sont requis');
  }
  if (generations < 1 || generations > 10) {
    throw new Error('Le nombre de générations doit être entre 1 et 10');
  }

  // Nettoyer le cache expiré
  cleanExpiredCache();

  // Récupérer les ancêtres des deux parents
  const [sireAncestors, damAncestors] = await Promise.all([
    getAncestors(sireId, generations),
    getAncestors(damId, generations),
  ]);

  // Trouver les ancêtres communs
  const commonAncestorIds = new Set<string>();
  for (const id of Object.keys(sireAncestors)) {
    if (id in damAncestors) {
      commonAncestorIds.add(id);
    }
  }

  // Calculer la contribution de chaque ancêtre commun
  let totalCOI = 0;
  const contributions: CommonAncestor[] = [];

  for (const ancestorId of commonAncestorIds) {
    const sirePaths = sireAncestors[ancestorId];
    const damPaths = damAncestors[ancestorId];

    let ancestorContribution = 0;
    const allPaths: string[][] = [];

    // Pour chaque combinaison de chemins
    for (const sirePath of sirePaths) {
      for (const damPath of damPaths) {
        // Formule de Wright: (0.5)^(n1+n2+1) * (1 + Fa)
        // n1 = générations via le père, n2 = générations via la mère
        // Fa = COI de l'ancêtre commun (simplifié à 0 ici)
        const n1 = sirePath.generation;
        const n2 = damPath.generation;
        const contribution = Math.pow(0.5, n1 + n2 + 1);
        
        ancestorContribution += contribution;
        allPaths.push([...sirePath.path]);
        allPaths.push([...damPath.path]);
      }
    }

    if (ancestorContribution > 0) {
      totalCOI += ancestorContribution;
      
      // Récupérer le nom de l'ancêtre
      const ancestorName = sirePaths[0]?.path[sirePaths[0].path.length - 1] || 'Inconnu';
      
      contributions.push({
        id: ancestorId,
        name: ancestorName,
        contribution: ancestorContribution * 100, // En pourcentage
        paths: allPaths,
      });
    }
  }

  // Trier par contribution décroissante
  contributions.sort((a, b) => b.contribution - a.contribution);

  return {
    coi: totalCOI,
    percentage: `${(totalCOI * 100).toFixed(2)}%`,
    interpretation: interpretCOI(totalCOI),
    commonAncestors: contributions.slice(0, 10), // Top 10
  };
}

/**
 * Récupère tous les ancêtres d'un chien jusqu'à N générations
 */
async function getAncestors(
  dogId: string,
  maxGenerations: number
): Promise<AncestorMap> {
  const cacheKey = `${dogId}-${maxGenerations}`;
  
  // Vérifier le cache
  if (ancestorCache.has(cacheKey)) {
    return ancestorCache.get(cacheKey)!;
  }

  const ancestors: AncestorMap = {};
  
  // Fonction récursive pour parcourir l'arbre
  async function traverse(
    currentId: string,
    generation: number,
    path: string[]
  ): Promise<void> {
    if (generation > maxGenerations) return;

    // Récupérer le chien avec ses parents
    const dog = await prisma.dog.findUnique({
      where: { id: currentId },
      select: {
        id: true,
        name: true,
        sireId: true,
        damId: true,
      },
    });

    if (!dog) return;

    const currentPath = [...path, dog.name];

    // Ajouter cet ancêtre à la map
    if (!ancestors[dog.id]) {
      ancestors[dog.id] = [];
    }
    ancestors[dog.id].push({
      id: dog.id,
      name: dog.name,
      generation,
      path: currentPath,
    });

    // Continuer avec les parents
    if (dog.sireId) {
      await traverse(dog.sireId, generation + 1, currentPath);
    }
    if (dog.damId) {
      await traverse(dog.damId, generation + 1, currentPath);
    }
  }

  // Démarrer la traversée
  await traverse(dogId, 0, []);

  // Mettre en cache
  ancestorCache.set(cacheKey, ancestors);
  cacheTimestamps.set(cacheKey, Date.now());

  return ancestors;
}

/**
 * Interprète le COI et retourne une description
 */
function interpretCOI(coi: number): string {
  if (coi < 0.0625) {
    return 'Très faible - Excellent choix d\'accouplement';
  }
  if (coi < 0.125) {
    return 'Faible - Bon choix d\'accouplement';
  }
  if (coi < 0.25) {
    return 'Modéré - Acceptable avec surveillance';
  }
  if (coi < 0.375) {
    return 'Élevé - Accouplement déconseillé';
  }
  return 'Très élevé - Accouplement fortement déconseillé';
}

/**
 * Retourne la couleur associée au niveau de COI
 */
export function getCOIColor(coi: number): string {
  if (coi < 0.0625) return 'green';
  if (coi < 0.125) return 'lime';
  if (coi < 0.25) return 'yellow';
  if (coi < 0.375) return 'orange';
  return 'red';
}

/**
 * Calcule le COI d'un chien existant (basé sur ses parents)
 */
export async function calculateDogCOI(
  dogId: string,
  generations: number = 5
): Promise<COIResult | null> {
  const dog = await prisma.dog.findUnique({
    where: { id: dogId },
    select: { sireId: true, damId: true },
  });

  if (!dog?.sireId || !dog?.damId) {
    return null;
  }

  return calculateCOI(dog.sireId, dog.damId, generations);
}

/**
 * Vide le cache des ancêtres
 */
export function clearAncestorCache(): void {
  ancestorCache.clear();
  cacheTimestamps.clear();
}
