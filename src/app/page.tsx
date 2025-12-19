/**
 * Page d'accueil (Landing Page)
 * Page marketing publique présentant l'application
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dog,
  GitBranch,
  Heart,
  Dna,
  Users,
  BarChart3,
  Shield,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Dog className="h-6 w-6 text-primary" />
            <span>PedigreeApp</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
                🎉 Nouveau : Prédiction des couleurs de robe
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
                Gérez votre élevage canin{' '}
                <span className="text-primary">comme un pro</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                L'application complète pour les éleveurs : pedigrees, génétique, 
                reproduction, clients et finances. Tout en un seul endroit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Démarrer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Découvrir les fonctionnalités
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground">
                ✓ Gratuit jusqu'à 10 chiens • ✓ Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils puissants conçus spécifiquement pour les éleveurs professionnels
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Dog className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestion des chiens</h3>
                <p className="text-muted-foreground">
                  Fiches complètes avec photos, santé, génétique et historique. 
                  Tout est centralisé et accessible en un clic.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pedigrees interactifs</h3>
                <p className="text-muted-foreground">
                  Visualisez et exportez des pedigrees jusqu'à 10 générations. 
                  Export PDF professionnel inclus.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Dna className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Génétique avancée</h3>
                <p className="text-muted-foreground">
                  Calcul du COI, prédiction des couleurs, gestion des tests génétiques. 
                  Import Embark et Wisdom Panel.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Suivi reproduction</h3>
                <p className="text-muted-foreground">
                  Chaleurs, accouplements, portées. Planifiez et suivez chaque étape 
                  de la reproduction.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestion clients</h3>
                <p className="text-muted-foreground">
                  Base de données clients, liste d'attente, historique des ventes. 
                  Fidélisez vos acheteurs.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Statistiques & finances</h3>
                <p className="text-muted-foreground">
                  Suivez vos revenus, dépenses et rentabilité. Tableaux de bord 
                  et rapports détaillés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tarifs simples et transparents
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Commencez gratuitement, évoluez selon vos besoins
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card rounded-lg p-8 border">
                <h3 className="text-xl font-semibold mb-2">Gratuit</h3>
                <p className="text-muted-foreground mb-4">Pour débuter</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">0€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>10 chiens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>3 portées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Pedigrees 3 générations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Export PDF</span>
                  </li>
                </ul>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-card rounded-lg p-8 border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Populaire
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-4">Pour les éleveurs actifs</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">9,99€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>100 chiens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>50 portées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Pedigrees 5 générations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Calcul COI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Prédiction couleurs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Export Excel</span>
                  </li>
                </ul>
                <Link href="/register?plan=pro" className="block">
                  <Button className="w-full">
                    Choisir Pro
                  </Button>
                </Link>
              </div>
              
              {/* Elite Plan */}
              <div className="bg-card rounded-lg p-8 border">
                <h3 className="text-xl font-semibold mb-2">Elite</h3>
                <p className="text-muted-foreground mb-4">Pour les professionnels</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">19,99€</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Chiens illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Portées illimitées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Pedigrees 10 générations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Import Embark/Wisdom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Multi-élevages (5)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/register?plan=elite" className="block">
                  <Button variant="outline" className="w-full">
                    Choisir Elite
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Données sécurisées</h3>
                <p className="text-muted-foreground">
                  Vos données sont chiffrées et sauvegardées quotidiennement. 
                  Conforme RGPD.
                </p>
              </div>
              <div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rapide et fiable</h3>
                <p className="text-muted-foreground">
                  Application optimisée pour une utilisation fluide, 
                  même avec des milliers de chiens.
                </p>
              </div>
              <div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Support réactif</h3>
                <p className="text-muted-foreground">
                  Une équipe dédiée pour vous accompagner. 
                  Réponse sous 24h garantie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-primary rounded-2xl p-8 md:p-16 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à professionnaliser votre élevage ?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Rejoignez des centaines d'éleveurs qui font confiance à PedigreeApp 
                pour gérer leur activité au quotidien.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Créer mon compte gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
                <Dog className="h-5 w-5 text-primary" />
                <span>PedigreeApp</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                L'application de gestion d'élevage canin pour les professionnels.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Fonctionnalités</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Tarifs</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Centre d'aide</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Statut</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">CGU</Link></li>
                <li><Link href="/legal" className="hover:text-foreground">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PedigreeApp. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
