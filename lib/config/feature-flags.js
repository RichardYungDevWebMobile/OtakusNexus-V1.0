/**
 * Système de feature flags pour activer/désactiver les fonctionnalités
 * Otakus Nexus
 *
 * - Stockage local (low-cost, offline-first)
 * - Ajustement automatique selon l’environnement
 * - Support des features premium, IA et expérimentales
 * - Écouteurs pour re-render UI / logique applicative
 */

import { localStore } from '../storage/local-storage';
import { environmentConfig } from './environment';

class FeatureFlags {
  constructor() {
    this.flags = this.getDefaultFlags();
    this.initialized = false;

    // Écouteurs pour notifier les composants (React / services)
    this.listeners = new Set();
  }

  /**
   * Obtenir les flags par défaut
   */
  getDefaultFlags() {
    return {
      // Authentification
      AUTH_ENABLED: true,
      GOOGLE_SIGN_IN: true,
      APPLE_SIGN_IN: true,
      EMAIL_VERIFICATION: false,

      // Messagerie
      MESSAGING_ENABLED: true,
      VOICE_MESSAGES: true,
      VIDEO_MESSAGES: true,
      MESSAGE_ENCRYPTION: true,

      // Communautés
      COMMUNITIES_ENABLED: true,
      VOICE_ROOMS: true,
      WATCH_PARTY: true,
      COMMUNITY_EVENTS: true,

      // IA
      AI_ENABLED: true,
      AI_CHAT: true,
      AI_IMAGE_GENERATION: true,
      AI_CODE_GENERATION: true,

      // Waifu Battle
      WAIFU_BATTLE_ENABLED: true,
      WAIFU_SEASONS: true,
      WAIFU_LEADERBOARD: true,

      // Monétisation
      MONETIZATION_ENABLED: environmentConfig.isProduction,
      SUBSCRIPTIONS: environmentConfig.isProduction,
      IN_APP_PURCHASES: environmentConfig.isProduction,
      ADS_ENABLED: false,

      // Contenu
      CONTENT_HUB_ENABLED: true,
      ANIME_NEWS: true,
      MANGA_UPDATES: true,
      RELEASE_CALENDAR: true,

      // Social
      FRIENDS_SYSTEM: true,
      PROFILES: true,
      ACHIEVEMENTS: true,

      // Internationalisation
      I18N_ENABLED: true,
      MULTI_LANGUAGE: true,

      // Analytics
      ANALYTICS_ENABLED: environmentConfig.isProduction,
      ERROR_TRACKING: true,
      PERFORMANCE_MONITORING: true,

      // Experimental
      BETA_FEATURES: false,
      NEW_UI: false,
      DARK_MODE: true,

      // Maintenance
      MAINTENANCE_MODE: false,
      READ_ONLY_MODE: false,
    };
  }

  /**
   * Initialiser les feature flags
   */
  async initialize() {
    try {
      const savedFlags = await localStore.get('feature_flags');

      if (savedFlags && typeof savedFlags === 'object') {
        this.flags = { ...this.flags, ...savedFlags };
      }

      this.adjustForEnvironment();
      this.initialized = true;

      console.log('[FeatureFlags] Initialized');
      return true;
    } catch (error) {
      console.error('[FeatureFlags] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Ajuster les flags selon l’environnement
   */
  adjustForEnvironment() {
    if (environmentConfig.isDevelopment) {
      this.flags.BETA_FEATURES = true;
      this.flags.NEW_UI = true;
      this.flags.EMAIL_VERIFICATION = false;
      this.flags.MONETIZATION_ENABLED = false;
      this.flags.SUBSCRIPTIONS = false;
      this.flags.IN_APP_PURCHASES = false;
    }

    if (environmentConfig.isStaging) {
      this.flags.BETA_FEATURES = true;
      this.flags.MONETIZATION_ENABLED = false;
      this.flags.SUBSCRIPTIONS = false;
      this.flags.IN_APP_PURCHASES = false;
    }
  }

  /**
   * Vérifier si un flag est activé
   */
  isEnabled(flagName) {
    if (!this.initialized) {
      console.warn('[FeatureFlags] Not initialized, fallback used:', flagName);
    }
    return Boolean(this.flags[flagName]);
  }

  /**
   * Activer ou désactiver un flag
   */
  async setFlag(flagName, enabled) {
    try {
      if (!(flagName in this.flags)) {
        console.warn(`[FeatureFlags] Unknown flag: ${flagName}`);
        return false;
      }

      this.flags[flagName] = Boolean(enabled);
      await localStore.set('feature_flags', this.flags);

      this.notifyFlagChange(flagName, enabled);
      return true;
    } catch (error) {
      console.error('[FeatureFlags] Set flag error:', error);
      return false;
    }
  }

  /**
   * Obtenir tous les flags
   */
  getAllFlags() {
    return { ...this.flags };
  }

  /**
   * Vérifier l’accès à une fonctionnalité métier
   */
  canAccessFeature(featureName, user = null) {
    const featureAccess = {
      premium_themes: this.flags.MONETIZATION_ENABLED,
      ai_image_generation: this.flags.AI_IMAGE_GENERATION,
      ai_code_generation: this.flags.AI_CODE_GENERATION,
      voice_rooms: this.flags.VOICE_ROOMS,
      watch_party: this.flags.WATCH_PARTY,
      beta_features: this.flags.BETA_FEATURES,
    };

    // Premium requis
    if (user && featureName.startsWith('premium_')) {
      return (
        featureAccess[featureName] === true &&
        (user.isPremium === true || user.isAdmin === true)
      );
    }

    return Boolean(featureAccess[featureName]);
  }

  /**
   * Ajouter un écouteur de changement
   * (utile pour React / state global)
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
  }

  /**
   * Supprimer un écouteur
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notifier les changements de flag
   */
  notifyFlagChange(flagName, enabled) {
    console.log(`[FeatureFlags] ${flagName} => ${enabled}`);

    this.listeners.forEach((callback) => {
      try {
        callback(flagName, enabled, this.getAllFlags());
      } catch (error) {
        console.error('[FeatureFlags] Listener error:', error);
      }
    });
  }

  /**
   * Exporter la configuration actuelle
   */
  exportConfig() {
    return {
      flags: this.getAllFlags(),
      environment: environmentConfig.env,
      timestamp: Date.now(),
    };
  }

  /**
   * Importer une configuration (debug, admin, QA)
   */
  async importConfig(config) {
    try {
      if (!config || typeof config !== 'object' || !config.flags) {
        throw new Error('Invalid feature flags config');
      }

      this.flags = { ...this.flags, ...config.flags };
      await localStore.set('feature_flags', this.flags);

      // Notifier un refresh global
      this.notifyFlagChange('CONFIG_IMPORTED', true);

      return true;
    } catch (error) {
      console.error('[FeatureFlags] Import config failed:', error);
      return false;
    }
  }

  /**
   * Reset aux valeurs par défaut
   * (utile debug / logout / corruption)
   */
  async reset() {
    try {
      this.flags = this.getDefaultFlags();
      this.adjustForEnvironment();
      await localStore.remove('feature_flags');

      this.notifyFlagChange('RESET', true);
      return true;
    } catch (error) {
      console.error('[FeatureFlags] Reset failed:', error);
      return false;
    }
  }
}

/**
 * Singleton global
 * IMPORTANT pour éviter les incohérences entre composants
 */
export const featureFlags = new FeatureFlags();
