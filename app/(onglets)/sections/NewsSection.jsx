/**
 * Section Actualités du feed Nexus
 * Affiche les dernières news anime/manga
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeManager } from '../../../lib/theme/theme-manager';
import { useAnalytics } from '../../../lib/hooks/use-analytics';

const NewsSection = ({ news, onNewsPress }) => {
  const colors = themeManager.getCurrentColors();
  const { trackEvent } = useAnalytics();

  const handleNewsPress = async (newsItem) => {
    await trackEvent('news_clicked', {
      news_id: newsItem.id,
      category: newsItem.category,
    });
    onNewsPress?.(newsItem);
  };

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Actualités
Text>
TouchableOpacity style={styles.seeAllButton}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            Tout voir
Text>
Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.newsList}
      >
        {news.map((item, index) => (
TouchableOpacity
            key={item.id}
            style={[
              styles.newsCard,
              { backgroundColor: colors.surface },
              index > 0 && { marginLeft: 12 },
            ]}
            onPress={() => handleNewsPress(item)}
            activeOpacity={0.7}
          >
            {/* Badge catégorie */}
View style={[
              styles.categoryBadge,
              { backgroundColor: colors.surfaceVariant },
            ]}>
Text style={[
                styles.categoryText,
                { color: colors.textSecondary },
              ]}>
                {item.category}
              </Text>
            </View>

            {/* Image placeholder */}
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceVariant }]}>
Ionicons name="newspaper" size={32} color={colors.textSecondary} />
View>

            {/* Contenu */}
            <View style={styles.newsContent}>
              <Text 
                style={[styles.newsTitle, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {item.title}
Text>
              
View style={styles.newsMeta}>
Text style={[styles.source, { color: colors.textSecondary }]}>
                  {item.source}
Text>
Text style={[styles.time, { color: colors.textSecondary }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  newsList: {
    paddingBottom: 8,
  },
  newsCard: {
    width: 280,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  imagePlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default NewsSection;
