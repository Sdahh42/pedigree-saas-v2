'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Données de démo
const clientsData = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
    city: 'Paris',
    country: 'FR',
    clientType: 'BUYER',
    createdAt: '2024-01-15',
    purchases: 1,
    waitingList: false,
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.com',
    phone: '06 98 76 54 32',
    city: 'Lyon',
    country: 'FR',
    clientType: 'BUYER',
    createdAt: '2024-03-20',
    purchases: 0,
    waitingList: true,
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@email.com',
    phone: '06 11 22 33 44',
    city: 'Marseille',
    country: 'FR',
    clientType: 'BREEDER',
    createdAt: '2023-11-05',
    purchases: 2,
    waitingList: false,
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Petit',
    email: 'sophie.petit@email.com',
    phone: '06 55 66 77 88',
    city: 'Bordeaux',
    country: 'FR',
    clientType: 'BUYER',
    createdAt: '2024-06-10',
    purchases: 0,
    waitingList: true,
  },
];

const waitingListData = [
  {
    id: '1',
    client: 'Marie Martin',
    clientId: '2',
    litter: 'Luna × Rex',
    litterId: '2',
    preferredSex: 'FEMALE',
    preferredColor: 'Doré',
    position: 1,
    depositPaid: true,
    depositAmount: 500,
    status: 'WAITING',
    createdAt: '2024-06-15',
  },
  {
    id: '2',
    client: 'Sophie Petit',
    clientId: '4',
    litter: 'Luna × Rex',
    litterId: '2',
    preferredSex: 'MALE',
    preferredColor: null,
    position: 2,
    depositPaid: true,
    depositAmount: 500,
    status: 'WAITING',
    createdAt: '2024-06-20',
  },
  {
    id: '3',
    client: 'Lucas Moreau',
    clientId: '5',
    litter: 'Luna × Rex',
    litterId: '2',
    preferredSex: 'NO_PREFERENCE',
    preferredColor: null,
    position: 3,
    depositPaid: false,
    depositAmount: null,
    status: 'WAITING',
    createdAt: '2024-07-01',
  },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<'clients' | 'waiting'>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredClients = clientsData.filter(client => {
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || client.clientType === filterType;
    
    return matchesSearch && matchesType;
  });

  const tabs = [
    { id: 'clients', label: 'Clients', count: clientsData.length },
    { id: 'waiting', label: 'Liste d\'attente', count: waitingListData.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            {clientsData.length} clients • {waitingListData.length} en liste d'attente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Ajouter à la liste
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientsData.length}</p>
              <p className="text-xs text-muted-foreground">Total clients</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {clientsData.filter(c => c.purchases > 0).length}
              </p>
              <p className="text-xs text-muted-foreground">Acheteurs</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waitingListData.length}</p>
              <p className="text-xs text-muted-foreground">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {clientsData.filter(c => c.clientType === 'BREEDER').length}
              </p>
              <p className="text-xs text-muted-foreground">Éleveurs</p>
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
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="BUYER">Acheteurs</option>
              <option value="BREEDER">Éleveurs</option>
            </select>
          </div>

          {/* Clients list */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Ville</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Achats</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {client.firstName[0]}{client.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.firstName} {client.lastName}</p>
                          <p className="text-xs text-muted-foreground">
                            Client depuis {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <a href={`mailto:${client.email}`} className="hover:text-primary">
                            {client.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <a href={`tel:${client.phone}`} className="hover:text-primary">
                            {client.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {client.city}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        client.clientType === 'BREEDER'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {client.clientType === 'BREEDER' ? 'Éleveur' : 'Acheteur'}
                      </span>
                      {client.waitingList && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {client.purchases > 0 ? (
                        <span className="text-green-600 font-medium">{client.purchases} chiot(s)</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClients.length === 0 && (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 font-medium">Aucun client trouvé</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Essayez de modifier vos filtres ou ajoutez un nouveau client.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Waiting List Tab */}
      {activeTab === 'waiting' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {waitingListData.length} personnes en liste d'attente
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une réservation
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Portée</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Préférences</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Acompte</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingListData.map(entry => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold">
                        {entry.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/dashboard/clients/${entry.clientId}`} className="font-medium text-primary hover:underline">
                        {entry.client}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Inscrit le {formatDate(entry.createdAt)}
                      </p>
                    </td>
                    <td className="p-4">
                      <Link href={`/dashboard/reproduction/litters/${entry.litterId}`} className="hover:text-primary">
                        {entry.litter}
                      </Link>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="space-y-1">
                        <p>
                          {entry.preferredSex === 'MALE' ? '♂ Mâle' : 
                           entry.preferredSex === 'FEMALE' ? '♀ Femelle' : 
                           'Pas de préférence'}
                        </p>
                        {entry.preferredColor && (
                          <p className="text-muted-foreground">{entry.preferredColor}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {entry.depositPaid ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {entry.depositAmount}€
                        </span>
                      ) : (
                        <span className="text-yellow-600">En attente</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        entry.status === 'WAITING'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : entry.status === 'MATCHED'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {entry.status === 'WAITING' ? 'En attente' : 
                         entry.status === 'MATCHED' ? 'Attribué' : 'Terminé'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8">
                          Attribuer
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
