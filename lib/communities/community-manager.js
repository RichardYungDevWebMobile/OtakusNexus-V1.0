/**
 * Gestionnaire avancé des communautés
 * Gère la création, modération, événements et outils admin
 */

import { localStore } from '../storage/local-storage';
import { api } from '../api/client';
import { useAuth } from '../auth/use-auth';
import { useAnalytics } from '../lib/hooks/use-analytics';

// Types de communautés
const COMMUNITY_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  SECRET: 'secret',
};

// Rôles des membres
const MEMBER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  GUEST: 'guest',
};

// Permissions
const PERMISSIONS = {
  SEND_MESSAGES: 'send_messages',
  SEND_MEDIA: 'send_media',
  CREATE_THREADS: 'create_threads',
  ADD_REACTIONS: 'add_reactions',
  MENTION_EVERYONE: 'mention_everyone',
  MANAGE_MESSAGES: 'manage_messages',
  MANAGE_CHANNELS: 'manage_channels',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_COMMUNITY: 'manage_community',
  BAN_MEMBERS: 'ban_members',
  KICK_MEMBERS: 'kick_members',
  VIEW_AUDIT_LOG: 'view_audit_log',
  CREATE_EVENTS: 'create_events',
  MANAGE_EVENTS: 'manage_events',
};

class CommunityManager {
  constructor() {
    this.communities = new Map();
    this.userMemberships = new Map();
    this.initialized = false;
    this.listeners = new Set();
  }

  /**
   * Initialiser le gestionnaire
   */
  async initialize(userId) {
    try {
      this.userId = userId;
      
      // Charger les communautés depuis le cache
      await this.loadCachedCommunities();
      
      // Charger les membreships de l'utilisateur
      await this.loadUserMemberships();
      
      this.initialized = true;
      console.log('Community manager initialized');
      return true;
    } catch (error) {
      console.error('Community manager initialization failed:', error);
      return false;
    }
  }

  /**
   * Charger les communautés depuis le cache
   */
  async loadCachedCommunities() {
    try {
      const cachedCommunities = await localStore.get('communities_cache');
      if (cachedCommunities && Array.isArray(cachedCommunities)) {
        cachedCommunities.forEach(community => {
          this.communities.set(community.id, community);
        });
      }
    } catch (error) {
      console.error('Load cached communities error:', error);
    }
  }

  /**
   * Charger les membreships de l'utilisateur
   */
  async loadUserMemberships() {
    try {
      const memberships = await localStore.get(`user_${this.userId}_communities`);
      if (memberships && Array.isArray(memberships)) {
        memberships.forEach(membership => {
          this.userMemberships.set(membership.communityId, membership);
        });
      }
    } catch (error) {
      console.error('Load user memberships error:', error);
    }
  }

