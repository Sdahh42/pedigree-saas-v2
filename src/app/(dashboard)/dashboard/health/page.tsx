'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Syringe,
  TestTube,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
} from 'lucide-react';

// Données de démo
const healthRecordsData = [
  {
    id: '1',
    dogId: '1',
    dogName: 'Luna',
    type: 'VACCINE',
    description: 'Vaccin DHPP + Rage',
    date: '2024-03-15',
    nextDueDate: '2025-03-15',
    veterinarian: 'Dr. Martin',
    clinic: 'Clinique Vétérinaire du Parc',
    cost: 85,
  },
  {
    id: '2',
    dogId: '2',
    dogName: 'Rex',
    type: 'CHECKUP',
    description: 'Visite annuelle',
    date: '2024-06-20',
    nextDueDate: null,
    veterinarian: 'Dr. Martin',
    clinic: 'Clinique Vétérinaire du Parc',
    cost: 55,
  },
  {
    id: '3',
    dogId: '1',
    dogName: 'Luna',
    type: 'TREATMENT',
    description: 'Traitement antiparasitaire',
    date: '2024-08-01',
    nextDueDate: '2024-11-01',
    veterinarian: 'Dr. Dubois',
    clinic: 'Clinique Vétérinaire du Parc',
    cost: 45,
  },
  {
    id: '4',
    dogId: '3',
    dogName: 'Bella',
    type: 'VACCINE',
    description: 'Vaccin Leptospirose',
    date: '2024-07-10',
    nextDueDate: '2025-07-10',
    veterinarian: 'Dr. Martin',
    clinic: 'Clinique Vétérinaire du Parc',
    cost: 65,
  },
];

const geneticTestsData = [
  {
    id: '1',
    dogId: '1',
    dogName: 'Luna',
    testName: 'Dysplasie de la hanche',
    testDate: '2023-06-15',
    laboratory: 'Antagene',
    result: 'A/A',
    status: 'CLEAR',
  },
  {
    id: '2',
    dogId: '1',
    dogName: 'Luna',
    testName: 'PRA-prcd',
    testDate: '2023-06-15',
    laboratory: 'Antagene',
    result: 'Clear',
    status: 'CLEAR',
  },
  {
    id: '3',
    dogId: '2',
    dogName: 'Rex',
    testName: 'Dysplasie de la hanche',
    testDate: '2022-09-20',
    laboratory: 'Antagene',
    result: 'A/B',
    status: 'CARRIER',
  },
  {
    id: '4',
    dogId: '2',
    dogName: 'Rex',
    testName: 'ICT-A',
    testDate: '2022-09-20',
    laboratory: 'Antagene',
    result: 'Clear',
    status: 'CLEAR',
  },
  {
    id: '5',
    dogId: '3',
    dogName: 'Bella',
    testName: 'PRA-prcd',
    testDate: '2024-01-10',
    laboratory: 'Laboklin',
    result: 'Carrier',
    status: 'CARRIER',
  },
];

const upcomingReminders = [
  { id: '1', dogName: 'Luna', type: 'Vaccin DHPP', dueDate: '2025-03-15', daysUntil: 180 },
  { id: '2', dogName: 'Luna', type: 'Antiparasitaire', dueDate: '2024-11-01', daysUntil: 45 },
  { id: '3', dogName: 'Bella', type: 'Vaccin Leptospirose', dueDate: '2025-07-10', daysUntil: 300 },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    VACCINE: 'Vaccin',
    CHECKUP: 'Visite',
    TREATMENT: 'Traitement',
    SURGERY: 'Chirurgie',
    OTHER: 'Autre',
  };
  return labels[type] || type;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'CLEAR':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'CARRIER':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'AFFECTED':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
}

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState<'records' | 'genetics' | 'reminders'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRecords = healthRecordsData.filter(record => {
    const matchesSearch = record.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const tabs = [
    { id: 'records', label: 'Dossiers médicaux', icon: FileText, count: healthRecordsData.length },
    { id: 'genetics', label: 'Tests génétiques', icon: TestTube, count: geneticTestsData.length },
    { id: 'reminders', label: 'Rappels', icon: Calendar, count: upcomingReminders.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Santé</h1>
          <p className="text-muted-foreground">
            Gérez les dossiers médicaux et tests génétiques
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <TestTube className="h-4 w-4" />
            Nouveau test
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un dossier
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{healthRecordsData.length}</p>
              <p className="text-xs text-muted-foreground">Dossiers médicaux</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Syringe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {healthRecordsData.filter(r => r.type === 'VACCINE').length}
              </p>
              <p className="text-xs text-muted-foreground">Vaccins</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TestTube className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{geneticTestsData.length}</p>
              <p className="text-xs text-muted-foreground">Tests génétiques</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingReminders.length}</p>
              <p className="text-xs text-muted-foreground">Rappels à venir</p>
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
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Records Tab */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un dossier..."
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
              <option value="VACCINE">Vaccins</option>
              <option value="CHECKUP">Visites</option>
              <option value="TREATMENT">Traitements</option>
              <option value="SURGERY">Chirurgies</option>
            </select>
          </div>

          {/* Records list */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Chien</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Vétérinaire</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Prochain RDV</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Coût</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 text-sm">{formatDate(record.date)}</td>
                    <td className="p-4">
                      <Link href={`/dashboard/dogs/${record.dogId}`} className="font-medium text-primary hover:underline">
                        {record.dogName}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        record.type === 'VACCINE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        record.type === 'CHECKUP' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {getTypeLabel(record.type)}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{record.description}</td>
                    <td className="p-4 text-sm text-muted-foreground">{record.veterinarian}</td>
                    <td className="p-4 text-sm">
                      {record.nextDueDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(record.nextDueDate)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-right font-medium">{record.cost}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Genetics Tab */}
      {activeTab === 'genetics' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {geneticTestsData.length} tests génétiques enregistrés
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un test
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Chien</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Test</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Laboratoire</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Résultat</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {geneticTestsData.map(test => (
                  <tr key={test.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <Link href={`/dashboard/dogs/${test.dogId}`} className="font-medium text-primary hover:underline">
                        {test.dogName}
                      </Link>
                    </td>
                    <td className="p-4 text-sm font-medium">{test.testName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(test.testDate)}</td>
                    <td className="p-4 text-sm">{test.laboratory}</td>
                    <td className="p-4 text-sm font-medium">{test.result}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status === 'CLEAR' && <CheckCircle className="h-3 w-3" />}
                        {test.status === 'CARRIER' && <AlertTriangle className="h-3 w-3" />}
                        {test.status === 'CLEAR' ? 'Sain' : test.status === 'CARRIER' ? 'Porteur' : 'Atteint'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {upcomingReminders.length} rappels à venir
            </p>
          </div>

          <div className="grid gap-4">
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    reminder.daysUntil < 30 
                      ? 'bg-red-100 dark:bg-red-900/30' 
                      : reminder.daysUntil < 90 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      reminder.daysUntil < 30 
                        ? 'text-red-600' 
                        : reminder.daysUntil < 90 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{reminder.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.dogName} • {formatDate(reminder.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reminder.daysUntil < 30 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : reminder.daysUntil < 90 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    Dans {reminder.daysUntil} jours
                  </span>
                  <Button variant="outline" size="sm">
                    Marquer comme fait
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
