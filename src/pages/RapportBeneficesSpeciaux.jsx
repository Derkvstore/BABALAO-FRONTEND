import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartBarIcon, ClockIcon, CurrencyDollarIcon, MagnifyingGlassIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function RapportBeneficesSpeciaux() {
  const [dailySoldData, setDailySoldData] = useState({});
  const [totalSoldBenefice, setTotalSoldBenefice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const backendUrl = import.meta.env.PROD
    ? 'https://babalo-backend-production.up.railway.app'
    : 'http://localhost:3001';

  const formatCFA = (amount) => {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount))) {
      return 'N/A FCFA';
    }
    const formattedAmount = parseFloat(amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return formattedAmount.replace(/,/g, ' ') + ' FCFA';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('fr-FR', options);
    } catch (e) {
      console.error("Date formatting error:", e, "Original string:", dateString);
      return 'N/A';
    }
  };

  const fetchSoldSpecialOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/api/special-orders`);
      const soldOrders = response.data.filter(order => order.statut === 'vendu');

      const dailyData = {};
      let totalBenefice = 0;

      const filteredOrders = soldOrders.filter(order => {
        // Filtrage par terme de recherche
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          (order.client_nom && order.client_nom.toLowerCase().includes(searchLower)) ||
          (order.fournisseur_nom && order.fournisseur_nom.toLowerCase().includes(searchLower)) ||
          (order.marque && order.marque.toLowerCase().includes(searchLower)) ||
          (order.modele && order.modele.toLowerCase().includes(searchLower));

        // Filtrage par date
        const saleDate = order.date_statut_change ? new Date(order.date_statut_change) : null;
        if (!saleDate) return false;

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesDate = 
          (!start || saleDate >= start) && 
          (!end || saleDate <= new Date(end.setDate(end.getDate() + 1)));

        return matchesSearch && matchesDate;
      });

      filteredOrders.forEach(order => {
        const saleDateString = new Date(order.date_statut_change).toISOString().split('T')[0];
        const prixVente = parseFloat(order.prix_vente_client) || 0;
        const prixAchat = parseFloat(order.prix_achat_fournisseur) || 0;
        const benefice = prixVente - prixAchat;

        totalBenefice += benefice;
        if (!dailyData[saleDateString]) {
          dailyData[saleDateString] = {
            totalBenefice: 0,
            produits: []
          };
        }

        dailyData[saleDateString].totalBenefice += benefice;
        dailyData[saleDateString].produits.push({
          marque: order.marque,
          modele: order.modele,
          benefice: benefice
        });
      });

      setDailySoldData(dailyData);
      setTotalSoldBenefice(totalBenefice);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes vendues:', err);
      setError('Impossible de charger les données de bénéfice journalier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldSpecialOrders();
  }, [searchTerm, startDate, endDate]);

  if (loading) {
    return <p className="text-center text-gray-600 dark:text-gray-400">Chargement des bénéfices...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen font-sans dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Rapport des Bénéfices sur Commandes Spéciales</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par client, fournisseur, marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <div className="relative w-1/2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              title="Date de début"
            />
            <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative w-1/2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              title="Date de fin"
            />
            <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 sm:p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-300 rounded-lg shadow-md text-center mb-6">
        <p className="text-sm sm:text-lg md:text-xl font-semibold">Bénéfice Total des Commandes Spéciales Vendues :</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-1">{formatCFA(totalSoldBenefice)}</p>
      </div>
      
      {Object.entries(dailySoldData).length > 0 ? (
        <div className="grid gap-6">
          {Object.entries(dailySoldData).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)).map(([date, data]) => (
            <div key={date} className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <p className="text-md sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                  <ClockIcon className="h-5 w-5 inline mr-2 text-gray-500 dark:text-gray-400" />
                  Bénéfice du {formatDate(date)} :
                </p>
                <p className="text-lg sm:text-2xl font-extrabold text-green-600 dark:text-green-400">
                  {formatCFA(data.totalBenefice)}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Détail des ventes :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {data.produits.map((produit, index) => (
                    <li key={index}>
                      <span className="font-medium">{produit.marque} {produit.modele}</span> - Bénéfice: <span className="text-green-500 dark:text-green-400">{formatCFA(produit.benefice)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucune vente de commande spéciale enregistrée pour le moment.</p>
      )}
    </div>
  );
}