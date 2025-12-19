'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Filter,
} from 'lucide-react';

// Données de démo
const salesData = [
  { id: '1', type: 'SALE', description: 'Vente chiot - Luna × Rex #1', amount: 2500, date: '2024-08-25', client: 'Jean Dupont', status: 'PAID' },
  { id: '2', type: 'SALE', description: 'Vente chiot - Luna × Rex #2', amount: 2500, date: '2024-08-28', client: 'Pierre Bernard', status: 'PAID' },
  { id: '3', type: 'DEPOSIT', description: 'Acompte réservation - Bella × Max', amount: 500, date: '2024-06-15', client: 'Marie Martin', status: 'PAID' },
  { id: '4', type: 'SALE', description: 'Vente chiot - Luna × Rex #3', amount: 2500, date: '2024-09-01', client: 'Sophie Petit', status: 'PENDING' },
];

const expensesData = [
  { id: '1', category: 'VETERINARY', description: 'Vaccins portée Luna', amount: 450, date: '2024-08-20' },
  { id: '2', category: 'FOOD', description: 'Croquettes premium (50kg)', amount: 180, date: '2024-08-15' },
  { id: '3', category: 'VETERINARY', description: 'Échographie gestation Bella', amount: 120, date: '2024-07-10' },
  { id: '4', category: 'EQUIPMENT', description: 'Parc à chiots', amount: 350, date: '2024-07-01' },
  { id: '5', category: 'REGISTRATION', description: 'Inscription LOF portée', amount: 200, date: '2024-09-05' },
  { id: '6', category: 'FOOD', description: 'Lait maternisé', amount: 85, date: '2024-08-22' },
];

const monthlyStats = [
  { month: 'Jan', income: 0, expenses: 450 },
  { month: 'Fév', income: 0, expenses: 380 },
  { month: 'Mar', income: 2500, expenses: 520 },
  { month: 'Avr', income: 0, expenses: 290 },
  { month: 'Mai', income: 0, expenses: 410 },
  { month: 'Juin', income: 500, expenses: 350 },
  { month: 'Juil', income: 0, expenses: 470 },
  { month: 'Août', income: 5000, expenses: 715 },
  { month: 'Sep', income: 2500, expenses: 200 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses'>('overview');
  const [period, setPeriod] = useState<string>('year');

  const totalIncome = salesData.filter(s => s.status === 'PAID').reduce((acc, s) => acc + s.amount, 0);
  const totalExpenses = expensesData.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingIncome = salesData.filter(s => s.status === 'PENDING').reduce((acc, s) => acc + s.amount, 0);

  const expensesByCategory = expensesData.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    VETERINARY: 'Vétérinaire',
    FOOD: 'Alimentation',
    EQUIPMENT: 'Équipement',
    REGISTRATION: 'Inscriptions',
    OTHER: 'Autres',
  };

  const categoryColors: Record<string, string> = {
    VETERINARY: 'bg-red-500',
    FOOD: 'bg-yellow-500',
    EQUIPMENT: 'bg-blue-500',
    REGISTRATION: 'bg-purple-500',
    OTHER: 'bg-gray-500',
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'income', label: 'Revenus' },
    { id: 'expenses', label: 'Dépenses' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-muted-foreground">Suivez vos revenus et dépenses</p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-md bg-background text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="all">Tout</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Revenus</span>
            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            +{formatCurrency(pendingIncome)} en attente
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Dépenses</span>
            <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {expensesData.length} transactions
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Bénéfice net</span>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              netProfit >= 0 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Marge: {totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0}%
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Ventes</span>
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{salesData.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {salesData.filter(s => s.status === 'PAID').length} payées
          </p>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Évolution mensuelle</h3>
            <div className="h-64 flex items-end gap-2">
              {monthlyStats.map((stat, i) => {
                const maxValue = Math.max(...monthlyStats.map(s => Math.max(s.income, s.expenses)));
                const incomeHeight = maxValue > 0 ? (stat.income / maxValue) * 100 : 0;
                const expenseHeight = maxValue > 0 ? (stat.expenses / maxValue) * 100 : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 h-48 items-end">
                      <div
                        className="flex-1 bg-green-500 rounded-t"
                        style={{ height: `${incomeHeight}%` }}
                        title={`Revenus: ${formatCurrency(stat.income)}`}
                      />
                      <div
                        className="flex-1 bg-red-400 rounded-t"
                        style={{ height: `${expenseHeight}%` }}
                        title={`Dépenses: ${formatCurrency(stat.expenses)}`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Revenus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-400" />
                <span className="text-sm text-muted-foreground">Dépenses</span>
              </div>
            </div>
          </div>

          {/* Expenses by category */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Dépenses par catégorie</h3>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = Math.round((amount / totalExpenses) * 100);
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{categoryLabels[category] || category}</span>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${categoryColors[category] || 'bg-gray-500'} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{percentage}%</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {salesData.length} transactions • {formatCurrency(totalIncome + pendingIncome)} total
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un revenu
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Statut</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Montant</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map(sale => (
                  <tr key={sale.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 text-sm">{formatDate(sale.date)}</td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{sale.description}</p>
                    </td>
                    <td className="p-4 text-sm">{sale.client}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        sale.type === 'SALE'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {sale.type === 'SALE' ? 'Vente' : 'Acompte'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        sale.status === 'PAID'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {sale.status === 'PAID' ? 'Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-medium text-green-600 flex items-center justify-end gap-1">
                        <ArrowUpRight className="h-4 w-4" />
                        {formatCurrency(sale.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {expensesData.length} dépenses • {formatCurrency(totalExpenses)} total
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une dépense
            </Button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">Catégorie</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">Montant</th>
                </tr>
              </thead>
              <tbody>
                {expensesData.map(expense => (
                  <tr key={expense.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4 text-sm">{formatDate(expense.date)}</td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{expense.description}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-muted`}>
                        <span className={`h-2 w-2 rounded-full ${categoryColors[expense.category]}`} />
                        {categoryLabels[expense.category] || expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-medium text-red-600 flex items-center justify-end gap-1">
                        <ArrowDownRight className="h-4 w-4" />
                        {formatCurrency(expense.amount)}
                      </span>
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
