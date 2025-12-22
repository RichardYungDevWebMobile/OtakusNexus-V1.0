// lib/storage/local-storage.js
/**
 * Système de stockage local avancé avec chiffrement et gestion de cache
 */

import { MMKV } from 'react-native-mmkv';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { storageEncryptor } from './encryption';

// Clés de stockage
const STORAGE_KEYS = {
  USER_DATA: 'otakus_user_data',
  APP_SETTINGS: 'otakus_app_settings',
  MESSAGES: 'otakus_messages',
  AI_CHATS: 'otakus_ai_chats',
  COMMUNITIES: 'otakus_communities',
  CACHE: 'otakus_cache',
  METADATA: 'otakus_metadata',
};

// Types de données supportés
const DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
  DATE: 'date',
};

class LocalStorage {
  constructor() {
    this.storage = new MMKV();
    this.encryptionEnabled = true;
    this.cache = new Map();
    this.initialized = false;
    this.storageStats = {
      totalItems: 0,
      totalSize: 0,
      lastCleanup: Date.now(),
    };
  }

  /**
   * Initialiser le stockage
   */
  async initialize(userId = null) {
    try {
      // Configurer le chiffrement
      this.encryptionEnabled = Platform.OS !== 'web'; // Désactiver sur web pour le dev
      
      // Charger les statistiques
      await this.loadStorageStats();
      
      // Nettoyer le cache vieux
      await this.cleanupOldCache();
      
      this.initialized = true;
      console.log('Local storage initialized');
      return true;
    } catch (error) {
      console.error('Local storage initialization failed:', error);
      return false;
    }
  }

  /**
   * Sauvegarder une valeur
   */
  async set(key, value, options = {}) {
    try {
      const {
        encrypt = true,
        ttl = null, // Time to live en millisecondes
        priority = 'normal', // 'low', 'normal', 'high'
      } = options;

      // Préparer la valeur
      let preparedValue = value;
      let dataType = this.getDataType(value);

      // Convertir les dates en timestamp
      if (value instanceof Date) {
        preparedValue = value.getTime();
        dataType = DATA_TYPES.DATE;
      }

      // Chiffrer si nécessaire
      if (this.encryptionEnabled && encrypt && dataType !== DATA_TYPES.NUMBER) {
        const stringValue = JSON.stringify(preparedValue);
        preparedValue = await storageEncryptor.encrypt(stringValue);
      }

      // Créer l'entrée de stockage
      const storageEntry = {
        value: preparedValue,
        metadata: {
          dataType,
          encrypted: this.encryptionEnabled && encrypt && dataType !== DATA_TYPES.NUMBER,
          createdAt: Date.now(),
          ttl,
          priority,
          size: this.calculateSize(preparedValue),
        },
      };

      // Sauvegarder
      this.storage.set(key, JSON.stringify(storageEntry));

      // Mettre en cache
      this.cache.set(key, value);

      // Mettre à jour les statistiques
      await this.updateStorageStats(key, storageEntry.metadata.size);

      // Programmer l'expiration si TTL
      if (ttl) {
        this.scheduleExpiration(key, ttl);
      }

      return true;
    } catch (error) {
      console.error('Set storage error:', error);
      return false;
    }
  }

  /**
   * Récupérer une valeur
   */
  async get(key, defaultValue = null) {
    try {
      // Vérifier le cache d'abord
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      // Récupérer depuis le stockage
      const storedData = this.storage.getString(key);
      if (!storedData) {
        return defaultValue;
      }

      const storageEntry = JSON.parse(storedData);
      const { value, metadata } = storageEntry;

      // Vérifier l'expiration
      if (metadata.ttl && Date.now() > metadata.createdAt + metadata.ttl) {
        await this.delete(key);
        return defaultValue;
      }

      // Déchiffrer si nécessaire
      let finalValue = value;
      if (metadata.encrypted) {
        const decrypted = await storageEncryptor.decrypt(value);
        finalValue = JSON.parse(decrypted);
      }

      // Convertir le type de données
      finalValue = this.convertDataType(finalValue, metadata.dataType);

      // Mettre en cache
      this.cache.set(key, finalValue);

      return finalValue;
    } catch (error) {
      console.error('Get storage error:', error);
      return defaultValue;
    }
  }

  /**
   * Supprimer une valeur
   */
  async delete(key) {
    try {
      // Récupérer la taille avant suppression
      const storedData = this.storage.getString(key);
      if (storedData) {
        const storageEntry = JSON.parse(storedData);
        await this.updateStorageStats(key, -storageEntry.metadata.size);
      }

      // Supprimer
      this.storage.delete(key);
      this.cache.delete(key);

      return true;
    } catch (error) {
      console.error('Delete storage error:', error);
      return false;
    }
  }

  /**
   * Vérifier si une clé existe
   */
  has(key) {
    return this.storage.contains(key);
  }

  /**
   * Obtenir toutes les clés
   */
  getAllKeys() {
    return this.storage.getAllKeys();
  }

  /**
   * Effacer tout le stockage
   */
  async clear() {
    try {
      this.storage.clear();
      this.cache.clear();
      this.storageStats = {
        totalItems: 0,
        totalSize: 0,
        lastCleanup: Date.now(),
      };
      return true;
    } catch (error) {
      console.error('Clear storage error:', error);
      return false;
    }
  }

