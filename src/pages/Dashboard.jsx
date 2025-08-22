import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Sections
import Clients from './Clients.jsx';
import Products from './Products.jsx';
import NouvelleVente from './NouvelleVentes.jsx';
import Sorties from './Sorties.jsx';
import Liste from './Listes.jsx';
import Rapport from './Rapport.jsx';
import Accueil from './Accueil.jsx';
import RetoursMobiles from './RetoursMobiles.jsx';
import RemplacementsFournisseur from './RemplacementsFournisseur.jsx';
import Recherche from './Recherche.jsx';
import Fournisseurs from './Fournisseurs.jsx';
import Factures from './Factures.jsx';
import Benefices from './Benefices.jsx';
import SpecialOrders from './SpecialOrders.jsx';
import RapportBeneficesSpeciaux from './RapportBeneficesSpeciaux.jsx';
import DettesSpeciaux from './dettesSpeciaux.jsx';
import RechercheSpeciale from './RechercheSpeciale.jsx';

import logo from '../assets/logo.png';

const sections = [
  { name: 'Accueil', icon: HomeIcon },
  { name: 'Achat', icon: ClipboardDocumentListIcon },
  { name: 'Clients', icon: UserGroupIcon },
  { name: 'Fournisseurs', icon: TruckIcon },
  { name: 'Bénéfices Spéciaux', icon: CurrencyDollarIcon },
  { name: 'Recherche Spéciale', icon: MagnifyingGlassIcon },
  { name: 'Dettes Spéciales', icon: Bars3Icon },
];

export default function Dashboard() {
  const [active, setActive] = useState(() => localStorage.getItem('activeSection') || 'Accueil');
  const [displayedName, setDisplayedName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const full = localStorage.getItem('fullName');
    const user = localStorage.getItem('username');
    if (full) setDisplayedName(full);
    else if (user) setDisplayedName(user);
    else navigate('/');

    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [navigate, isDarkMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSectionClick = (name) => {
    setActive(name);
    localStorage.setItem('activeSection', name);
    setIsMenuOpen(false);
  };

  const renderSection = () => {
    try {
      switch (active) {
        case 'Clients': return <Clients />;
        case 'Produits': return <Products />;
        case 'Vente': return <NouvelleVente />;
        case 'Sorties': return <Sorties />;
        case 'Recherche': return <Recherche />;
        case 'Factures Gros': return <Factures />;
        case 'Bénéfices': return <Benefices />;
        case 'Bénéfices Spéciaux': return <RapportBeneficesSpeciaux />;
        case 'Achat': return <SpecialOrders />;
        case 'Retour': return <RetoursMobiles />;
        case 'Fournisseurs': return <Fournisseurs />;
        case 'Rtrs Frns': return <RemplacementsFournisseur />;
        case 'Dettes': return <Liste />;
        case 'Dettes Spéciales': return <DettesSpeciaux />;
        case 'Rapport': return <Rapport />;
        case 'Recherche Spéciale': return <RechercheSpeciale />;
        case 'Accueil': default: return <Accueil />;
      }
    } catch (e) {
      console.error(`Erreur de rendu "${active}":`, e);
      return (
        <div className="p-4 sm:p-8 text-center text-red-500">
          <h3 className="text-xl font-bold mb-4">Erreur de chargement</h3>
          <p>Le composant "{active}" n'a pas pu être affiché. Regarde la console pour les détails.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {/* Header (non-sticky) */}
      <header className="w-full h-16 bg-white dark:bg-gray-800 shadow-md">
        <div className="mx-auto max-w-[1400px] h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Burger mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex sm:hidden p-2 rounded-lg text-blue-700 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700"
              aria-label="Ouvrir le menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <img src={logo} alt="Logo" className="h-8 w-8 shrink-0" />
            <h1 className="text-lg sm:text-2xl font-semibold truncate">APPLE BKO</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {displayedName && (
              <p className="hidden sm:block text-sm sm:text-base truncate max-w-[40vw]">
                Bienvenue, <span className="font-bold">{displayedName}</span> !
              </p>
            )}

            {/* Toggle thème */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-blue-700 hover:bg-blue-100 dark:text-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? 'Passer en clair' : 'Passer en sombre'}
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>

            {/* Déconnexion visible partout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:block">Se déconnecter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 
                      grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 sm:gap-6">
        {/* Sidebar — Desktop : sticky + scroll interne + bouton déconnexion */}
        <aside className="hidden lg:block">
          <nav
            className="
              sticky top-4
              bg-white dark:bg-gray-800 rounded-2xl shadow
              p-4
              max-h-[calc(100svh-2rem)]  /* garde visible dans la fenêtre */
              overflow-auto
              flex flex-col
            "
          >
            <ul className="space-y-2 flex-1">
              {sections.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <button
                    onClick={() => handleSectionClick(name)}
                    className={`flex w-full items-center gap-3 p-3 rounded-xl transition
                      ${active === name
                        ? 'bg-blue-200 text-blue-900 font-semibold shadow dark:bg-blue-800 dark:text-white'
                        : 'text-blue-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{name}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Actions persistantes en bas de la sidebar */}
            <div className="pt-3 border-t border-blue-100 dark:border-gray-700 flex items-center gap-2">
              {/* <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Se déconnecter</span>
              </button> */}
            </div>
          </nav>
        </aside>

        {/* Drawer Mobile */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white dark:bg-gray-800 z-40 p-4 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="h-8 w-8" />
                  <span className="font-semibold">Menu</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Fermer le menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <ul className="space-y-2 mb-4">
                {sections.map(({ name, icon: Icon }) => (
                  <li key={name}>
                    <button
                      onClick={() => handleSectionClick(name)}
                      className={`flex w-full items-center gap-3 p-3 rounded-xl transition
                        ${active === name
                          ? 'bg-blue-200 text-blue-900 font-semibold shadow dark:bg-blue-800 dark:text-white'
                          : 'text-blue-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="truncate">{name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </>
        )}

        {/* Contenu */}
        <main className="min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 truncate">
            {active}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-3 sm:p-5 lg:p-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
