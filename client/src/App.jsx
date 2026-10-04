/**
 * ============================================================
 *  App.jsx : le chef d'orchestre de l'application
 * ============================================================
 *
 * RÔLE
 *   Ce fichier relie toutes les pièces :
 *   1. <BrowserRouter>  -> active la navigation entre les pages (URL).
 *   2. <AuthProvider>   -> rend l'utilisateur connecté (AuthContext)
 *                          accessible dans toute l'application.
 *   3. <Routes>         -> associe chaque URL à une page.
 *
 * LES ROUTES
 *   /                  -> redirige vers /login (la page d'accueil Home.jsx
 *                         est faite par la personne A : à brancher plus tard)
 *   /login             -> pages/Login.jsx
 *   /register-hopital  -> pages/RegisterHopital.jsx
 *   /dashboard         -> page PROTÉGÉE (ProtectedRoute) : réservée aux
 *                         utilisateurs connectés. Pour l'instant, c'est une
 *                         page provisoire (DashboardPlaceholder), à remplacer
 *                         par pages/DashboardHopital.jsx.
 *   * (autre URL)      -> redirige vers /login
 *
 * IMPORTANT : BrowserRouter
 *   Le <BrowserRouter> est placé ICI. Il ne doit donc PAS être aussi dans
 *   main.jsx, sinon React Router affiche une erreur (deux routeurs imbriqués).
 *
 * POUR AJOUTER UNE PAGE PROTÉGÉE
 *   <Route
 *     path="/dashboard/new"
 *     element={<ProtectedRoute><AddEditNeed /></ProtectedRoute>}
 *   />
 *
 * TRAVAIL EN BINÔME
 *   La personne A ajoutera ici ses routes publiques (/, /needs/:id, /map,
 *   /hospitals). Ce fichier sera donc modifié par vous deux : lors de la
 *   fusion des branches, gardez les routes des deux côtés.
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import
