# 📋 User Stories - PedigreeApp SaaS v2

## Vue d'ensemble

Ce document détaille toutes les user stories organisées par module fonctionnel.
Chaque story suit le format: **En tant que [rôle], je veux [action] afin de [bénéfice]**

---

## 🔐 Module Authentification & Compte

### US-AUTH-001: Inscription
**En tant que** visiteur,  
**Je veux** créer un compte avec mon email et mot de passe,  
**Afin de** pouvoir utiliser l'application.

**Critères d'acceptation:**
- [ ] Formulaire avec email, mot de passe, confirmation mot de passe
- [ ] Validation email unique
- [ ] Mot de passe min 8 caractères, 1 majuscule, 1 chiffre
- [ ] Email de confirmation envoyé
- [ ] Redirection vers onboarding après confirmation

### US-AUTH-002: Connexion
**En tant que** utilisateur enregistré,  
**Je veux** me connecter avec mes identifiants,  
**Afin d'** accéder à mon espace personnel.

**Critères d'acceptation:**
- [ ] Formulaire email/mot de passe
- [ ] Option "Se souvenir de moi"
- [ ] Message d'erreur générique (sécurité)
- [ ] Redirection vers dashboard après connexion
- [ ] Rate limiting (5 tentatives/15min)

### US-AUTH-003: Mot de passe oublié
**En tant que** utilisateur,  
**Je veux** réinitialiser mon mot de passe,  
**Afin de** récupérer l'accès à mon compte.

**Critères d'acceptation:**
- [ ] Formulaire avec email
- [ ] Email avec lien de réinitialisation (valide 1h)
- [ ] Page de nouveau mot de passe
- [ ] Confirmation de changement

### US-AUTH-004: Profil utilisateur
**En tant que** utilisateur connecté,  
**Je veux** modifier mes informations personnelles,  
**Afin de** maintenir mon profil à jour.

**Critères d'acceptation:**
- [ ] Modification nom, email, téléphone
- [ ] Changement de mot de passe
- [ ] Upload photo de profil
- [ ] Suppression de compte (avec confirmation)

---

## 🏠 Module Élevage (Kennel)

### US-KEN-001: Configuration élevage
**En tant que** éleveur,  
**Je veux** configurer les informations de mon élevage,  
**Afin de** les afficher sur mes documents.

**Critères d'acceptation:**
- [ ] Nom de l'élevage
- [ ] Affixe
- [ ] Adresse complète
- [ ] Téléphone, email, site web
- [ ] Logo de l'élevage
- [ ] Numéro SIRET (optionnel)

### US-KEN-002: Multi-élevages (ELITE)
**En tant que** utilisateur ELITE,  
**Je veux** gérer plusieurs élevages,  
**Afin de** séparer mes différentes activités.

**Critères d'acceptation:**
- [ ] Création jusqu'à 5 élevages
- [ ] Switch rapide entre élevages
- [ ] Données isolées par élevage
- [ ] Statistiques par élevage

---

## 🐕 Module Chiens

### US-DOG-001: Liste des chiens
**En tant que** éleveur,  
**Je veux** voir la liste de tous mes chiens,  
**Afin d'** avoir une vue d'ensemble de mon effectif.

**Critères d'acceptation:**
- [ ] Vue grille et vue liste
- [ ] Filtres: race, sexe, statut reproduction, statut présence
- [ ] Recherche par nom, puce, LOF
- [ ] Tri par nom, date de naissance, race
- [ ] Pagination (20 par page)
- [ ] Indicateur de limite selon plan

### US-DOG-002: Fiche chien
**En tant que** éleveur,  
**Je veux** créer/modifier une fiche chien complète,  
**Afin de** documenter toutes les informations importantes.

**Critères d'acceptation:**
- [ ] Informations de base: nom, nom LOF, race, sexe, date naissance
- [ ] Identification: puce, tatouage, numéro LOF
- [ ] Apparence: couleur, robe, poids, taille
- [ ] Statuts: reproduction, santé, présence
- [ ] Parents: sélection père/mère depuis la base
- [ ] Photos: multiple avec photo principale
- [ ] Notes libres

### US-DOG-003: Détail chien
**En tant que** éleveur,  
**Je veux** voir le détail complet d'un chien,  
**Afin de** consulter toutes ses informations.

