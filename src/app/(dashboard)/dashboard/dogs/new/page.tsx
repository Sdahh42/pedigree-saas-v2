'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { BREEDS, COAT_COLORS, COAT_TYPES } from '@/lib/constants';

interface DogFormData {
  name: string;
  registeredName: string;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  birthDate: string;
  color: string;
  coatType: string;
  microchip: string;
  tattoo: string;
  registrationNumber: string;
  breedingStatus: string;
  healthStatus: string;
  weight: string;
  height: string;
  sireId: string;
  damId: string;
  titles: string;
  cotation: string;
  temperament: string;
  notes: string;
}

export default function NewDogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'identification' | 'parents' | 'health'>('general');
  
  const [formData, setFormData] = useState<DogFormData>({
    name: '',
    registeredName: '',
    breed: '',
    sex: 'MALE',
    birthDate: '',
    color: '',
    coatType: '',
    microchip: '',
    tattoo: '',
    registrationNumber: '',
    breedingStatus: 'NOT_BREEDING',
    healthStatus: 'HEALTHY',
    weight: '',
    height: '',
    sireId: '',
    damId: '',
    titles: '',
    cotation: '',
    temperament: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      router.push('/dashboard/dogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Informations générales' },
    { id: 'identification', label: 'Identification' },
    { id: 'parents', label: 'Parents' },
    { id: 'health', label: 'Santé & Notes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/dogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nouveau chien</h1>
          <p className="text-muted-foreground">Ajoutez un nouveau chien à votre élevage</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card border rounded-lg">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex gap-4 px-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
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

          {/* Error */}
          {error && (
            <div className="m-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Photo principale</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Glissez une image ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom usuel <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ex: Luna"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Registered Name */}
                <div>
                  <label htmlFor="registeredName" className="block text-sm font-medium mb-2">
                    Nom de pedigree
                  </label>
                  <input
                    id="registeredName"
                    name="registeredName"
                    type="text"
                    placeholder="Ex: Luna du Domaine des Étoiles"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.registeredName}
                    onChange={handleChange}
                  />
                </div>

                {/* Breed */}
                <div>
                  <label htmlFor="breed" className="block text-sm font-medium mb-2">
                    Race <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="breed"
                    name="breed"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.breed}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner une race</option>
                    {BREEDS.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>

                {/* Sex */}
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium mb-2">
                    Sexe <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sex"
                        value="MALE"
                        checked={formData.sex === 'MALE'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-blue-600">♂ Mâle</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sex"
                        value="FEMALE"
                        checked={formData.sex === 'FEMALE'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-pink-600">♀ Femelle</span>
                    </label>
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                    Date de naissance <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Color */}
                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-2">
                    Couleur de robe
                  </label>
                  <select
                    id="color"
                    name="color"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.color}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner une couleur</option>
                    {COAT_COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Coat Type */}
                <div>
                  <label htmlFor="coatType" className="block text-sm font-medium mb-2">
                    Type de poil
                  </label>
                  <select
                    id="coatType"
                    name="coatType"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.coatType}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner un type</option>
                    {COAT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Breeding Status */}
                <div>
                  <label htmlFor="breedingStatus" className="block text-sm font-medium mb-2">
                    Statut reproducteur
                  </label>
                  <select
                    id="breedingStatus"
                    name="breedingStatus"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.breedingStatus}
                    onChange={handleChange}
                  >
                    <option value="NOT_BREEDING">Non reproducteur</option>
                    <option value="BREEDING">Reproducteur actif</option>
                    <option value="RETIRED">Retraité</option>
                  </select>
                </div>
              </div>
            )}

            {/* Identification Tab */}
            {activeTab === 'identification' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Microchip */}
                <div>
                  <label htmlFor="microchip" className="block text-sm font-medium mb-2">
                    Numéro de puce
                  </label>
                  <input
                    id="microchip"
                    name="microchip"
                    type="text"
                    placeholder="250269XXXXXXXXX"
                    maxLength={15}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    value={formData.microchip}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">15 chiffres</p>
                </div>

                {/* Tattoo */}
                <div>
                  <label htmlFor="tattoo" className="block text-sm font-medium mb-2">
                    Numéro de tatouage
                  </label>
                  <input
                    id="tattoo"
                    name="tattoo"
                    type="text"
                    placeholder="Ex: 2ABC123"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    value={formData.tattoo}
                    onChange={handleChange}
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium mb-2">
                    Numéro LOF
                  </label>
                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    placeholder="Ex: LOF 123456/12345"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Cotation */}
                <div>
                  <label htmlFor="cotation" className="block text-sm font-medium mb-2">
                    Cotation
                  </label>
                  <select
                    id="cotation"
                    name="cotation"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.cotation}
                    onChange={handleChange}
                  >
                    <option value="">Non coté</option>
                    <option value="1">1 - Confirmé</option>
                    <option value="2">2 - Recommandé</option>
                    <option value="3">3 - Sélectionné</option>
                    <option value="4">4 - Élite A</option>
                    <option value="5">5 - Élite B</option>
                    <option value="6">6 - Élite C</option>
                  </select>
                </div>

                {/* Titles */}
                <div className="md:col-span-2">
                  <label htmlFor="titles" className="block text-sm font-medium mb-2">
                    Titres obtenus
                  </label>
                  <input
                    id="titles"
                    name="titles"
                    type="text"
                    placeholder="Ex: CH FR, RCACIB, BOB"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.titles}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Séparez les titres par des virgules</p>
                </div>

                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium mb-2">
                    Poids (kg)
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ex: 28.5"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="height" className="block text-sm font-medium mb-2">
                    Taille au garrot (cm)
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ex: 58"
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Parents Tab */}
            {activeTab === 'parents' && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les parents pour construire automatiquement le pedigree.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sire */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-blue-600 mb-3">♂ Père</h3>
                    <select
                      id="sireId"
                      name="sireId"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.sireId}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner le père</option>
                      <option value="external">+ Ajouter un chien externe</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Seuls les mâles de votre élevage sont listés
                    </p>
                  </div>

                  {/* Dam */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-pink-600 mb-3">♀ Mère</h3>
                    <select
                      id="damId"
                      name="damId"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.damId}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner la mère</option>
                      <option value="external">+ Ajouter un chien externe</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Seules les femelles de votre élevage sont listées
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">💡 Conseil</h4>
                  <p className="text-sm text-muted-foreground">
                    Si les parents ne sont pas dans votre élevage, vous pouvez les ajouter comme "chiens externes" 
                    pour construire le pedigree. Ces chiens n'apparaîtront pas dans votre liste principale.
                  </p>
                </div>
              </div>
            )}

            {/* Health & Notes Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Health Status */}
                  <div>
                    <label htmlFor="healthStatus" className="block text-sm font-medium mb-2">
                      État de santé
                    </label>
                    <select
                      id="healthStatus"
                      name="healthStatus"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.healthStatus}
                      onChange={handleChange}
                    >
                      <option value="HEALTHY">En bonne santé</option>
                      <option value="SICK">Malade</option>
                      <option value="UNKNOWN">Inconnu</option>
                    </select>
                  </div>

                  {/* Temperament */}
                  <div>
                    <label htmlFor="temperament" className="block text-sm font-medium mb-2">
                      Tempérament
                    </label>
                    <input
                      id="temperament"
                      name="temperament"
                      type="text"
                      placeholder="Ex: Calme, affectueux, joueur"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.temperament}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={5}
                    placeholder="Informations complémentaires sur ce chien..."
                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                    📋 Dossier santé complet
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Après la création du chien, vous pourrez ajouter son historique médical complet : 
                    vaccins, visites vétérinaires, tests génétiques, etc.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t p-4 flex justify-between">
            <Link href="/dashboard/dogs">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? 'Enregistrement...' : 'Enregistrer le chien'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
