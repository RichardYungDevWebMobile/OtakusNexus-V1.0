// components/premium/feature-comparison.jsx
/**
 * Tableau de comparaison des fonctionnalités gratuit vs premium
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const FeatureComparison = () => {
  const features = [
    {
      category: 'Messagerie',
      items: [
        { name: 'Messages illimités', free: true, premium: true },
        { name: 'Stickers gratuits', free: true, premium: true },
        { name: 'Stickers animés premium', free: false, premium: true },
        { name: 'Réactions avancées', free: false, premium: true },
        { name: 'Historique illimité', free: true, premium: true },
      ],
    },
    {
      category: 'Communautés',
      items: [
        { name: 'Rejoindre des communautés', free: true, premium: true },
        { name: 'Créez des communautés', free: true, premium: true },
        { name: 'Salons vocaux HD', free: false, premium: true },
        { name: 'Watch Party HD', free: false, premium: true },
        { name: 'Événements exclusifs', free: false, premium: true },
      ],
    },
    {
      category: 'IA & Création',
      items: [
        { name: 'Chatbot Otaku (20/jour)', free: true, premium: true },
        { name: 'Générateur d\'images illimité', free: false, premium: true },
        { name: 'Flash Coder (10/jour)', free: true, premium: true },
        { name: 'Crédits IA mensuels', free: false, premium: true },
        { name: 'Priorité des réponses', free: false, premium: true },
      ],
    },
    {
      category: 'Personnalisation',
      items: [
        { name: 'Thèmes de base', free: true, premium: true },
        { name: 'Thèmes anime exclusifs', free: false, premium: true },
        { name: 'Avatars 3D personnalisés', free: false, premium: true },
        { name: 'Badges animés', free: false, premium: true },
        { name: 'Effets de message', free: false, premium: true },
      ],
    },
    {
      category: 'Waifu Battle',
      items: [
        { name: 'Votes quotidiens (50/jour)', free: true, premium: true },
        { name: 'Votes illimités', free: false, premium: true },
        { name: 'Statistiques avancées', free: false, premium: true },
        { name: 'Badges exclusifs', free: false, premium: true },
        { name: 'Classements prioritaire', free: false, premium: true },
      ],
    },
    {
      category: 'Support & Expérience',
      items: [
        { name: 'Application sans pub', free: true, premium: true },
        { name: 'Support prioritaire', free: false, premium: true },
        { name: 'Backup cloud avancé', free: false, premium: true },
        { name: 'Accès anticipé aux features', free: false, premium: true },
        { name: 'Badge profil premium', free: false, premium: true },
      ],
    },
  ];

  const renderFeatureIcon = (available) => {
    if (available) {
      return (
View style={styles.checkIcon}>
Ionicons name="checkmark-circle" size={20} color="#10B981" />
View>
      );
    }
    return (
View style={styles.crossIcon}>
Ionicons name="close-circle" size={20} color="#EF4444" />
      </View>
    );
  };

  return (
ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
View style={styles.table}>
        {/* En-tête du tableau */}
View style={styles.tableHeader}>
View style={[styles.headerCell, styles.featureHeader]}>
            <Text style={styles.headerTitle}>Fonctionnalités</Text>
          </View>
          <View style={[styles.headerCell, styles.freeHeader]}>
            <View style={styles.planBadge}>
Text style={styles.freeBadgeText}>GRATUIT</Text>
            </View>
          </View>
          <View style={[styles.headerCell, styles.premiumHeader]}>
LinearGradient
              colors={['#5B7CFA', '#7D9AFC']}
              style={styles.planBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name="crown" size={14} color="#FFFFFF" />
Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Corps du tableau */}
        {features.map((category, categoryIndex) => (
View key={categoryIndex} style={styles.categorySection}>
            {/* Titre de catégorie */}
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
            </View>
            
            {/* Fonctionnalités */}
            {category.items.map((feature, featureIndex) => (
View 
                key={featureIndex} 
                style={[
                  styles.featureRow,
                  featureIndex % 2 === 0 && styles.evenRow,
                ]}
              >
View style={[styles.cell, styles.featureCell]}>
Text style={styles.featureName}>{feature.name}</Text>
                </View>
                
View style={[styles.cell, styles.freeCell]}>
                  {renderFeatureIcon(feature.free)}
                </View>
                
View style={[styles.cell, styles.premiumCell]}>
                  {renderFeatureIcon(feature.premium)}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    minWidth: 600,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerCell: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  featureHeader: {
    flex: 3,
    alignItems: 'flex-start',
  },
  freeHeader: {
    flex: 1,
  },
  premiumHeader: {
    flex: 1,
    borderRightWidth: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeBadgeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  categoryHeader: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7DD3FC',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featureRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  featureCell: {
    flex: 3,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  freeCell: {
    flex: 1,
    alignItems: 'center',
  },
  premiumCell: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 0,
  },
  featureName: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