**Critères d'acceptation:**
- [ ] Toutes les informations de la fiche
- [ ] Galerie photos
- [ ] Historique santé
- [ ] Tests génétiques
- [ ] Portées (si reproducteur)
- [ ] Pedigree rapide (3 générations)
- [ ] Actions: modifier, supprimer, générer pedigree

### US-DOG-004: Import chiens
**En tant que** éleveur,  
**Je veux** importer des chiens depuis un fichier,  
**Afin de** migrer mes données existantes.

**Critères d'acceptation:**
- [ ] Import CSV/Excel
- [ ] Mapping des colonnes
- [ ] Validation des données
- [ ] Rapport d'import (succès/erreurs)

---

## 🍼 Module Portées

### US-LIT-001: Liste des portées
**En tant que** éleveur,  
**Je veux** voir toutes mes portées,  
**Afin de** suivre ma production.

**Critères d'acceptation:**
- [ ] Liste avec père, mère, date naissance, nombre chiots
- [ ] Filtres: statut, année
- [ ] Statuts: attendue, née, sevrage, prête, terminée

### US-LIT-002: Créer une portée
**En tant que** éleveur,  
**Je veux** enregistrer une nouvelle portée,  
**Afin de** documenter une naissance.

**Critères d'acceptation:**
- [ ] Sélection père et mère
- [ ] Date de naissance (ou date prévue)
- [ ] Nombre de chiots: total, mâles, femelles, mort-nés
- [ ] Lien avec un accouplement (optionnel)
- [ ] Notes

### US-LIT-003: Suivi des chiots
**En tant que** éleveur,  
**Je veux** suivre chaque chiot d'une portée,  
**Afin de** documenter leur développement.

**Critères d'acceptation:**
- [ ] Création automatique des fiches chiots
- [ ] Suivi du poids
- [ ] Attribution couleur/sexe
- [ ] Statut: disponible, réservé, vendu
- [ ] Lien avec réservation/vente

---

## 💕 Module Reproduction

### US-REP-001: Suivi des chaleurs
**En tant que** éleveur,  
**Je veux** enregistrer les chaleurs de mes femelles,  
**Afin de** planifier les accouplements.

**Critères d'acceptation:**
- [ ] Date de début et fin
- [ ] Calcul automatique du prochain cycle (6 mois)
- [ ] Alertes de rappel
- [ ] Historique par femelle

### US-REP-002: Planification accouplement
**En tant que** éleveur,  
**Je veux** planifier et enregistrer les accouplements,  
**Afin de** suivre la reproduction.

**Critères d'acceptation:**
- [ ] Sélection mâle et femelle
- [ ] Date d'accouplement
- [ ] Type: naturel, IA frais, IA réfrigéré, IA congelé
- [ ] Résultat: en attente, confirmé, échec
- [ ] Calcul date mise bas prévue (63 jours)

### US-REP-003: Simulation COI (PRO+)
**En tant que** éleveur PRO/ELITE,  
**Je veux** simuler le COI d'un accouplement,  
**Afin d'** évaluer la consanguinité potentielle.

**Critères d'acceptation:**
- [ ] Sélection père et mère potentiels
- [ ] Calcul COI sur 5 générations (PRO) ou 10 (ELITE)
- [ ] Affichage pourcentage et interprétation
- [ ] Liste des ancêtres communs
- [ ] Recommandation (vert/orange/rouge)

---

## 🏥 Module Santé

### US-HEA-001: Carnet de santé
**En tant que** éleveur,  
**Je veux** gérer le carnet de santé de chaque chien,  
**Afin de** suivre leur historique médical.

**Critères d'acceptation:**
- [ ] Types: vaccin, visite véto, test, chirurgie, médicament, blessure
- [ ] Date, titre, description
- [ ] Vétérinaire, coût
- [ ] Date de rappel (vaccins)
- [ ] Pièce jointe (ordonnance, certificat)

### US-HEA-002: Rappels vaccins
**En tant que** éleveur,  
**Je veux** recevoir des rappels pour les vaccins,  
**Afin de** ne pas oublier les échéances.

**Critères d'acceptation:**
- [ ] Notification dans l'app
- [ ] Email de rappel (optionnel)
- [ ] Vue calendrier des échéances
- [ ] Dashboard: vaccins à venir (30 jours)

---

## 🧬 Module Génétique

### US-GEN-001: Tests génétiques
**En tant que** éleveur,  
**Je veux** enregistrer les tests génétiques,  
**Afin de** documenter le statut génétique de mes chiens.

