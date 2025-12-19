/**
 * Utilitaires généraux de l'application
 * Fonctions helper réutilisables dans tout le projet
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Combine les classes CSS avec support Tailwind
 * Utilise clsx pour la logique conditionnelle et twMerge pour résoudre les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date en français
 * @param date - Date à formater (string ISO ou Date)
 * @param formatStr - Format de sortie (défaut: 'dd/MM/yyyy')
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'dd/MM/yyyy'
): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Formate une date en format relatif (ex: "il y a 2 jours")
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
}

/**
 * Formate un montant en devise
 * @param amount - Montant à formater
 * @param currency - Code devise (défaut: EUR)
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'EUR'
): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @returns Objet avec années et mois
 */
export function calculateAge(birthDate: string | Date | null | undefined): {
  years: number;
  months: number;
  formatted: string;
} | null {
  if (!birthDate) return null;
  
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Ajuster si le jour n'est pas encore passé ce mois
  if (now.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  let formatted = '';
  if (years > 0) {
    formatted = `${years} an${years > 1 ? 's' : ''}`;
    if (months > 0) {
      formatted += ` ${months} mois`;
    }
  } else {
    formatted = `${months} mois`;
  }
  
  return { years, months, formatted };
}

/**
 * Retourne le label du sexe en français
 */
export function getSexLabel(sex: 'MALE' | 'FEMALE'): string {
  return sex === 'MALE' ? 'Mâle' : 'Femelle';
}

/**
 * Retourne l'emoji du sexe
 */
export function getSexEmoji(sex: 'MALE' | 'FEMALE'): string {
  return sex === 'MALE' ? '♂' : '♀';
}

/**
 * Génère des initiales à partir d'un nom
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Slugify une chaîne (pour les URLs)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Génère un ID unique simple
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Attend un certain temps (pour les tests/démo)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Vérifie si une valeur est vide (null, undefined, '', [])
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Capitalise la première lettre
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formate un numéro de téléphone français
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-';
  // Supprime tout sauf les chiffres
  const digits = phone.replace(/\D/g, '');
  // Format français: 06 12 34 56 78
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de puce (15 chiffres)
 */
export function isValidMicrochip(microchip: string): boolean {
  return /^\d{15}$/.test(microchip);
}
