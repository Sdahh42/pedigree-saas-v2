'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Edit,
  Trash2,
  GitBranch,
  Heart,
  Stethoscope,
  Dna,
  Camera,
  Calendar,
  FileText,
  Plus,
  MoreVertical,
} from 'lucide-react';

// Données de démo pour un chien
const dogData = {
  id: '1',
  name: 'Luna',
  registeredName: 'Luna du Domaine des Étoiles',
  breed: 'Golden Retriever',
  birthDate: '2022-03-15',
  sex: 'FEMALE',
  color: 'Doré',
  coatType: 'Long',
  microchip: '250269812345678',
  tattoo: '',
  registrationNumber: 'LOF 123456/12345',
  breedingStatus: 'BREEDING',
  healthStatus: 'HEALTHY',
  presenceStatus: 'ACTIVE',
  weight: 28.5,
  height: 56,
  titles: 'CH FR, RCACIB',
  cotation: '3',
  temperament: 'Calme, affectueuse, joueuse',
  notes: 'Excellente reproductrice, très bon tempérament.',
  sire: { id: '10', name: 'Max', registeredName: 'Maximilian du Val d\'Or' },
  dam: { id: '11', name: 'Bella', registeredName: 'Bella des Jardins Fleuris' },
  photos: [
    { id: '1', url: '/placeholder-dog.jpg', isPrimary: true },
  ],
  healthRecords: [
    { id: '1', type: 'VACCINE', title: 'Vaccin CHPPIL', date: '2024-03-15', nextDue: '2025-03-15' },
    { id: '2', type: 'VACCINE', title: 'Rage', date: '2024-03-15', nextDue: '2025-03-15' },
    { id: '3', type: 'VET_VISIT', title: 'Visite annuelle', date: '2024-03-15', nextDue: null },
  ],
  geneticTests: [
    { id: '1', name: 'Dysplasie hanche', result: 'A/A', date: '2023-06-10' },
    { id: '2', name: 'Dysplasie coude', result: '0/0', date: '2023-06-10' },
    { id: '3', name: 'PRA-prcd', result: 'Clear', date: '2023-06-10' },
    { id: '4', name: 'ICT-A', result: 'Clear', date: '2023-06-10' },
  ],
  heats: [
    { id: '1', startDate: '2024-06-15', endDate: '2024-06-28', notes: '' },
    { id: '2', startDate: '2024-01-10', endDate: '2024-01-23', notes: 'Cycle normal' },
    { id: '3', startDate: '2023-07-05', endDate: '2023-07-18', notes: '' },
  ],
  litters: [
    { id: '1', birthDate: '2024-03-20', sire: 'Rex', totalPuppies: 8, males: 5, females: 3, status: 'COMPLETED' },
  ],
};

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years === 0) {
    return `${months} mois`;
  }
  return `${years} an${years > 1 ? 's' : ''} ${months > 0 ? `et ${months} mois` : ''}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DogDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'genetics' | 'reproduction' | 'pedigree'>('info');

  const tabs = [
    { id: 'info', label: 'Informations', icon: FileText },
    { id: 'health', label: 'Santé', icon: Stethoscope },
    { id: 'genetics', label: 'Génétique', icon: Dna },
    { id: 'reproduction', label: 'Reproduction', icon: Heart },
    { id: 'pedigree', label: 'Pedigree', icon: GitBranch },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Back button and photo */}
        <div className="flex items-start gap-4">
          <Link href="/dashboard/dogs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="h-24 w-24 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-4xl">🐕</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{dogData.name}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              dogData.sex === 'MALE'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
            }`}>
              {dogData.sex === 'MALE' ? '♂ Mâle' : '♀ Femelle'}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Reproductrice
            </span>
          </div>
          <p className="text-muted-foreground">{dogData.registeredName}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span>{dogData.breed}</span>
            <span>•</span>
            <span>{calculateAge(dogData.birthDate)}</span>
            <span>•</span>
            <span>{dogData.color}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/dashboard/pedigrees?dog=${dogData.id}`}>
            <Button variant="outline" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Pedigree
            </Button>
          </Link>
          <Link href={`/dashboard/dogs/${dogData.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Identification */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Identification</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Puce électronique</p>
                    <p className="font-mono">{dogData.microchip || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tatouage</p>
                    <p className="font-mono">{dogData.tattoo || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">N° LOF</p>
                    <p>{dogData.registrationNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cotation</p>
                    <p>{dogData.cotation ? `${dogData.cotation} - Sélectionné` : 'Non coté'}</p>
                  </div>
                </div>
              </div>

              {/* Physical */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Caractéristiques physiques</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Poids</p>
                    <p>{dogData.weight ? `${dogData.weight} kg` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Taille</p>
                    <p>{dogData.height ? `${dogData.height} cm` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type de poil</p>
                    <p>{dogData.coatType || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Parents */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Parents</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">♂ Père</p>
                    {dogData.sire ? (
                      <Link href={`/dashboard/dogs/${dogData.sire.id}`} className="hover:text-primary">
                        <p className="font-medium">{dogData.sire.name}</p>
                        <p className="text-sm text-muted-foreground">{dogData.sire.registeredName}</p>
                      </Link>
                    ) : (
                      <p className="text-muted-foreground">Non renseigné</p>
                    )}
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-pink-600 font-medium mb-1">♀ Mère</p>
                    {dogData.dam ? (
                      <Link href={`/dashboard/dogs/${dogData.dam.id}`} className="hover:text-primary">
                        <p className="font-medium">{dogData.dam.name}</p>
                        <p className="text-sm text-muted-foreground">{dogData.dam.registeredName}</p>
                      </Link>
                    ) : (
                      <p className="text-muted-foreground">Non renseigné</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {dogData.notes && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{dogData.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick stats */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Résumé</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portées</span>
                    <span className="font-medium">{dogData.litters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chiots nés</span>
                    <span className="font-medium">
                      {dogData.litters.reduce((acc, l) => acc + l.totalPuppies, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tests génétiques</span>
                    <span className="font-medium">{dogData.geneticTests.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titres</span>
                    <span className="font-medium">{dogData.titles ? dogData.titles.split(',').length : 0}</span>
                  </div>
                </div>
              </div>

              {/* Titles */}
              {dogData.titles && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Titres</h3>
                  <div className="flex flex-wrap gap-2">
                    {dogData.titles.split(',').map((title, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {title.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Temperament */}
              {dogData.temperament && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Tempérament</h3>
                  <p className="text-sm text-muted-foreground">{dogData.temperament}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Dossier santé</h3>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un enregistrement
              </Button>
            </div>

            {/* Upcoming */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">⚠️ Rappels à venir</h4>
              <div className="space-y-2">
                {dogData.healthRecords.filter(r => r.nextDue).map(record => (
                  <div key={record.id} className="flex justify-between items-center text-sm">
                    <span>{record.title}</span>
                    <span className="text-yellow-700 dark:text-yellow-300">{formatDate(record.nextDue!)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health records */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Prochain rappel</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dogData.healthRecords.map(record => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="p-3 text-sm">{formatDate(record.date)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          record.type === 'VACCINE' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {record.type === 'VACCINE' ? 'Vaccin' : 'Visite'}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{record.title}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {record.nextDue ? formatDate(record.nextDue) : '-'}
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Genetics Tab */}
        {activeTab === 'genetics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Tests génétiques</h3>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un test
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dogData.geneticTests.map(test => (
                <div key={test.id} className="bg-card border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{test.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      test.result === 'Clear' || test.result.includes('A') || test.result === '0/0'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : test.result === 'Carrier'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {test.result}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(test.date)}</p>
                </div>
              ))}
            </div>

            {/* COI Calculator */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Coefficient de consanguinité (COI)</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '3.2%' }} />
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">3.2%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Excellent - Faible consanguinité (calculé sur 5 générations)
              </p>
            </div>
          </div>
        )}

        {/* Reproduction Tab */}
        {activeTab === 'reproduction' && (
          <div className="space-y-6">
            {/* Heats (for females) */}
            {dogData.sex === 'FEMALE' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Historique des chaleurs</h3>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Enregistrer des chaleurs
                  </Button>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">Début</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">Fin</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">Durée</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dogData.heats.map(heat => {
                        const start = new Date(heat.startDate);
                        const end = new Date(heat.endDate);
                        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <tr key={heat.id} className="border-b last:border-0">
                            <td className="p-3 text-sm">{formatDate(heat.startDate)}</td>
                            <td className="p-3 text-sm">{formatDate(heat.endDate)}</td>
                            <td className="p-3 text-sm">{duration} jours</td>
                            <td className="p-3 text-sm text-muted-foreground">{heat.notes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    📅 Prochaines chaleurs estimées
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300">
                    Vers le {formatDate(new Date(new Date(dogData.heats[0].startDate).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString())}
                    {' '}(basé sur un cycle de 6 mois)
                  </p>
                </div>
              </div>
            )}

            {/* Litters */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Portées</h3>
                <Link href="/dashboard/reproduction/litters/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouvelle portée
                  </Button>
                </Link>
              </div>

              {dogData.litters.length > 0 ? (
                <div className="grid gap-4">
                  {dogData.litters.map(litter => (
                    <div key={litter.id} className="bg-card border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Portée du {formatDate(litter.birthDate)}</p>
                          <p className="text-sm text-muted-foreground">
                            Père: {litter.sire} • {litter.totalPuppies} chiots ({litter.males}♂ / {litter.females}♀)
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Terminée
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border rounded-lg p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune portée enregistrée</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pedigree Tab */}
        {activeTab === 'pedigree' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Arbre généalogique</h3>
              <div className="flex gap-2">
                <select className="px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="3">3 générations</option>
                  <option value="4">4 générations</option>
                  <option value="5">5 générations</option>
                </select>
                <Button variant="outline">Exporter PDF</Button>
              </div>
            </div>

            {/* Pedigree Tree */}
            <div className="bg-card border rounded-lg p-6 overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Generation 0 - Subject */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 text-center">
                    <p className="font-bold">{dogData.name}</p>
                    <p className="text-xs text-muted-foreground">{dogData.registeredName}</p>
                    <p className="text-xs mt-1">{dogData.breed}</p>
                  </div>
                </div>

                {/* Generation 1 - Parents */}
                <div className="flex justify-center gap-16 mb-8">
                  {/* Sire */}
                  <div className="text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">♂ Père</p>
                      <p className="font-medium text-sm">{dogData.sire?.name || 'Inconnu'}</p>
                      <p className="text-xs text-muted-foreground">{dogData.sire?.registeredName || ''}</p>
                    </div>
                  </div>
                  {/* Dam */}
                  <div className="text-center">
                    <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-3">
                      <p className="text-xs text-pink-600 mb-1">♀ Mère</p>
                      <p className="font-medium text-sm">{dogData.dam?.name || 'Inconnu'}</p>
                      <p className="text-xs text-muted-foreground">{dogData.dam?.registeredName || ''}</p>
                    </div>
                  </div>
                </div>

                {/* Generation 2 - Grandparents */}
                <div className="flex justify-center gap-8">
                  {/* Paternal grandparents */}
                  <div className="flex gap-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border rounded p-2 text-center w-32">
                      <p className="text-xs text-blue-600">♂ GP paternel</p>
                      <p className="text-xs font-medium">Inconnu</p>
                    </div>
                    <div className="bg-pink-50/50 dark:bg-pink-900/10 border rounded p-2 text-center w-32">
                      <p className="text-xs text-pink-600">♀ GM paternelle</p>
                      <p className="text-xs font-medium">Inconnu</p>
                    </div>
                  </div>
                  {/* Maternal grandparents */}
                  <div className="flex gap-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border rounded p-2 text-center w-32">
                      <p className="text-xs text-blue-600">♂ GP maternel</p>
                      <p className="text-xs font-medium">Inconnu</p>
                    </div>
                    <div className="bg-pink-50/50 dark:bg-pink-900/10 border rounded p-2 text-center w-32">
                      <p className="text-xs text-pink-600">♀ GM maternelle</p>
                      <p className="text-xs font-medium">Inconnu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COI Info */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Coefficient de consanguinité</h4>
                  <p className="text-sm text-muted-foreground">Calculé sur 5 générations</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">3.2%</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
