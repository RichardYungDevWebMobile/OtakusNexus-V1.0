// lib/api/endpoints.js
/**
 * Définition de tous les endpoints API
 * Centralise les URLs et les configurations des endpoints
 */

import { environmentConfig } from '../config/environment';

const API_BASE = environmentConfig.getApiUrl();

/**
 * Endpoints d'authentification
 */
export const authEndpoints = {
  // Inscription
  signUp: `${API_BASE}/auth/signup`,
  
  // Connexion
  signIn: `${API_BASE}/auth/signin`,
  
  // Connexion avec Google
  signInWithGoogle: `${API_BASE}/auth/google`,
  
  // Connexion avec Apple
  signInWithApple: `${API_BASE}/auth/apple`,
  
  // Rafraîchissement du token
  refreshToken: `${API_BASE}/auth/refresh`,
  
  // Déconnexion
  signOut: `${API_BASE}/auth/signout`,
  
  // Vérification d'email
  verifyEmail: `${API_BASE}/auth/verify-email`,
  
  // Réinitialisation de mot de passe
  resetPassword: `${API_BASE}/auth/reset-password`,
  
  // Vérification de session
  checkSession: `${API_BASE}/auth/session`,
};

/**
 * Endpoints utilisateur
 */
export const userEndpoints = {
  // Profil utilisateur
  getProfile: (userId) => `${API_BASE}/users/${userId}`,
  
  // Mettre à jour le profil
  updateProfile: (userId) => `${API_BASE}/users/${userId}`,
  
  // Supprimer le compte
  deleteAccount: (userId) => `${API_BASE}/users/${userId}`,
  
  // Changer d'avatar
  updateAvatar: (userId) => `${API_BASE}/users/${userId}/avatar`,
  
  // Statistiques utilisateur
  getUserStats: (userId) => `${API_BASE}/users/${userId}/stats`,
  
  // Préférences utilisateur
  getUserPreferences: (userId) => `${API_BASE}/users/${userId}/preferences`,
  
  // Mettre à jour les préférences
  updatePreferences: (userId) => `${API_BASE}/users/${userId}/preferences`,
  
  // Liste d'amis
  getFriends: (userId) => `${API_BASE}/users/${userId}/friends`,
  
  // Ajouter un ami
  addFriend: (userId) => `${API_BASE}/users/${userId}/friends`,
  
  // Rechercher des utilisateurs
  searchUsers: `${API_BASE}/users/search`,
};

/**
 * Endpoints de messagerie
 */
export const messagingEndpoints = {
  // Obtenir les conversations
  getConversations: `${API_BASE}/messages/conversations`,
  
  // Obtenir les messages d'une conversation
  getMessages: (chatId) => `${API_BASE}/messages/conversations/${chatId}/messages`,
  
  // Envoyer un message
  sendMessage: `${API_BASE}/messages/send`,
  
  // Marquer comme lu
  markAsRead: (chatId) => `${API_BASE}/messages/conversations/${chatId}/read`,
  
  // Supprimer une conversation
  deleteConversation: (chatId) => `${API_BASE}/messages/conversations/${chatId}`,
  
  // Ajouter une réaction
  addReaction: `${API_BASE}/messages/reactions`,
  
  // Télécharger un média
  uploadMedia: `${API_BASE}/messages/upload`,
  
  // Obtenir les messages non lus
  getUnreadCount: `${API_BASE}/messages/unread`,
  
  // Rechercher dans les messages
  searchMessages: `${API_BASE}/messages/search`,
};

/**
 * Endpoints de communautés
 */
export const communityEndpoints = {
  // Liste des communautés
  getCommunities: `${API_BASE}/communities`,
  
  // Détails d'une communauté
  getCommunity: (communityId) => `${API_BASE}/communities/${communityId}`,
  
  // Créer une communauté
  createCommunity: `${API_BASE}/communities`,
  
  // Mettre à jour une communauté
  updateCommunity: (communityId) => `${API_BASE}/communities/${communityId}`,
  
  // Rejoindre une communauté
  joinCommunity: (communityId) => `${API_BASE}/communities/${communityId}/join`,
  
  // Quitter une communauté
  leaveCommunity: (communityId) => `${API_BASE}/communities/${communityId}/leave`,
  
  // Membres d'une communauté
  getCommunityMembers: (communityId) => `${API_BASE}/communities/${communityId}/members`,
  
  // Messages de la communauté
  getCommunityMessages: (communityId) => `${API_BASE}/communities/${communityId}/messages`,
  
  // Événements de la communauté
  getCommunityEvents: (communityId) => `${API_BASE}/communities/${communityId}/events`,
  
  // Créer un événement
  createEvent: (communityId) => `${API_BASE}/communities/${communityId}/events`,
  
  // Modération
  moderateCommunity: (communityId) => `${API_BASE}/communities/${communityId}/moderate`,
  
  // Rechercher des communautés
  searchCommunities: `${API_BASE}/communities/search`,
};

/**
 * Endpoints IA
 */
