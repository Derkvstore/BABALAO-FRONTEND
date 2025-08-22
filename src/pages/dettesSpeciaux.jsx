import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserIcon,
  PhoneIcon,
  TagIcon,
  CubeIcon,
  ClockIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

export default function DettesSpeciaux() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchSpecialOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/api/special-orders`);
      const filteredOrders = response.data.filter(order =>
        order.statut === 'en_attente' || order.statut === 'paiement_partiel'
      );
      setOrders(filteredOrders);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Impossible de charger la liste des dettes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialOrders();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen font-sans printable-section dark:bg-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
          LISTE DE DETTES ({formattedDate})
        </h2>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <PrinterIcon className="h-5 w-5 mr-2" />
          Imprimer
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Chargement des dettes...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucune dette de commande spéciale en cours.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Client & Contact</th>
                <th className="px-4 py-3 text-left">Produit</th>
                <th className="px-4 py-3 text-right">Prix Total</th>
                <th className="px-4 py-3 text-right">Montant Payé</th>
                <th className="px-4 py-3 text-right">Montant Restant</th>
                <th className="px-4 py-3 text-left">Date de sortie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" /> {order.client_nom}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                      <PhoneIcon className="h-3 w-3 mr-1" /> {order.client_telephone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <TagIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" /> {order.marque} {order.modele}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                      <CubeIcon className="h-3 w-3 mr-1" /> {order.stockage || 'N/A'} ({order.type}{order.type_carton ? ` ${order.type_carton}` : ''})
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-blue-700 dark:text-blue-400">{formatCFA(order.prix_vente_client)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap text-gray-700 dark:text-gray-300">{formatCFA(order.montant_paye)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-red-600 dark:text-red-400">{formatCFA(order.montant_restant)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" /> {formatDate(order.date_commande)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}