**Critères d'acceptation:**
- [ ] Nom du test, date, résultat
- [ ] Résultats: clear, carrier, affected, pending
- [ ] Laboratoire, numéro certificat
- [ ] Pièce jointe (certificat)

### US-GEN-002: Prédiction couleurs (PRO+)
**En tant que** éleveur PRO/ELITE,  
**Je veux** prédire les couleurs d'une portée,  
**Afin de** informer mes clients.

**Critères d'acceptation:**
- [ ] Sélection père et mère
- [ ] Saisie des génotypes connus
- [ ] Calcul des probabilités par couleur
- [ ] Affichage visuel (carré de Punnett)
- [ ] Alertes santé (ex: double merle)

### US-GEN-003: Import Embark/Wisdom (ELITE)
**En tant que** utilisateur ELITE,  
**Je veux** importer les résultats Embark/Wisdom Panel,  
**Afin d'** automatiser la saisie des tests.

**Critères d'acceptation:**
- [ ] Import fichier PDF ou CSV
- [ ] Parsing automatique des résultats
- [ ] Mapping vers les tests de la base
- [ ] Validation avant import

---

## 📜 Module Pedigrees

### US-PED-001: Visualisation pedigree
**En tant que** éleveur,  
**Je veux** visualiser le pedigree d'un chien,  
**Afin de** voir son arbre généalogique.

**Critères d'acceptation:**
- [ ] Arbre visuel interactif
- [ ] Nombre de générations selon plan (3/5/10)
- [ ] Affichage: nom, photo, couleur, titres
- [ ] Clic pour voir détail d'un ancêtre
- [ ] Indicateur COI

### US-PED-002: Export PDF pedigree
**En tant que** éleveur,  
**Je veux** exporter un pedigree en PDF,  
**Afin de** le fournir à mes clients.

**Critères d'acceptation:**
- [ ] Format A4 portrait ou paysage
- [ ] Options: photos, santé, COI, titres, couleurs
- [ ] En-tête avec logo élevage
- [ ] Génération côté serveur
- [ ] Téléchargement immédiat

---

## 👥 Module Clients

### US-CLI-001: Gestion clients
**En tant que** éleveur,  
**Je veux** gérer ma base de clients,  
**Afin de** suivre mes contacts.

**Critères d'acceptation:**
- [ ] Création: nom, prénom, email, téléphone, adresse
- [ ] Type: acheteur, éleveur, les deux
- [ ] Historique des achats
- [ ] Notes

### US-CLI-002: Liste d'attente
**En tant que** éleveur,  
**Je veux** gérer une liste d'attente,  
**Afin de** prioriser les réservations.

**Critères d'acceptation:**
- [ ] Ajout client avec préférences (sexe, couleur)
- [ ] Position dans la file
- [ ] Statut: en attente, matché, complété, annulé
- [ ] Acompte versé (oui/non, montant)

---

## 💰 Module Ventes & Finances

### US-FIN-001: Enregistrer une vente
**En tant que** éleveur,  
**Je veux** enregistrer la vente d'un chiot,  
**Afin de** suivre mes revenus.

**Critères d'acceptation:**
- [ ] Sélection chien et client
- [ ] Prix, date, mode de paiement
- [ ] Contrat signé (oui/non)
- [ ] Pièce jointe (contrat)
- [ ] Mise à jour automatique statut chien

### US-FIN-002: Suivi des dépenses
**En tant que** éleveur,  
**Je veux** enregistrer mes dépenses,  
**Afin de** calculer ma rentabilité.

**Critères d'acceptation:**
- [ ] Catégories: alimentation, vétérinaire, reproduction, équipement, assurance, expos, transport, autre
- [ ] Montant, date, description
- [ ] Lien optionnel avec chien ou portée
- [ ] Pièce jointe (facture)

### US-FIN-003: Tableau de bord financier
**En tant que** éleveur,  
**Je veux** voir mes statistiques financières,  
**Afin d'** analyser mon activité.

**Critères d'acceptation:**
- [ ] Revenus du mois/année
- [ ] Dépenses du mois/année
- [ ] Profit net
- [ ] Graphique évolution mensuelle
- [ ] Répartition des dépenses par catégorie

---

## 📊 Module Analytics

### US-ANA-001: Dashboard principal
**En tant que** éleveur,  
**Je veux** voir un tableau de bord synthétique,  
**Afin d'** avoir une vue d'ensemble rapide.