export const aiEndpoints = {
  // Chat avec l'IA
  chat: `${API_BASE}/ai/chat`,
  
  // Génération d'images
  generateImage: `${API_BASE}/ai/generate-image`,
  
  // Génération de code
  generateCode: `${API_BASE}/ai/generate-code`,
  
  // Obtenir l'historique IA
  getHistory: `${API_BASE}/ai/history`,
  
  // Supprimer une conversation IA
  deleteChat: (chatId) => `${API_BASE}/ai/chats/${chatId}`,
  
  // Obtenir les quotas
  getQuotas: `${API_BASE}/ai/quotas`,
  
  // Acheter des crédits IA
  purchaseCredits: `${API_BASE}/ai/purchase-credits`,
  
  // Statistiques d'utilisation IA
  getUsageStats: `${API_BASE}/ai/usage-stats`,
};

/**
 * Endpoints Waifu Battle
 */
export const waifuEndpoints = {
  // Obtenir le duel du jour
  getDailyBattle: `${API_BASE}/waifu/daily-battle`,
  
  // Voter
  vote: `${API_BASE}/waifu/vote`,
  
  // Classement
  getLeaderboard: `${API_BASE}/waifu/leaderboard`,
  
  // Statistiques utilisateur
  getUserStats: (userId) => `${API_BASE}/waifu/users/${userId}/stats`,
  
  // Saison actuelle
  getCurrentSeason: `${API_BASE}/waifu/seasons/current`,
  
  // Classement de la saison
  getSeasonLeaderboard: (seasonId) => `${API_BASE}/waifu/seasons/${seasonId}/leaderboard`,
  
  // Récompenses de saison
  getSeasonRewards: (seasonId) => `${API_BASE}/waifu/seasons/${seasonId}/rewards`,
  
  // Historique des saisons
  getSeasonHistory: `${API_BASE}/waifu/seasons/history`,
  
  // Personnages populaires
  getPopularCharacters: `${API_BASE}/waifu/characters/popular`,
};

/**
 * Endpoints de contenu
 */
export const contentEndpoints = {
  // Anime tendances
  getTrendingAnime: `${API_BASE}/content/anime/trending`,
  
  // Détails d'un anime
  getAnimeDetails: (animeId) => `${API_BASE}/content/anime/${animeId}`,
  
  // Rechercher des anime
  searchAnime: `${API_BASE}/content/anime/search`,
  
  // Calendrier des sorties
  getReleaseSchedule: `${API_BASE}/content/schedule`,
  
  // Nouveautés
  getNewReleases: `${API_BASE}/content/new-releases`,
  
  // Recommendations
  getRecommendations: (userId) => `${API_BASE}/content/recommendations/${userId}`,
  
  // Suivre un anime
  followAnime: (animeId) => `${API_BASE}/content/anime/${animeId}/follow`,
  
  // Liste de suivi
  getWatchlist: (userId) => `${API_BASE}/content/users/${userId}/watchlist`,
};

/**
 * Endpoints de monétisation
 */
export const monetizationEndpoints = {
  // Plans d'abonnement
  getSubscriptionPlans: `${API_BASE}/monetization/plans`,
  
  // Créer une session d'achat
  createPurchaseSession: `${API_BASE}/monetization/create-session`,
  
  // Vérifier un achat
  verifyPurchase: `${API_BASE}/monetization/verify`,
  
  // Historique des achats
  getPurchaseHistory: (userId) => `${API_BASE}/monetization/users/${userId}/history`,
  
  // Annuler un abonnement
  cancelSubscription: (subscriptionId) => `${API_BASE}/monetization/subscriptions/${subscriptionId}/cancel`,
  
  // Informations d'abonnement
  getSubscriptionInfo: (userId) => `${API_BASE}/monetization/users/${userId}/subscription`,
  
  // Acheter des crédits
  purchaseCredits: `${API_BASE}/monetization/purchase-credits`,
  
  // Obtenir le solde de crédits
  getCreditsBalance: (userId) => `${API_BASE}/monetization/users/${userId}/credits`,
};

/**
 * Endpoints d'analytics
 */
export const analyticsEndpoints = {
  // Envoyer des événements
  sendEvents: `${API_BASE}/analytics/events`,
  
  // Statistiques utilisateur
  getUserAnalytics: (userId) => `${API_BASE}/analytics/users/${userId}`,
  
  // Métriques d'engagement
  getEngagementMetrics: `${API_BASE}/analytics/engagement`,
  
  // Rapports d'erreurs
  reportError: `${API_BASE}/analytics/errors`,
  
  // Feedback utilisateur
  submitFeedback: `${API_BASE}/analytics/feedback`,
};

/**
 * Endpoints système
 */
export const systemEndpoints = {
  // Vérifier la santé du serveur
  healthCheck: `${API_BASE}/health`,
  
  // Informations de version
  getVersionInfo: `${API_BASE}/version`,
  
  // Maintenance
  getMaintenanceStatus: `${API_BASE}/maintenance`,
  
  // Configuration de l'app
  getAppConfig: `${API_BASE}/config`,
  
  // Mises à jour
  checkForUpdates: `${API_BASE}/updates`,
};

/**
 * Helper pour construire les URLs avec query params
 */
export const buildUrl = (baseUrl, params = {}) => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}`;
};

/**
 * Exporter tous les endpoints
 */
export const endpoints = {
  auth: authEndpoints,
  user: userEndpoints,
  messaging: messagingEndpoints,
  community: communityEndpoints,
  ai: aiEndpoints,
  waifu: waifuEndpoints,
  content: contentEndpoints,
  monetization: monetizationEndpoints,
  analytics: analyticsEndpoints,
  system: systemEndpoints,
  
  // Helper function
  buildUrl,
};
