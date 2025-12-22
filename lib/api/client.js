// lib/api/client.js
/**
 * Client API centralisé avec intercepteurs et gestion d'erreurs
 */

import axios from 'axios';
import * as Network from 'expo-network';
import { environmentConfig } from '../config/environment';
import { localStore } from '../storage/local-storage';
import { useAuth } from '../auth/use-auth';

// Configuration de base
const API_CONFIG = {
  baseURL: environmentConfig.getApiUrl(),
  timeout: environmentConfig.get('api.timeout'),
  headers: environmentConfig.getApiHeaders(),
};

// Instance Axios
const apiClient = axios.create(API_CONFIG);

// Queue pour les requêtes hors ligne
const requestQueue = [];
let isOnline = true;

/**
 * Vérifier la connectivité réseau
 */
const checkNetworkStatus = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    isOnline = networkState.isConnected && networkState.isInternetReachable;
    return isOnline;
  } catch (error) {
    console.error('Network check error:', error);
    return false;
  }
};

/**
 * Enregistrer une requête pour traitement ultérieur
 */
const queueRequest = (config) => {
  requestQueue.push({
    ...config,
    timestamp: Date.now(),
    retryCount: 0,
  });
  
  // Limiter la taille de la queue
  if (requestQueue.length > 100) {
    requestQueue.shift();
  }
  
  // Sauvegarder la queue localement
  localStore.set('api_request_queue', requestQueue);
  
  return Promise.reject(new Error('Request queued for offline processing'));
};

/**
 * Traiter la queue des requêtes
 */
const processQueue = async () => {
  if (requestQueue.length === 0 || !isOnline) return;
  
  const successfulRequests = [];
  
  for (let i = 0; requestQueue.length; i++) {
    const queuedRequest = requestQueue[i];
    
    if (queuedRequest.retryCount >= 3) {
      // Trop de tentatives, supprimer
      requestQueue.splice(i, 1);
      i--;
      continue;
    }
    
    try {
      // Rejouer la requête
      const response = await apiClient.request(queuedRequest);
      
      // Notifier les écouteurs du succès
      apiClient.emitter?.emit('queuedRequestSuccess', {
        request: queuedRequest,
        response,
      });
      
      successfulRequests.push(i);
      queuedRequest.retryCount++;
      
    } catch (error) {
      console.error('Failed to process queued request:', error);
      queuedRequest.retryCount++;
    }
  }
  
  // Supprimer les requêtes réussies
  successfulRequests.reverse().forEach(index => {
    requestQueue.splice(index, 1);
  });
  
  // Sauvegarder la queue mise à jour
  localStore.set('api_request_queue', requestQueue);
};

/**
 * Intercepteur de requêtes
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Vérifier la connectivité
    const isConnected = await checkNetworkStatus();
    
    if (!isConnected) {
      return queueRequest(config);
    }
    
    // Ajouter le token d'authentification
    const token = await localStore.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter des métadonnées de requête
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Request-Timestamp'] = Date.now();
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log de succès en développement
    if (environmentConfig.isDevelopment) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    // Émettre un événement pour les analytics
    apiClient.emitter?.emit('apiRequestSuccess', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      duration: Date.now() - parseInt(response.config.headers['X-Request-Timestamp'] || '0'),
    });
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log d'erreur
    console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // Émettre un événement d'erreur
    apiClient.emitter?.emit('apiRequestError', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      error: error.message,
    });
    
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        const refreshToken = await localStore.get('refresh_token');
        
        if (refreshToken) {
          const refreshResponse = await apiClient.post('/auth/refresh', {
            refreshToken,
          });
          
          if (refreshResponse.data.success) {
            // Sauvegarder le nouveau token
            await localStore.set('auth_token', refreshResponse.data.token);
            
            // Mettre à jour le header et réessayer
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Déconnecter l'utilisateur
        apiClient.emitter?.emit('authenticationFailed');
      }
    }
    
    // Gestion des erreurs 429 (trop de requêtes)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }
    
    // Gestion des erreurs réseau
    if (!error.response) {
      const isConnected = await checkNetworkStatus();
      
      if (!isConnected) {
        return queueRequest(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Méthodes API helpers
 */
const api = {
  // GET
  get: async (url, config = {}) => {
    return apiClient.get(url, config);
  },
  
  // POST
  post: async (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  
  // PUT
  put: async (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  
  // DELETE
  delete: async (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  
  // PATCH
  patch: async (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },
  
  // Upload de fichier
  upload: async (url, file, config = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
  
  // Téléchargement de fichier
  download: async (url, config = {}) => {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
  
  // Requêtes batch
  batch: async (requests) => {
    const batchPromises = requests.map(({ method, url, data, config }) => {
      switch (method.toLowerCase()) {
        case 'get':
          return apiClient.get(url, config);
        case 'post':
          return apiClient.post(url, data, config);
        case 'put':
          return apiClient.put(url, data, config);
        case 'delete':
          return apiClient.delete(url, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    });
    
    return Promise.allSettled(batchPromises);
  },
  
  // Annuler une requête
  cancel: (source) => {
    if (source && source.cancel) {
      source.cancel('Request cancelled by user');
    }
  },
  
  // Créer un token d'annulation
  createCancelToken: () => {
    return axios.CancelToken.source();
  },
  
  // Vérifier le statut réseau
  checkNetwork: checkNetworkStatus,
  
  // Traiter la queue
  processQueue: processQueue,
  
  // Obtenir les statistiques
  getStats: () => {
    return {
      queueSize: requestQueue.length,
      isOnline,
      lastChecked: Date.now(),
    };
  },
  
  // Émetteur d'événements
  emitter: {
    listeners: {},
    
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      
      // Retourner une fonction pour supprimer l'écouteur
      return () => {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      };
    },
    
    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in ${event} listener:`, error);
          }
        });
      }
    },
  },
};

// Initialisation
const initializeApiClient = async () => {
  // Charger la queue sauvegardée
  const savedQueue = await localStore.get('api_request_queue');
  if (savedQueue && Array.isArray(savedQueue)) {
    requestQueue.push(...savedQueue);
  }
  
  // Vérifier le réseau
  await checkNetworkStatus();
  
  // Démarrer le traitement périodique de la queue
  setInterval(processQueue, 30000); // Toutes les 30 secondes
  
  // Surveiller les changements de réseau
  Network.addNetworkStateListener((networkState) => {
    const wasOnline = isOnline;
    isOnline = networkState.isConnected && networkState.isInternetReachable;
    
    if (wasOnline !== isOnline) {
      api.emitter.emit('networkStatusChanged', { isOnline });
      
      if (isOnline) {
        processQueue();
      }
    }
  });
  
  console.log('API Client initialized');
};

// Exporter
export { apiClient, api, initializeApiClient };
