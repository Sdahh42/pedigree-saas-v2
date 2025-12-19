'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dog,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  GitBranch,
} from 'lucide-react';

// Données de démo
const dogsData = [
  {
    id: '1',
    name: 'Luna',
    registeredName: 'Luna du Domaine des Étoiles',
    breed: 'Golden Retriever',
    birthDate: '2022-03-15',
    sex: 'F',
    color: 'Doré',
    status: 'Reproductrice',
    microchip: '250269812345678',
  },
  {
    id: '2',
    name: 'Rex',
    registeredName: 'Rex vom Königsberg',
    breed: 'Berger Allemand',
    birthDate: '2021-06-20',
    sex: 'M',
    color: 'Noir et feu',
    status: 'Reproducteur',
    microchip: '250269812345679',
  },
  {
    id: '3',
    name: 'Bella',
    registeredName: 'Bella des Jardins Fleuris',
    breed: 'Golden Retriever',
    birthDate: '2023-01-10',
    sex: 'F',
    color: 'Crème',
    status: 'En attente',
    microchip: '250269812345680',
  },
  {
    id: '4',
    name: 'Max',
    registeredName: 'Maximilian du Val d\'Or',
    breed: 'Labrador Retriever',
    birthDate: '2020-09-05',
    sex: 'M',
    color: 'Chocolat',
    status: 'Retraité',
    microchip: '250269812345681',
  },
];

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years === 0) {
    return `${months} mois`;
  }
  if (months < 0) {
    return `${years - 1} an${years - 1 > 1 ? 's' : ''}`;
  }
  return `${years} an${years > 1 ? 's' : ''}`;
}

export default function DogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSex, setFilterSex] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDogs = dogsData.filter((dog) => {
    const matchesSearch =
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.registeredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSex = filterSex === 'all' || dog.sex === filterSex;
    const matchesStatus = filterStatus === 'all' || dog.status === filterStatus;
    
    return matchesSearch && matchesSex && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes chiens</h1>
          <p className="text-muted-foreground">
            {dogsData.length} chiens • 3/10 utilisés (plan FREE)
          </p>
        </div>
        <Link href="/dashboard/dogs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un chien
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, race..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Sex filter */}
          <select
            className="px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterSex}
            onChange={(e) => setFilterSex(e.target.value)}
          >
            <option value="all">Tous les sexes</option>
            <option value="M">Mâles</option>
            <option value="F">Femelles</option>
          </select>
          
          {/* Status filter */}
          <select
            className="px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="Reproducteur">Reproducteur</option>
            <option value="Reproductrice">Reproductrice</option>
            <option value="En attente">En attente</option>
            <option value="Retraité">Retraité</option>
          </select>
        </div>
      </div>

      {/* Dogs list */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Chien</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Race</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Âge</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Sexe</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Couleur</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDogs.map((dog) => (
                <tr key={dog.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Dog className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/dogs/${dog.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {dog.name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {dog.registeredName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{dog.breed}</td>
                  <td className="p-4 text-sm">{calculateAge(dog.birthDate)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        dog.sex === 'M'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                      }`}
                    >
                      {dog.sex === 'M' ? '♂ Mâle' : '♀ Femelle'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{dog.color}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                      {dog.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/dogs/${dog.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/pedigrees?dog=${dog.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <GitBranch className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/dogs/${dog.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDogs.length === 0 && (
          <div className="p-8 text-center">
            <Dog className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 font-medium">Aucun chien trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Essayez de modifier vos filtres ou ajoutez un nouveau chien.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