  /**
   * Créer une nouvelle communauté
   */
  async createCommunity(communityData) {
    try {
      const { 
        name, 
        description, 
        type = COMMUNITY_TYPES.PUBLIC,
        category,
        rules,
        tags = [],
        bannerImage,
        icon,
      } = communityData;

      // Validation
      if (!name || name 3 || name.length > 50) {
        throw new Error('Le nom doit contenir entre 3 et 50 caractères');
      }

      if (description && description.length > 500) {
        throw new Error('La description ne peut pas dépasser 500 caractères');
      }

      // Appel API pour créer la communauté
      const response = await api.post('/communities/create', {
        name,
        description,
        type,
        category,
        rules,
        tags,
        bannerImage,
        icon,
      });

      if (response.success) {
        const community = response.community;
        
        // Ajouter à la liste locale
        this.communities.set(community.id, community);
        
        // Ajouter le créateur comme owner
        const membership = {
          communityId: community.id,
          userId: this.userId,
          role: MEMBER_ROLES.OWNER,
          joinedAt: Date.now(),
          permissions: this.getRolePermissions(MEMBER_ROLES.OWNER),
        };
        
        this.userMemberships.set(community.id, membership);
        
        // Sauvegarder en cache
        await this.cacheCommunity(community);
        await this.cacheUserMembership(membership);
        
        // Notifier les écouteurs
        this.notifyListeners('communityCreated', community);
        
        // Analytics
        const { trackEvent } = useAnalytics();
        await trackEvent('community_created', {
          community_id: community.id,
          type,
          category,
        });
        
        return { success: true, community };
      } else {
        throw new Error(response.error || 'Failed to create community');
      }
    } catch (error) {
      console.error('Create community error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Rejoindre une communauté
   */
  async joinCommunity(communityId, inviteCode = null) {
    try {
      // Vérifier si l'utilisateur est déjà membre
      if (this.userMemberships.has(communityId)) {
        throw new Error('Vous êtes déjà membre de cette communauté');
      }

      // Obtenir les infos de la communauté
      const community = await this.getCommunity(communityId);
      if (!community) {
        throw new Error('Communauté non trouvée');
      }

      // Vérifier les restrictions
      if (community.type === COMMUNITY_TYPES.SECRET && !inviteCode) {
        throw new Error('Un code d\'invitation est requis');
      }

      if (community.type === COMMUNITY_TYPES.PRIVATE) {
        // Envoyer une demande de participation
        const request = await this.sendJoinRequest(communityId);
        return request;
      }

      // Rejoindre directement (public ou avec code)
      const response = await api.post(`/communities/${communityId}/join`, {
        inviteCode,
      });

      if (response.success) {
        const membership = response.membership;
        
        // Mettre à jour localement
        this.userMemberships.set(communityId, membership);
        
        // Mettre à jour le compteur de membres
        community.memberCount = (community.memberCount || 0) + 1;
        this.communities.set(communityId, community);
        
        // Sauvegarder en cache
        await this.cacheCommunity(community);
        await this.cacheUserMembership(membership);
        
        // Notifier les écouteurs
        this.notifyListeners('communityJoined', { community, membership });
        
        // Analytics
        const { trackEvent } = useAnalytics();
        await trackEvent('community_joined', {
          community_id: communityId,
          type: community.type,
        });
        
        return { success: true, community, membership };
      } else {
        throw new Error(response.error || 'Failed to join community');
      }
    } catch (error) {
      console.error('Join community error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Quitter une communauté
   */
  async leaveCommunity(communityId) {
    try {
      const membership = this.userMemberships.get(communityId);
      if (!membership) {
        throw new Error('Vous n\'êtes pas membre de cette communauté');
      }

      // Vérifier si l'utilisateur est le propriétaire
      if (membership.role === MEMBER_ROLES.OWNER) {
        throw new Error('Le propriétaire ne peut pas quitter la communauté. Transférez la propriété d\'abord.');
      }

      // Appel API pour quitter
      const response = await api.post(`/communities/${communityId}/leave`);

      if (response.success) {
        // Supprimer localement
        this.userMemberships.delete(communityId);
        
        // Mettre à jour le compteur de membres
        const community = await this.getCommunity(communityId);
        if (community) {
          community.memberCount = Math.max(0, (community.memberCount || 1) - 1);
          this.communities.set(communityId, community);
          await this.cacheCommunity(community);
        }
        
        // Supprimer le membership du cache
        await this.removeCachedMembership(communityId);
        
        // Notifier les écouteurs
        this.notifyListeners('communityLeft', { communityId });
        
        // Analytics
        const { trackEvent } = useAnalytics();
        await trackEvent('community_left', { community_id: communityId });
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to leave community');
      }
    } catch (error) {
      console.error('Leave community error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir une communauté
   */
  async getCommunity(communityId, forceRefresh = false) {
    try {
      // Vérifier le cache d'abord
      if (!forceRefresh && this.communities.has(communityId)) {
        return this.communities.get(communityId);
      }

      // Récupérer depuis l'API
      const response = await api.get(`/communities/${communityId}`);
      
      if (response.success) {
        const community = response.community;
        
        // Mettre en cache
        this.communities.set(communityId, community);
        await this.cacheCommunity(community);
        
        return community;
      } else {
        throw new Error(response.error || 'Community not found');
      }
    } catch (error) {
      console.error('Get community error:', error);
      return null;
    }
  }

  /**
   * Obtenir les communautés de l'utilisateur
   */
  async getUserCommunities() {
    try {
      // Récupérer depuis l'API
      const response = await api.get('/communities/user');
      
      if (response.success) {
        const communities = response.communities;
        
        // Mettre à jour le cache local
        communities.forEach(community => {
          this.communities.set(community.id, community);
        });
        
        // Mettre à jour les membreships
        const memberships = response.memberships || [];
        memberships.forEach(membership => {
          this.userMemberships.set(membership.communityId, membership);
        });
        
        // Sauvegarder en cache
        await this.cacheCommunities(communities);
        await this.cacheUserMemberships(memberships);
        
        return { success: true, communities };
      } else {
        throw new Error(response.error || 'Failed to get user communities');
      }
    } catch (error) {
      console.error('Get user communities error:', error);
      
      // Fallback au cache
      const cachedCommunities = Array.from(this.communities.values());
      return { 
        success: true, 
        communities: cachedCommunities,
        fromCache: true 
      };
    }
  }

  /**
   * Rechercher des communautés
   */
  async searchCommunities(query, filters = {}) {
    try {
      const response = await api.get('/communities/search', {
        params: { query, ...filters },
      });
      
      if (response.success) {
        return { success: true, communities: response.communities };
      } else {
        throw new Error(response.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search communities error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour une communauté
   */
  async updateCommunity(communityId, updates) {
    try {
      // Vérifier les permissions
      const membership = this.userMemberships.get(communityId);
      if (!membership || !this.hasPermission(membership, PERMISSIONS.MANAGE_COMMUNITY)) {
        throw new Error('Permission denied');
      }

      const response = await api.put(`/communities/${communityId}`, updates);
      
      if (response.success) {
        const updatedCommunity = response.community;
        
        // Mettre à jour localement
        this.communities.set(communityId, updatedCommunity);
        await this.cacheCommunity(updatedCommunity);
        
        // Notifier les écouteurs
        this.notifyListeners('communityUpdated', updatedCommunity);
        
        return { success: true, community: updatedCommunity };
      } else {
        throw new Error(response.error || 'Failed to update community');
      }
    } catch (error) {
      console.error('Update community error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une communauté
   */
  async deleteCommunity(communityId) {
    try {
      // Vérifier les permissions
      const membership = this.userMemberships.get(communityId);
      if (!membership || membership.role !== MEMBER_ROLES.OWNER) {
        throw new Error('Seul le propriétaire peut supprimer la communauté');
      }

      const response = await api.delete(`/communities/${communityId}`);
      
      if (response.success) {
        // Supprimer localement
        this.communities.delete(communityId);
        this.userMemberships.delete(communityId);
        
        // Supprimer du cache
        await this.removeCachedCommunity(communityId);
        await this.removeCachedMembership(communityId);
        
        // Notifier les écouteurs
        this.notifyListeners('communityDeleted', { communityId });
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to delete community');
      }
    } catch (error) {
      console.error('Delete community error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gérer les membres
   */
  async manageMember(communityId, memberId, action, data = {}) {
    try {
      // Vérifier les permissions
      const membership = this.userMemberships.get(communityId);
      const requiredPermission = this.getRequiredPermissionForAction(action);
      
      if (!membership || !this.hasPermission(membership, requiredPermission)) {
        throw new Error('Permission denied');
      }

      const response = await api.post(`/communities/${communityId}/members/${memberId}/${action}`, data);
      
      if (response.success) {
        // Notifier les écouteurs
        this.notifyListeners('memberManaged', {
          communityId,
          memberId,
          action,
          data: response.data,
        });
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to manage member');
      }
    } catch (error) {
      console.error('Manage member error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer un événement communautaire
   */
  async createEvent(communityId, eventData) {
    try {
      // Vérifier les permissions
      const membership = this.userMemberships.get(communityId);
      if (!membership || !this.hasPermission(membership, PERMISSIONS.CREATE_EVENTS)) {
        throw new Error('Permission denied');
      }

      const response = await api.post(`/communities/${communityId}/events`, eventData);
      
      if (response.success) {
        // Notifier les écouteurs
        this.notifyListeners('eventCreated', {
          communityId,
          event: response.event,
        });
        
        return { success: true, event: response.event };
      } else {
        throw new Error(response.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir les événements d'une communauté
   */
  async getCommunityEvents(communityId, filters = {}) {
    try {
      const response = await api.get(`/communities/${communityId}/events`, {
        params: filters,
      });
      
      if (response.success) {
        return { success: true, events: response.events };
      } else {
        throw new Error(response.error || 'Failed to get events');
      }
    } catch (error) {
      console.error('Get community events error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoyer un message dans la communauté
   */
  async sendCommunityMessage(communityId, messageData) {
    try {
      // Vérifier les permissions
      const membership = this.userMemberships.get(communityId);
      if (!membership || !this.hasPermission(membership, PERMISSIONS.SEND_MESSAGES)) {
        throw new Error('Permission denied');
      }

      const response = await api.post(`/communities/${communityId}/messages`, messageData);
      
      if (response.success) {
        // Notifier les écouteurs
        this.notifyListeners('communityMessageSent', {
          communityId,
          message: response.message,
        });
        
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send community message error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir les messages d'une communauté
   */
  async getCommunityMessages(communityId, options = {}) {
    try {
      const response = await api.get(`/communities/${communityId}/messages`, {
        params: options,
      });
      
      if (response.success) {
        return { success: true, messages: response.messages };
      } else {
        throw new Error(response.error || 'Failed to get messages');
      }
    } catch (error) {
      console.error('Get community messages error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Vérifier les permissions
   */
  hasPermission(membership, permission) {
    if (!membership || !membership.permissions) {
      return false;
    }
    
    return membership.permissions.includes(permission);
  }

  /**
   * Obtenir les permissions d'un rôle
   */
  getRolePermissions(role) {
    const permissionsMap = {
      [MEMBER_ROLES.OWNER]: [
        PERMISSIONS.SEND_MESSAGES,
        PERMISSIONS.SEND_MEDIA,
        PERMISSIONS.CREATE_THREADS,
        PERMISSIONS.ADD_REACTIONS,
        PERMISSIONS.MENTION_EVERYONE,
        PERMISSIONS.MANAGE_MESSAGES,
        PERMISSIONS.MANAGE_CHANNELS,
        PERMISSIONS.MANAGE_ROLES,
        PERMISSIONS.MANAGE_COMMUNITY,
        PERMISSIONS.BAN_MEMBERS,
        PERMISSIONS.KICK_MEMBERS,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.CREATE_EVENTS,
        PERMISSIONS.MANAGE_EVENTS,
      ],
      [MEMBER_ROLES.ADMIN]: [
        PERMISSIONS.SEND_MESSAGES,
        PERMISSIONS.SEND_MEDIA,
        PERMISSIONS.CREATE_THREADS,
        PERMISSIONS.ADD_REACTIONS,
        PERMISSIONS.MENTION_EVERYONE,
        PERMISSIONS.MANAGE_MESSAGES,
        PERMISSIONS.MANAGE_CHANNELS,
        PERMISSIONS.MANAGE_ROLES,
        PERMISSIONS.BAN_MEMBERS,
        PERMISSIONS.KICK_MEMBERS,
        PERMISSIONS.CREATE_EVENTS,
        PERMISSIONS.MANAGE_EVENTS,
      ],
      [MEMBER_ROLES.MODERATOR]: [
        PERMISSIONS.SEND_MESSAGES,
        PERMISSIONS.SEND_MEDIA,
        PERMISSIONS.CREATE_THREADS,
        PERMISSIONS.ADD_REACTIONS,
        PERMISSIONS.MANAGE_MESSAGES,
        PERMISSIONS.KICK_MEMBERS,
      ],
      [MEMBER_ROLES.MEMBER]: [
        PERMISSIONS.SEND_MESSAGES,
        PERMISSIONS.SEND_MEDIA,
        PERMISSIONS.CREATE_THREADS,
        PERMISSIONS.ADD_REACTIONS,
      ],
      [MEMBER_ROLES.GUEST]: [
        PERMISSIONS.SEND_MESSAGES,
      ],
    };
    
    return permissionsMap[role] || [];
  }

  /**
   * Obtenir la permission requise pour une action
   */
  getRequiredPermissionForAction(action) {
    const actionPermissions = {
      'kick': PERMISSIONS.KICK_MEMBERS,
      'ban': PERMISSIONS.BAN_MEMBERS,
      'mute': PERMISSIONS.MANAGE_MESSAGES,
      'promote': PERMISSIONS.MANAGE_ROLES,
      'demote': PERMISSIONS.MANAGE_ROLES,
    };
    
    return actionPermissions[action] || PERMISSIONS.MANAGE_COMMUNITY;
  }

  /**
   * Envoyer une demande de participation
   */
  async sendJoinRequest(communityId) {
    try {
      const response = await api.post(`/communities/${communityId}/join-requests`);
      
      if (response.success) {
        // Notifier les écouteurs
        this.notifyListeners('joinRequestSent', {
          communityId,
          requestId: response.requestId,
        });
        
        return { 
          success: true, 
          message: 'Demande de participation envoyée',
          requestId: response.requestId,
        };
      } else {
        throw new Error(response.error || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Send join request error:', error);
      return { success: false, error: error.message };
    }
  }

  // Méthodes de cache
  async cacheCommunity(community) {
    try {
      const cachedCommunities = await localStore.get('communities_cache', []);
      const existingIndex = cachedCommunities.findIndex(c => c.id === community.id);
      
      if (existingIndex >= 0) {
        cachedCommunities[existingIndex] = community;
      } else {
        cachedCommunities.push(community);
      }
      
      // Limiter à 100 communautés en cache
      if (cachedCommunities.length > 100) {
        cachedCommunities.shift();
      }
      
      await localStore.set('communities_cache', cachedCommunities);
      return true;
    } catch (error) {
      console.error('Cache community error:', error);
      return false;
    }
  }

  async cacheCommunities(communities) {
    try {
      await localStore.set('communities_cache', communities.slice(0, 100));
      return true;
    } catch (error) {
      console.error('Cache communities error:', error);
      return false;
    }
  }

  async cacheUserMembership(membership) {
    try {
      const key = `user_${this.userId}_communities`;
      const memberships = await localStore.get(key, []);
      const existingIndex = memberships.findIndex(m => m.communityId === membership.communityId);
      
      if (existingIndex >= 0) {
        memberships[existingIndex] = membership;
      } else {
        memberships.push(membership);
      }
      
      await localStore.set(key, memberships);
      return true;
    } catch (error) {
      console.error('Cache user membership error:', error);
      return false;
    }
  }

  async cacheUserMemberships(memberships) {
    try {
      const key = `user_${this.userId}_communities`;
      await localStore.set(key, memberships);
      return true;
    } catch (error) {
      console.error('Cache user memberships error:', error);
      return false;
    }
  }

  async removeCachedCommunity(communityId) {
    try {
      const cachedCommunities = await localStore.get('communities_cache', []);
      const filteredCommunities = cachedCommunities.filter(c => c.id !== communityId);
      await localStore.set('communities_cache', filteredCommunities);
      return true;
    } catch (error) {
      console.error('Remove cached community error:', error);
      return false;
    }
  }

  async removeCachedMembership(communityId) {
    try {
      const key = `user_${this.userId}_communities`;
      const memberships = await localStore.get(key, []);
      const filteredMemberships = memberships.filter(m => m.communityId !== communityId);
      await localStore.set(key, filteredMemberships);
      return true;
    } catch (error) {
      console.error('Remove cached membership error:', error);
      return false;
    }
  }

  /**
   * Ajouter un écouteur
   */
  addListener(event, callback) {
    this.listeners.add({ event, callback });
    
    return () => {
      this.listeners.delete({ event, callback });
    };
  }

  /**
   * Notifier les écouteurs
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      if (listener.event === event) {
        try {
          listener.callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      }
    });
  }

  /**
   * Nettoyer les ressources
   */
  async cleanup() {
    this.communities.clear();
    this.userMemberships.clear();
    this.listeners.clear();
    this.initialized = false;
  }
}

// Singleton pour le gestionnaire de communautés
export const communityManager = new CommunityManager();