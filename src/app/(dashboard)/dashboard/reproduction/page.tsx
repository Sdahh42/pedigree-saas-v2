'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Plus,
  Calendar,
  Baby,
  AlertCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';

// Données de démo
const heatsData = [
  { id: '1', dog: 'Luna', dogId: '1', startDate: '2024-06-15', endDate: '2024-06-28', status: 'completed' },
  { id: '2', dog: 'Bella', dogId: '3', startDate: '2024-12-10', endDate: null, status: 'active' },
];

const matingsData = [
  { id: '1', sire: 'Rex', dam: 'Luna', date: '2024-06-20', type: 'NATURAL', success: true },
  { id: '2', sire: 'Max', dam: 'Bella', date: '2024-12-15', type: 'NATURAL', success: null },
];

const littersData = [
  {
    id: '1',
    dam: 'Luna',
    damId: '1',
    sire: 'Rex',
    sireId: '2',
    birthDate: '2024-08-20',
    expectedDate: null,
    totalPuppies: 8,
    males: 5,
    females: 3,
    status: 'COMPLETED',
    available: 0,
    reserved: 2,
    sold: 6,
  },
  {
    id: '2',
    dam: 'Bella',
    damId: '3',
    sire: 'Max',
    sireId: '4',
    birthDate: null,
    expectedDate: '2025-02-15',
    totalPuppies: 0,
    males: 0,
    females: 0,
    status: 'EXPECTED',
    available: 0,
    reserved: 3,
    sold: 0,
  },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysUntil(date: string): number {
  const target = new Date(date);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ReproductionPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'heats' | 'matings' | 'litters'>('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'heats', label: 'Chaleurs' },
    { id: 'matings', label: 'Accouplements' },
    { id: 'litters', label: 'Portées' },
  ];

  // Stats
  const activeHeats = heatsData.filter(h => h.status === 'active').length;
  const pendingMatings = matingsData.filter(m => m.success === null).length;
  const expectedLitters = littersData.filter(l => l.status === 'EXPECTED').length;
  const activeLitters = littersData.filter(l => ['BORN', 'WEANING', 'READY'].includes(l.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reproduction</h1>
          <p className="text-muted-foreground">Gérez les chaleurs, accouplements et portées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Enregistrer chaleurs
          </Button>
          <Link href="/dashboard/reproduction/litters/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle portée
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeHeats}</p>
              <p className="text-xs text-muted-foreground">Chaleurs actives</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingMatings}</p>
              <p className="text-xs text-muted-foreground">Saillies en attente</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expectedLitters}</p>
              <p className="text-xs text-muted-foreground">Portées attendues</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Baby className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeLitters}</p>
              <p className="text-xs text-muted-foreground">Portées en cours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming events */}
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Événements à venir</h3>
            </div>
            <div className="p-4 space-y-3">
              {littersData.filter(l => l.expectedDate).map(litter => (
                <div key={litter.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Mise bas - {litter.dam}</p>
                    <p className="text-sm text-muted-foreground">
                      Père: {litter.sire} • {litter.reserved} réservations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatDate(litter.expectedDate!)}</p>
                    <p className="text-xs text-muted-foreground">
                      Dans {getDaysUntil(litter.expectedDate!)} jours
                    </p>
                  </div>
                </div>
              ))}
              {heatsData.filter(h => h.status === 'active').map(heat => (
                <div key={heat.id} className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-pink-700 dark:text-pink-300">Chaleurs - {heat.dog}</p>
                    <p className="text-sm text-pink-600 dark:text-pink-400">
                      Depuis le {formatDate(heat.startDate)}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 text-xs rounded-full">
                    En cours
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent litters */}
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Portées récentes</h3>
              <Link href="/dashboard/reproduction/litters" className="text-sm text-primary hover:underline">
                Voir toutes
              </Link>
            </div>
            <div className="divide-y">
              {littersData.slice(0, 3).map(litter => (
                <Link
                  key={litter.id}
                  href={`/dashboard/reproduction/litters/${litter.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{litter.dam} × {litter.sire}</p>
                    <p className="text-sm text-muted-foreground">
                      {litter.birthDate ? formatDate(litter.birthDate) : `Prévu: ${formatDate(litter.expectedDate!)}`}
                      {litter.totalPuppies > 0 && ` • ${litter.totalPuppies} chiots`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      litter.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : litter.status === 'EXPECTED'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {litter.status === 'COMPLETED' ? 'Terminée' : litter.status === 'EXPECTED' ? 'Attendue' : 'En cours'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'heats' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {heatsData.length} enregistrements
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Enregistrer chaleurs
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Femelle</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Début</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Fin</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Durée</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Prochaines</th>
                </tr>
              </thead>
              <tbody>
                {heatsData.map(heat => {
                  const start = new Date(heat.startDate);
                  const end = heat.endDate ? new Date(heat.endDate) : new Date();
                  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                  const nextHeat = new Date(start.getTime() + 180 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <tr key={heat.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-4">
                        <Link href={`/dashboard/dogs/${heat.dogId}`} className="font-medium text-primary hover:underline">
                          {heat.dog}
                        </Link>
                      </td>
                      <td className="p-4 text-sm">{formatDate(heat.startDate)}</td>
                      <td className="p-4 text-sm">{heat.endDate ? formatDate(heat.endDate) : '-'}</td>
                      <td className="p-4 text-sm">{duration} jours</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          heat.status === 'active'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {heat.status === 'active' ? 'En cours' : 'Terminé'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        ~{formatDate(nextHeat.toISOString())}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'matings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {matingsData.length} accouplements
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Enregistrer saillie
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Mâle</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Femelle</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Résultat</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matingsData.map(mating => (
                  <tr key={mating.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 text-sm">{formatDate(mating.date)}</td>
                    <td className="p-4">
                      <span className="text-blue-600">♂</span> {mating.sire}
                    </td>
                    <td className="p-4">
                      <span className="text-pink-600">♀</span> {mating.dam}
                    </td>
                    <td className="p-4 text-sm">
                      {mating.type === 'NATURAL' ? 'Naturelle' : 'IA'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        mating.success === true
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : mating.success === false
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {mating.success === true ? 'Confirmée' : mating.success === false ? 'Échec' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-4">
                      {mating.success === null && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-green-600 h-7">
                            Confirmer
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'litters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {littersData.length} portées
            </p>
            <Link href="/dashboard/reproduction/litters/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle portée
              </Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {littersData.map(litter => (
              <Link
                key={litter.id}
                href={`/dashboard/reproduction/litters/${litter.id}`}
                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{litter.dam} × {litter.sire}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        litter.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : litter.status === 'EXPECTED'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {litter.status === 'COMPLETED' ? 'Terminée' : litter.status === 'EXPECTED' ? 'Attendue' : 'En cours'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {litter.birthDate 
                        ? `Née le ${formatDate(litter.birthDate)}`
                        : `Prévue le ${formatDate(litter.expectedDate!)}`
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    {litter.totalPuppies > 0 && (
                      <div className="text-center">
                        <p className="text-lg font-bold">{litter.totalPuppies}</p>
                        <p className="text-xs text-muted-foreground">
                          {litter.males}♂ / {litter.females}♀
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 text-xs">
                      {litter.available > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                          {litter.available} dispo
                        </span>
                      )}
                      {litter.reserved > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">
                          {litter.reserved} réservés
                        </span>
                      )}
                      {litter.sold > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                          {litter.sold} vendus
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