  /**
   * Sauvegarder les données utilisateur
   */
  async saveUserData(userData) {
    return this.set(STORAGE_KEYS.USER_DATA, userData, {
      encrypt: true,
      priority: 'high',
    });
  }

  /**
   * Récupérer les données utilisateur
   */
  async getUserData() {
    return this.get(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Sauvegarder les paramètres de l'app
   */
  async saveAppSettings(settings) {
    return this.set(STORAGE_KEYS.APP_SETTINGS, settings, {
      encrypt: false,
      priority: 'normal',
    });
  }

  /**
   * Récupérer les paramètres de l'app
   */
  async getAppSettings() {
    return this.get(STORAGE_KEYS.APP_SETTINGS, {});
  }

  /**
   * Gestion du cache
   */
  async cacheSet(key, value, ttl = 3600000) { // 1 heure par défaut
    const cacheKey = `cache_${key}`;
    return this.set(cacheKey, value, {
      encrypt: false,
      ttl,
      priority: 'low',
    });
  }

  async cacheGet(key) {
    const cacheKey = `cache_${key}`;
    return this.get(cacheKey);
  }

  async cacheDelete(key) {
    const cacheKey = `cache_${key}`;
    return this.delete(cacheKey);
  }

  /**
   * Nettoyer le cache expiré
   */
  async cleanupOldCache() {
    try {
      const now = Date.now();
      const allKeys = this.getAllKeys();
      let cleanedCount = 0;

      for (const key of allKeys) {
        if (key.startsWith('cache_')) {
          const storedData = this.storage.getString(key);
          if (storedData) {
            const storageEntry = JSON.parse(storedData);
            const { metadata } = storageEntry;

            if (metadata.ttl && now > metadata.createdAt + metadata.ttl) {
              await this.delete(key);
              cleanedCount++;
            }
          }
        }
      }

      console.log(`Cache cleanup: ${cleanedCount} items removed`);
      this.storageStats.lastCleanup = now;

      return cleanedCount;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Obtenir les statistiques de stockage
   */
  async getStorageStats() {
    await this.updateStorageStats();
    return this.storageStats;
  }

  /**
   * Exporter les données pour backup
   */
  async exportData() {
    try {
      const allKeys = this.getAllKeys();
      const exportData = {};

      for (const key of allKeys) {
        if (key.startsWith('cache_')) continue; // Exclure le cache

        const value = await this.get(key);
        if (value !== null) {
          exportData[key] = value;
        }
      }

      return {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalItems: allKeys.length,
        data: exportData,
      };
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }

  /**
   * Importer des données
   */
  async importData(data) {
    try {
      if (!data || !data.data || data.version !== '1.0') {
        throw new Error('Invalid data format');
      }

      let importedCount = 0;
      const importPromises = [];

      for (const [key, value] of Object.entries(data.data)) {
        importPromises.push(
          this.set(key, value).then(success => {
            if (success) importedCount++;
          })
        );
      }

      await Promise.all(importPromises);
      return { success: true, importedCount };
    } catch (error) {
      console.error('Import data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Méthodes utilitaires privées
  getDataType(value) {
    if (typeof value === 'string') return DATA_TYPES.STRING;
    if (typeof value === 'number') return DATA_TYPES.NUMBER;
    if (typeof value === 'boolean') return DATA_TYPES.BOOLEAN;
    if (Array.isArray(value)) return DATA_TYPES.ARRAY;
    if (value instanceof Date) return DATA_TYPES.DATE;
    if (typeof value === 'object') return DATA_TYPES.OBJECT;
    return DATA_TYPES.STRING;
  }

  convertDataType(value, dataType) {
    switch (dataType) {
      case DATA_TYPES.NUMBER:
        return Number(value);
      case DATA_TYPES.BOOLEAN:
        return Boolean(value);
      case DATA_TYPES.DATE:
        return new Date(value);
      case DATA_TYPES.OBJECT:
      case DATA_TYPES.ARRAY:
        return value;
      default:
        return String(value);
    }
  }

  calculateSize(value) {
    if (typeof value === 'string') {
      return value.length * 2; // Approximation pour UTF-16
    }
    if (typeof value === 'number') {
      return 8; // 64-bit float
    }
    if (typeof value === 'boolean') {
      return 1;
    }
    // Pour les objets et tableaux, estimation
    return JSON.stringify(value).length * 2;
  }

  async loadStorageStats() {
    const stats = await this.get(STORAGE_KEYS.METADATA, this.storageStats);
    if (stats) {
      this.storageStats = stats;
    }
  }

  async updateStorageStats(key = null, sizeDelta = 0) {
    const allKeys = this.getAllKeys();
    this.storageStats.totalItems = allKeys.length;
    this.storageStats.totalSize = Math.max(0, this.storageStats.totalSize + sizeDelta);
    
    await this.set(STORAGE_KEYS.METADATA, this.storageStats, {
      encrypt: false,
      priority: 'low',
    });
  }

  scheduleExpiration(key, ttl) {
    setTimeout(async () => {
      if (this.has(key)) {
        const storedData = this.storage.getString(key);
        if (storedData) {
          const storageEntry = JSON.parse(storedData);
          if (Date.now() > storageEntry.metadata.createdAt + ttl) {
            await this.delete(key);
          }
        }
      }
    }, ttl);
  }
}

// Singleton pour le stockage local
export const localStore = new LocalStorage();
