'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';

// Données de démo
const userData = {
  name: 'Jean Dupont',
  email: 'jean.dupont@email.com',
  phone: '06 12 34 56 78',
  avatar: null,
};

const kennelData = {
  name: 'Élevage du Val d\'Or',
  affixe: 'du Val d\'Or',
  siret: '12345678901234',
  address: '123 Rue des Chiens',
  city: 'Paris',
  postalCode: '75001',
  country: 'France',
  phone: '01 23 45 67 89',
  email: 'contact@valdor-elevage.fr',
  website: 'https://valdor-elevage.fr',
  description: 'Élevage familial de Golden Retrievers depuis 2010.',
  breeds: ['Golden Retriever'],
};

const subscriptionData = {
  plan: 'PRO',
  status: 'ACTIVE',
  currentPeriodEnd: '2025-01-15',
  dogsLimit: 50,
  dogsUsed: 12,
  features: [
    'Jusqu\'à 50 chiens',
    'Gestion illimitée des portées',
    'Calcul COI avancé',
    'Export PDF personnalisé',
    'Support prioritaire',
  ],
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'kennel' | 'subscription' | 'notifications' | 'security'>('profile');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'kennel', label: 'Élevage', icon: Building2 },
    { id: 'subscription', label: 'Abonnement', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et votre élevage</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Informations personnelles</h2>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Changer la photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    <input
                      type="text"
                      defaultValue={userData.name}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue={userData.phone}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? (
                      <>Enregistrement...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Kennel Tab */}
          {activeTab === 'kennel' && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Informations de l'élevage</h2>
              
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom de l'élevage</label>
                    <input
                      type="text"
                      defaultValue={kennelData.name}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Affixe</label>
                    <input
                      type="text"
                      defaultValue={kennelData.affixe}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SIRET</label>
                    <input
                      type="text"
                      defaultValue={kennelData.siret}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue={kennelData.phone}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input
                    type="text"
                    defaultValue={kennelData.address}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Code postal</label>
                    <input
                      type="text"
                      defaultValue={kennelData.postalCode}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ville</label>
                    <input
                      type="text"
                      defaultValue={kennelData.city}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pays</label>
                    <input
                      type="text"
                      defaultValue={kennelData.country}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email de contact</label>
                    <input
                      type="email"
                      defaultValue={kennelData.email}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site web</label>
                    <input
                      type="url"
                      defaultValue={kennelData.website}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    defaultValue={kennelData.description}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? (
                      <>Enregistrement...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current plan */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">Votre abonnement</h2>
                    <p className="text-sm text-muted-foreground">
                      Gérez votre plan et votre facturation
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                    Actif
                  </span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Plan {subscriptionData.plan}</h3>
                    <p className="text-sm text-muted-foreground">
                      Renouvellement le {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button variant="outline">Gérer</Button>
                </div>

                {/* Usage */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Utilisation des chiens</span>
                    <span className="font-medium">
                      {subscriptionData.dogsUsed} / {subscriptionData.dogsLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(subscriptionData.dogsUsed / subscriptionData.dogsLimit) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3">Fonctionnalités incluses</h4>
                  <ul className="space-y-2">
                    {subscriptionData.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plans */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Changer de plan</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Free */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">Gratuit</h4>
                    <p className="text-2xl font-bold mt-2">0€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>5 chiens max</li>
                      <li>Fonctions de base</li>
                    </ul>
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Plan actuel
                    </Button>
                  </div>

                  {/* Pro */}
                  <div className="border-2 border-primary rounded-lg p-4 relative">
                    <span className="absolute -top-3 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                      Populaire
                    </span>
                    <h4 className="font-medium">Pro</h4>
                    <p className="text-2xl font-bold mt-2">19€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>50 chiens max</li>
                      <li>Toutes les fonctions</li>
                      <li>Support prioritaire</li>
                    </ul>
                    <Button className="w-full mt-4">
                      <Check className="h-4 w-4 mr-2" />
                      Plan actuel
                    </Button>
                  </div>

                  {/* Enterprise */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">Entreprise</h4>
                    <p className="text-2xl font-bold mt-2">49€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>Chiens illimités</li>
                      <li>Multi-utilisateurs</li>
                      <li>API access</li>
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      Passer à ce plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Préférences de notifications</h2>
              
              <div className="space-y-6">
                {[
                  { id: 'email_heats', label: 'Rappels de chaleurs', description: 'Recevoir un email avant les chaleurs prévues', enabled: true },
                  { id: 'email_vaccines', label: 'Rappels de vaccins', description: 'Recevoir un email avant les rappels de vaccins', enabled: true },
                  { id: 'email_litters', label: 'Mises à jour des portées', description: 'Notifications sur les portées en cours', enabled: false },
                  { id: 'email_clients', label: 'Nouveaux clients', description: 'Notification lors d\'une nouvelle inscription', enabled: true },
                  { id: 'email_marketing', label: 'Actualités et conseils', description: 'Recevoir notre newsletter mensuelle', enabled: false },
                ].map(notification => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{notification.label}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notification.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? (
                      <>Enregistrement...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">Changer le mot de passe</h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button className="gap-2">
                    <Shield className="h-4 w-4" />
                    Mettre à jour
                  </Button>
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Sessions actives</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Chrome sur Windows</p>
                        <p className="text-sm text-muted-foreground">Paris, France • Session actuelle</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded">
                      Actif
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="mt-4 text-destructive">
                  Déconnecter toutes les autres sessions
                </Button>
              </div>

              {/* Danger zone */}
              <div className="bg-card border border-destructive/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-destructive mb-2">Zone de danger</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces actions sont irréversibles. Procédez avec prudence.
                </p>
                
                <div className="flex gap-4">
                  <Button variant="outline" className="text-destructive border-destructive/50">
                    Exporter mes données
                  </Button>
                  <Button variant="destructive">
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
