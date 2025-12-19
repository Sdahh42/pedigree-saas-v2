/**
 * Service de génération de pedigrees
 * Gère la construction de l'arbre généalogique et l'export PDF
 */

import { prisma } from '@/lib/prisma';
import type { PedigreeNode } from '@/types';

// ===========================================
// CONSTRUCTION DU PEDIGREE
// ===========================================

/**
 * Construit l'arbre de pedigree d'un chien
 * 
 * @param dogId - ID du chien
 * @param maxGenerations - Nombre maximum de générations (1-10)
 * @returns Arbre de pedigree ou null si le chien n'existe pas
 */
export async function buildPedigree(
  dogId: string,
  maxGenerations: number = 5
): Promise<PedigreeNode | null> {
  // Valider les paramètres
  if (!dogId) {
    throw new Error('L\'ID du chien est requis');
  }
  if (maxGenerations < 1 || maxGenerations > 10) {
    throw new Error('Le nombre de générations doit être entre 1 et 10');
  }

  return buildPedigreeRecursive(dogId, 1, maxGenerations);
}

/**
 * Fonction récursive pour construire l'arbre
 */
async function buildPedigreeRecursive(
  dogId: string,
  currentDepth: number,
  maxDepth: number
): Promise<PedigreeNode | null> {
  // Arrêter si on dépasse la profondeur max
  if (currentDepth > maxDepth) {
    return null;
  }

  // Récupérer le chien avec ses informations
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
      photos: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  if (!dog) {
    return null;
  }

  // Construire récursivement les parents
  const [sire, dam] = await Promise.all([
    dog.sireId ? buildPedigreeRecursive(dog.sireId, currentDepth + 1, maxDepth) : null,
    dog.damId ? buildPedigreeRecursive(dog.damId, currentDepth + 1, maxDepth) : null,
  ]);

  return {
    id: dog.id,
    name: dog.name,
    registeredName: dog.registeredName,
    sex: dog.sex,
    birthDate: dog.birthDate,
    color: dog.color,
    titles: dog.titles,
    photoUrl: dog.photos[0]?.url || null,
    sire,
    dam,
  };
}

/**
 * Compte le nombre total d'ancêtres dans un pedigree
 */
export function countAncestors(pedigree: PedigreeNode | null): number {
  if (!pedigree) return 0;
  
  let count = 1; // Le chien lui-même
  if (pedigree.sire) count += countAncestors(pedigree.sire);
  if (pedigree.dam) count += countAncestors(pedigree.dam);
  
  return count;
}

/**
 * Calcule le pourcentage de complétude du pedigree
 * (nombre d'ancêtres connus vs nombre théorique)
 */
export function calculateCompleteness(
  pedigree: PedigreeNode | null,
  generations: number
): number {
  if (!pedigree) return 0;
  
  // Nombre théorique d'ancêtres pour N générations: 2^(N+1) - 1
  const theoretical = Math.pow(2, generations + 1) - 1;
  const actual = countAncestors(pedigree);
  
  return Math.round((actual / theoretical) * 100);
}

/**
 * Extrait la liste plate de tous les ancêtres
 */
export function flattenPedigree(pedigree: PedigreeNode | null): PedigreeNode[] {
  if (!pedigree) return [];
  
  const result: PedigreeNode[] = [pedigree];
  
  if (pedigree.sire) {
    result.push(...flattenPedigree(pedigree.sire));
  }
  if (pedigree.dam) {
    result.push(...flattenPedigree(pedigree.dam));
  }
  
  return result;
}

/**
 * Trouve les ancêtres uniques (dédupliqués par ID)
 */
export function getUniqueAncestors(pedigree: PedigreeNode | null): PedigreeNode[] {
  const all = flattenPedigree(pedigree);
  const seen = new Set<string>();
  const unique: PedigreeNode[] = [];
  
  for (const node of all) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
      unique.push(node);
    }
  }
  
  return unique;
}

// ===========================================
// OPTIONS D'EXPORT
// ===========================================

export interface PedigreeExportOptions {
  generations: number;
  includePhotos: boolean;
  includeHealth: boolean;
  includeCoi: boolean;
  includeTitles: boolean;
  includeColors: boolean;
  paperSize: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  kennelLogo?: string;
  kennelName?: string;
}

export const DEFAULT_EXPORT_OPTIONS: PedigreeExportOptions = {
  generations: 3,
  includePhotos: true,
  includeHealth: false,
  includeCoi: true,
  includeTitles: true,
  includeColors: true,
  paperSize: 'A4',
  orientation: 'landscape',
};

// ===========================================
// GÉNÉRATION PDF (côté serveur)
// ===========================================

/**
 * Génère un PDF de pedigree
 * Note: L'implémentation complète utiliserait jsPDF ou puppeteer
 * 
 * @param dogId - ID du chien
 * @param options - Options d'export
 * @returns URL du PDF généré ou buffer
 */
export async function generatePedigreePDF(
  dogId: string,
  options: Partial<PedigreeExportOptions> = {}
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const mergedOptions = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    
    // Construire le pedigree
    const pedigree = await buildPedigree(dogId, mergedOptions.generations);
    
    if (!pedigree) {
      return { success: false, error: 'Chien non trouvé' };
    }

    // TODO: Implémenter la génération PDF avec jsPDF
    // Pour l'instant, retourner un placeholder
    
    // Exemple de structure pour jsPDF:
    // const doc = new jsPDF({
    //   orientation: mergedOptions.orientation,
    //   unit: 'mm',
    //   format: mergedOptions.paperSize.toLowerCase(),
    // });
    // 
    // // Ajouter le contenu...
    // drawPedigreeTree(doc, pedigree, mergedOptions);
    // 
    // const pdfBuffer = doc.output('arraybuffer');
    // // Sauvegarder ou retourner...

    return {
      success: true,
      url: `/api/pedigrees/${dogId}/pdf?generations=${mergedOptions.generations}`,
    };
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// ===========================================
// UTILITAIRES
// ===========================================

/**
 * Formate le nom complet d'un chien pour le pedigree
 */
export function formatPedigreeName(node: PedigreeNode): string {
  let name = node.registeredName || node.name;
  
  if (node.titles) {
    name = `${node.titles} ${name}`;
  }
  
  return name;
}

/**
 * Génère une description textuelle du pedigree
 */
export function describePedigree(pedigree: PedigreeNode | null, generations: number): string {
  if (!pedigree) return 'Pedigree non disponible';
  
  const completeness = calculateCompleteness(pedigree, generations);
  const uniqueCount = getUniqueAncestors(pedigree).length;
  
  return `Pedigree de ${pedigree.name} sur ${generations} générations. ` +
    `Complétude: ${completeness}%. ` +
    `${uniqueCount} ancêtres uniques.`;
}
