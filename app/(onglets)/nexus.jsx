// app/(onglets)/nexus.jsx
/**
 * Écran principal "Nexus"
 * Affiche le feed personnalisé avec actualités, communautés et tendances
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Ionicons, 
  MaterialCommunityIcons,
  FontAwesome5 
} from '@expo/vector-icons';

// Hooks et services
import { useAuth } from '../../lib/auth/use-auth';
import { useAnalytics } from '../../lib/hooks/use-analytics';
import { themeManager } from '../../lib/theme/theme-manager';
import { api } from '../../lib/api/client';

// Composants
import { Button } from '../../components/ui/button';
import { PremiumBadge } from '../../components/premium/premium-badge';

// Sections
import NewsSection from './sections/NewsSection';
import CommunitiesSection from './sections/CommunitiesSection';
import TrendsSection from './sections/TrendsSection';
import QuickActions from './sections/QuickActions';

export default function NexusScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const colors = themeManager.getCurrentColors();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedData, setFeedData] = useState({
    news: [],
    activeCommunities: [],
    trends: [],
    quickActions: [],
  });

  // Charger les données du feed
  const loadFeedData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour le POC
      const mockData = {
        news: [
          {
            id: '1',
            title: 'Nouvel anime annoncé: Demon Slayer Saison 4',
            source: 'Crunchyroll',
            time: 'Il y a 2h',
            image: null,
            category: 'Nouveauté',
          },
          {
            id: '2',
            title: 'Manga de la semaine: One Piece chapitre 1088',
            source: 'Shonen Jump',
            time: 'Il y a 5h',
            image: null,
            category: 'Manga',
          },
          {
            id: '3',
            title: 'Événement: Cosplay Contest ce weekend',
            source: 'Communauté Otaku',
            time: 'Il y a 1j',
            image: null,
            category: 'Événement',
          },
        ],
        activeCommunities: [
          {
            id: '1',
            name: 'One Piece France',
            members: 12450,
            online: 842,
            lastActivity: 'Il y a 5min',
            category: 'Shonen',
          },
          {
            id: '2',
            name: 'Anime Music Lovers',
            members: 8765,
            online: 321,
            lastActivity: 'Il y a 12min',
            category: 'Musique',
          },
          {
            id: '3',
            name: 'Isekai Kingdom',
            members: 5432,
            online: 187,
            lastActivity: 'Il y a 20min',
            category: 'Isekai',
          },
        ],
        trends: [
          {
            id: '1',
            question: 'Quel est votre anime de la saison ?',
            options: ['Jujutsu Kaisen', 'Chainsaw Man', 'Spy × Family', 'Other'],
            votes: 1250,
            endTime: 'Dans 2j',
          },
        ],
        quickActions: [
          { id: '1', icon: 'flash', label: 'Quiz du jour', route: '/quiz' },
          { id: '2', icon: 'sword-cross', label: 'Waifu Battle', route: '/waifu' },
          { id: '3', icon: 'robot', label: 'Chat IA', route: '/ai' },
          { id: '4', icon: 'party-popper', label: 'Watch Party', route: '/watch-party' },
        ],
      };
      
      setFeedData(mockData);
      
      // Track le chargement
      await trackEvent('home_screen_loaded', {
        user_id: user?.id,
        has_premium: user?.isPremium || false,
      });
      
    } catch (error) {
      console.error('Load feed data error:', error);
      await trackEvent('home_screen_error', { error: error.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, trackEvent]);

  // Rafraîchir manuellement
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeedData();
  }, [loadFeedData]);

  // Charger au montage
  useEffect(() => {
    loadFeedData();
  }, [loadFeedData]);

  // Gérer les actions rapides
  const handleQuickAction = async (action) => {
    await trackEvent('quick_action_clicked', {
      action_id: action.id,
      action_label: action.label,
    });
    
    if (action.route) {
      router.push(action.route);
    }
  };

  // Naviguer vers le chat
  const handleGoToChat = () => {
    router.push('/chat/new');
  };

  // Naviguer vers les communautés
  const handleExploreCommunities = () => {
    router.push('/(tabs)/communities');
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement de ton Nexus...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
Text style={[styles.greeting, { color: colors.textPrimary }]}>
            Bonjour, {user?.username || 'Otaku'} 👋
Text>
Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Découvre ce qui se passe dans ton univers
Text>
        </View>
        
View style={styles.headerRight}>
TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: colors.surfaceVariant }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
View style={[styles.notificationBadge, { backgroundColor: colors.primary }]}>
Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          {user?.isPremiumPremiumBadge size="small" />}
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Actions rapides */}
        <QuickActions 
          actions={feedData.quickActions}
          onActionPress={handleQuickAction}
        />

        {/* Section Actualités */}
        <NewsSection 
          news={feedData.news}
          onNewsPress={(news) => {
            router.push(`/news/${news.id}`);
          }}
        />

        {/* Section Communautés actives */}
CommunitiesSection 
          communities={feedData.activeCommunities}
          onCommunityPress={(community) => {
            router.push(`/community/${community.id}`);
          }}
          onExplorePress={handleExploreCommunities}
        />

        {/* Section Tendances */}
TrendsSection 
          trends={feedData.trends}
          onVote={(trend, option) => {
            console.log('Voted:', trend.id, option);
          }}
        />

        {/* CTA Nouveau message */}
        <View style={[styles.ctaContainer, { backgroundColor: colors.surface }]}>
LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="message-text" size={32} color="#FFFFFF" />
View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Démarre uneText>
Text style={styles.ctaDescription}>
                Discute avec tes amis ou rejoins une communauté
              </Text>
            </View>
            <Button
              variant="text"
              size="small"
              onPress={handleGoToChat}
              style={styles.ctaButton}
              textStyle={styles.ctaButtonText}
            >
              Envoyer un message
            </Button>
          </LinearGradient>
        </View>

        {/* Section Statistiques personnelles */}
View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
            Ta semaine en chiffres
Text>
View style={styles.statsGrid}>
View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>Text>
Text style={[styles.statLabel, { color: colors.textSecondary }]}>Text>
            </View>
            <View style={styles.statItem}>
Text style={[styles.statValue, { color: colors.success }]}>5</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Quiz terminText>
            </View>
            <View style={styles.statItem}>
Text style={[styles.statValue, { color: colors.warning }]}>18</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Votes Waifu</Text>
            </View>
            <View style={styles.statItem}>
Text style={[styles.statValue, { color: colors.secondary }]}>3Text>
Text style={[styles.statLabel, { color: colors.textSecondary }]}>Temps passé</Text>
            </View>
          </View>
        </View>

        {/* Espace en bas pour le padding */}
        <View style={styles.bottomSpacing} />
ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  ctaContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ctaGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  ctaDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
