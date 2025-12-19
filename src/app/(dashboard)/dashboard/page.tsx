'use client';

import Link from 'next/link';
import {
  Dog,
  Heart,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Données de démo
const stats = [
  { name: 'Chiens', value: '12', icon: Dog, change: '+2 ce mois', href: '/dashboard/dogs' },
  { name: 'Portées actives', value: '2', icon: Heart, change: '8 chiots', href: '/dashboard/reproduction' },
  { name: 'Clients', value: '45', icon: Users, change: '+5 ce mois', href: '/dashboard/clients' },
  { name: 'Revenus (mois)', value: '4 250 €', icon: DollarSign, change: '+12%', href: '/dashboard/finances' },
];

const upcomingEvents = [
  { type: 'vaccine', title: 'Vaccin rappel - Luna', date: '23 Dec 2024', urgent: true },
  { type: 'heat', title: 'Chaleurs prévues - Bella', date: '28 Dec 2024', urgent: false },
  { type: 'birth', title: 'Mise bas estimée - Maya', date: '5 Jan 2025', urgent: false },
  { type: 'checkup', title: 'Visite véto - Rex', date: '10 Jan 2025', urgent: false },
];

const recentDogs = [
  { id: '1', name: 'Luna', breed: 'Golden Retriever', age: '2 ans', sex: 'F', status: 'Reproductrice' },
  { id: '2', name: 'Rex', breed: 'Berger Allemand', age: '3 ans', sex: 'M', status: 'Reproducteur' },
  { id: '3', name: 'Bella', breed: 'Golden Retriever', age: '1 an', sex: 'F', status: 'En attente' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue, Jean ! Voici un aperçu de votre élevage.</p>
        </div>
        <Link href="/dashboard/dogs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un chien
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <div className="lg:col-span-1 bg-card border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Événements à venir
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {upcomingEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                {event.urgent && (
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                {!event.urgent && (
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link
              href="/dashboard/calendar"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Voir le calendrier
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Recent dogs */}
        <div className="lg:col-span-2 bg-card border rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Dog className="h-4 w-4" />
              Chiens récents
            </h2>
            <Link href="/dashboard/dogs">
              <Button variant="ghost" size="sm" className="gap-1">
                Voir tous
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Nom</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Race</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Âge</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Sexe</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentDogs.map((dog) => (
                  <tr key={dog.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <Link
                        href={`/dashboard/dogs/${dog.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {dog.name}
                      </Link>
                    </td>
                    <td className="p-3 text-sm">{dog.breed}</td>
                    <td className="p-3 text-sm">{dog.age}</td>
                    <td className="p-3">
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
                    <td className="p-3 text-sm text-muted-foreground">{dog.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/dogs/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau chien
            </Button>
          </Link>
          <Link href="/dashboard/reproduction/litters/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              Nouvelle portée
            </Button>
          </Link>
          <Link href="/dashboard/clients/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Nouveau client
            </Button>
          </Link>
          <Link href="/dashboard/finances/sales/new">
            <Button variant="outline" size="sm" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Nouvelle vente
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