**Critères d'acceptation:**
- [ ] Compteurs: chiens, portées, clients
- [ ] Revenus du mois
- [ ] Prochaines échéances (vaccins, naissances)
- [ ] Activité récente
- [ ] Actions rapides

### US-ANA-002: Statistiques élevage
**En tant que** éleveur,  
**Je veux** voir des statistiques détaillées,  
**Afin d'** analyser mes performances.

**Critères d'acceptation:**
- [ ] Nombre de portées par an
- [ ] Taille moyenne des portées
- [ ] Ratio mâles/femelles
- [ ] Taux de réussite des accouplements
- [ ] Évolution du cheptel

---

## 💳 Module Abonnement

### US-SUB-001: Voir mon plan
**En tant que** utilisateur,  
**Je veux** voir mon plan actuel et ses limites,  
**Afin de** savoir ce qui est inclus.

**Critères d'acceptation:**
- [ ] Plan actuel (FREE/PRO/ELITE)
- [ ] Limites et utilisation actuelle
- [ ] Date de renouvellement
- [ ] Historique des factures

### US-SUB-002: Upgrade plan
**En tant que** utilisateur FREE/PRO,  
**Je veux** passer à un plan supérieur,  
**Afin d'** accéder à plus de fonctionnalités.

**Critères d'acceptation:**
- [ ] Comparaison des plans
- [ ] Choix mensuel/annuel
- [ ] Paiement sécurisé (Stripe)
- [ ] Activation immédiate
- [ ] Email de confirmation

### US-SUB-003: Gérer abonnement
**En tant que** utilisateur payant,  
**Je veux** gérer mon abonnement,  
**Afin de** modifier ou annuler.

**Critères d'acceptation:**
- [ ] Changer de plan
- [ ] Mettre à jour carte bancaire
- [ ] Annuler (avec confirmation)
- [ ] Télécharger factures

---

## ⚙️ Module Paramètres

### US-SET-001: Préférences application
**En tant que** utilisateur,  
**Je veux** personnaliser l'application,  
**Afin de** l'adapter à mes besoins.

**Critères d'acceptation:**
- [ ] Thème: clair/sombre/système
- [ ] Langue (FR par défaut)
- [ ] Format de date
- [ ] Devise par défaut
- [ ] Notifications email (on/off)

### US-SET-002: Export données
**En tant que** utilisateur,  
**Je veux** exporter toutes mes données,  
**Afin de** les sauvegarder ou migrer.

**Critères d'acceptation:**
- [ ] Export complet en JSON
- [ ] Export par module (chiens, clients, etc.)
- [ ] Export Excel/CSV
- [ ] Conformité RGPD

---

## 🌐 Module Public (Marketing)

### US-PUB-001: Landing page
**En tant que** visiteur,  
**Je veux** comprendre ce qu'offre PedigreeApp,  
**Afin de** décider si je m'inscris.

**Critères d'acceptation:**
- [ ] Présentation des fonctionnalités
- [ ] Témoignages clients
- [ ] Comparaison des plans
- [ ] CTA inscription
- [ ] FAQ

### US-PUB-002: Page tarifs
**En tant que** visiteur,  
**Je veux** voir les tarifs détaillés,  
**Afin de** choisir mon plan.

**Critères d'acceptation:**
- [ ] Tableau comparatif des plans
- [ ] Prix mensuel et annuel
- [ ] Fonctionnalités par plan
- [ ] FAQ tarification

---

## Priorités d'implémentation

### Phase 1 - MVP (Semaines 1-2)
1. Authentification (AUTH-001 à AUTH-003)
2. Chiens (DOG-001 à DOG-003)
3. Dashboard basique (ANA-001)
4. Paramètres élevage (KEN-001)

### Phase 2 - Core Features (Semaines 3-4)
5. Portées (LIT-001 à LIT-003)
6. Santé (HEA-001, HEA-002)
7. Clients (CLI-001, CLI-002)
8. Pedigrees (PED-001, PED-002)

### Phase 3 - Business (Semaines 5-6)
9. Ventes (FIN-001 à FIN-003)
10. Reproduction (REP-001, REP-002)
11. Abonnement Stripe (SUB-001 à SUB-003)

### Phase 4 - Premium Features (Semaines 7-8)
12. Génétique avancée (GEN-001 à GEN-003)
13. COI Calculator (REP-003)
14. Analytics avancés (ANA-002)
15. Multi-élevages (KEN-002)
