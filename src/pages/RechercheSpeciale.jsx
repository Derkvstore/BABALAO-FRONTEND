import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, CubeIcon, UserIcon, PhoneIcon, BuildingStorefrontIcon, TagIcon, ClockIcon, CurrencyDollarIcon, FingerPrintIcon, ComputerDesktopIcon, ServerStackIcon } from '@heroicons/react/24/outline';

export default function RechercheSpeciale() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'commandé': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'reçu': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'vendu': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'annulé': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'remplacé': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'paiement_partiel': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setOrders([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setOrders([]);

    try {
      const response = await fetch(`${backendUrl}/api/special-orders`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des commandes spéciales.');
      }
      const data = await response.json();

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = data.filter(order =>
        [
          order.marque,
          order.modele,
          order.imei,
          order.stockage,
          order.type,
          order.type_carton,
          order.client_nom,
          order.fournisseur_nom
        ].some(field => field?.toLowerCase().includes(lowerCaseSearchTerm))
      );

      setOrders(results);

    } catch (err) {
      setError("Erreur lors de la recherche des produits: " + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <MagnifyingGlassIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-600 dark:text-gray-400 mr-2" />
        Recherche dans les Commandes Spéciales
      </h3>

      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-lg">
          {/* Icône de recherche à gauche */}
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </span>

          <input
            type="text"
            placeholder="Rechercher par IMEI, marque, modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:text-gray-100 dark:placeholder-gray-400"
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setOrders([]);
                setHasSearched(false);
                setError(null);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Effacer la recherche"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin dark:border-gray-600 dark:border-t-gray-300"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && hasSearched && orders.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Aucun produit de commande spéciale trouvé pour "{searchTerm}".
        </p>
      )}

      {!loading && !error && !hasSearched && searchTerm === '' && (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Veuillez entrer un terme de recherche pour afficher les commandes spéciales.
        </p>
      )}

      {!loading && !error && hasSearched && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <CubeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {order.marque} {order.modele}
                </h4>
              </div>

              <div className="space-y-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                <p className="flex items-center">
                    <FingerPrintIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>IMEI:</strong> {order.imei || 'N/A'}
                </p>
                <p className="flex items-center">
                    <ComputerDesktopIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>TYPE:</strong> {order.type || 'N/A'} {order.type_carton ? `(${order.type_carton})` : ''}
                </p>
                <p className="flex items-center">
                    <ServerStackIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Stockage:</strong> {order.stockage || 'N/A'}
                </p>
                <p className="flex items-center">
                    <BuildingStorefrontIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Fournisseur:</strong> {order.fournisseur_nom || 'N/A'}
                </p>
                <p className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Client:</strong> {order.client_nom || 'N/A'}
                </p>
                <p className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Contact Client: </strong> {order.client_telephone || 'N/A'}
                </p>
                <p className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Date : </strong>{' '}
                    {order.date_commande
                    ? new Date (order.date_commande).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
                <p className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <strong>Prix de Vente:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCFA(order.prix_vente_client)}</span>
                </p>
                <div className="flex items-center pt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.statut)}`}>
                        {order.statut || 'N/A'}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}