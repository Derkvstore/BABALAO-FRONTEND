import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon as ClockSolidIcon // Icône pour le statut "en_attente"
} from '@heroicons/react/24/outline';
import { CloudOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Accueil() {
  const [dashboardStats, setDashboardStats] = useState({
    total_en_attente: 0,
    total_commandé: 0,
    total_reçu: 0,
    total_vendu: 0,
    total_annulé: 0,
    total_remplacé: 0,
    total_paiement_partiel: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quotes = [
  " APPLE BKO – L’iPhone authentique, la qualité garantie !",

"Chez APPLE BKO, chaque iPhone est 100% original !",

" APPLE BKO – L’excellence dans votre main !",

"Obtenez votre iPhone de rêve chez APPLE BKO !",

" APPLE BKO – Votre destination iPhone au Mali !",

" Professionnels & particuliers, APPLE BKO a l’iPhone qu’il vous faut !",

" APPLE BKO – Zéro contrefaçon, que du vrai !",

" APPLE BKO – La performance Apple à portée de main !",

" APPLE BKO – Des photos sublimes, des souvenirs uniques !",

" APPLE BKO – Qualité, authenticité, satisfaction !",

" APPLE BKO – Parce que vous méritez le meilleur !",

" L’iPhone original ? C’est seulement chez APPLE BKO !",

" APPLE BKO – Des iPhones qui font tourner les têtes !",

" Livraison rapide & iPhones authentiques chez APPLE BKO !",

" APPLE BKO – La passion Apple, sans compromis !"
  ];

  const navigate = useNavigate();

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('fr-FR', options);
  };

  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    setIsNetworkError(false);
    try {
      const backendUrl = import.meta.env.PROD
        ? 'https://babalo-backend-production.up.railway.app'
        : 'http://localhost:3001';

      const response = await fetch(`${backendUrl}/api/special-orders-stats`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de la récupération des statistiques du tableau de bord.');
      }
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques du tableau de bord:', error);
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        setIsNetworkError(true);
      } else {
        setStatsError(`Erreur: ${error.message}`);
      }
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000);
    return () => {
      clearInterval(timerId);
      clearInterval(quoteInterval);
    };
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 md:px-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Utilisation de AnimatePresence pour une transition fluide des citations */}
      <AnimatePresence mode="wait">
        <motion.h3
          key={currentQuoteIndex}
          className="text-lg sm:text-2xl font-semibold text-blue-800 text-center mb-6 sm:mb-8 dark:text-blue-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {quotes[currentQuoteIndex]}
        </motion.h3>
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nous sommes le</p>
              <p className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200">{getFormattedDate()}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Heure Actuelle</p>
              <p className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200">{formatTime(currentTime)}</p>
            </div>
          </div>
        </div>

        {isNetworkError ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-red-50 dark:bg-red-950 rounded-xl shadow-lg mt-6 sm:mt-8">
            <CloudOff className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4 animate-pulse-once" />
            <p className="text-base sm:text-xl font-semibold text-red-700 text-center dark:text-red-300">
              Impossible de se connecter au serveur.
            </p>
            <p className="text-sm sm:text-base text-gray-600 text-center mt-2 dark:text-gray-400">
              Vérifiez votre connexion Internet et réessayez.
            </p>
          </div>
        ) : statsLoading ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 mt-6 sm:mt-8">
            <div className="flex justify-center text-blue-500 mb-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-4 border-t-4 border-blue-200 animate-spin dark:border-blue-700 dark:border-t-blue-400"></div>
            </div>
            <p className="text-gray-600 text-center dark:text-gray-400">Chargement des statistiques...</p>
          </div>
        ) : statsError ? (
          <p className="text-red-600 text-center dark:text-red-400">{statsError}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
             <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ShoppingCartIcon className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-300">{dashboardStats.total_vendu}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Vendues</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ClockSolidIcon className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-yellow-800 dark:text-yellow-300">{dashboardStats.total_en_attente}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">En Attente</p>
            </motion.div>

            {/* <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TruckIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-300">{dashboardStats.total_commandé}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Commandées</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CubeIcon className="h-10 w-10 sm:h-12 sm:w-12 text-purple-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-purple-300">{dashboardStats.total_reçu}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Reçues</p>
            </motion.div> */}

           

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <XCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-red-800 dark:text-red-300">{dashboardStats.total_annulé}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Annulées</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <CurrencyDollarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-orange-800 dark:text-orange-300">{dashboardStats.total_paiement_partiel}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Paiements partiels</p>
            </motion.div>

             <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <ArrowsRightLeftIcon className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-500 mb-2 sm:mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-indigo-800 dark:text-indigo-300">{dashboardStats.total_remplacé}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 dark:text-gray-400">Remplacées</p>
            </motion.div>

          </div>
        )}
      </motion.div>
    </div>
  );
}