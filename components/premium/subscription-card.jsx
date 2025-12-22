// components/premium/subscription-card.jsx
/**
 * Carte d'abonnement premium
 * Présente un plan d'abonnement avec ses caractéristiques
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const SubscriptionCard = ({ 
  plan, 
  isCurrent = false, 
  trialAvailable = false,
  onSelect,
  disabled = false 
}) => {
  const {
    type,
    product,
    features = [],
    isBestValue = false,
    savings,
  } = plan;

  // Extraire les informations du produit
  const productInfo = product?.product || product;
  const price = productInfo?.priceString || plan.price || '4.99';
  const currency = productInfo?.currency || plan.currency || 'EUR';
  const period = productInfo?.subscriptionPeriod || plan.period || 'mois';

  const getPeriodLabel = () => {
    switch (type) {
      case 'monthly': return 'Mensuel';
      case 'annual': return 'Annuel';
      case 'quarterly': return 'Trimestriel';
      default: return 'Mensuel';
    }
  };

  const getPricePerMonth = () => {
    if (type === 'annual') {
      const priceNum = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.'));
      return (priceNum / 12).toFixed(2);
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrent && styles.currentContainer,
        isBestValue && styles.bestValueContainer,
        disabled && styles.disabledContainer,
      ]}
      onPress={onSelect}
      disabled={disabled || isCurrent}
      activeOpacity={0.7}
    >
      {isBestValue && (
        <View style={styles.bestValueBadge}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.bestValueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="crown" size={14} color="#FFFFFF" />
Text style={styles.bestValueText}>MEILLEURE VALEUR</Text>
          </LinearGradient>
        </View>
      )}

View style={styles.header}>
View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            isCurrent && styles.currentTitle,
            isBestValue && styles.bestValueTitle,
          ]}>
            {getPeriodLabel()}
Text>
          
          {savings && (
View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>{savText>
            </View>
          )}
        </View>

        <View style={styles.priceContainer}>
Text style={[
            styles.price,
            isCurrent && styles.currentPrice,
            isBestValue && styles.bestValuePrice,
          ]}>
            {price}
Text>
Text style={styles.period}>/{period}</Text>
        </View>

        {getPricePerMonth() && (
Text style={styles.pricePerMonth}>
            Soit {getPricePerMonth()} {currency}/mois
          </Text>
        )}
      </View>

      {trialAvailable && !isCurrent && (
View style={styles.trialContainer}>
          <Ionicons name="gift" size={16} color="#10B981" />
Text style={styles.trialText}>7 jours gratuits</Text>
        </View>
      )}

      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.slice(0, 4).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
Text style={styles.featureText}>{Text>
View>
          ))}
        </View>
      )}

View style={styles.footer}>
        {isCurrent ? (
View style={styles.currentButton}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.currentButtonText}>Actuellement actif</Text>
          </View>
        ) : (
          <LinearGradient
            colors={isBestValue ? ['#FFD700', '#FFA500'] : ['#5B7CFA', '#7D9AFC']}
            style={[styles.selectButton, disabled && styles.disabledButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.selectButtonText}>
              {trialAvailable ? 'Commencer l\'essai gratuit' : 'Choisir ce plan'}
            </Text>
          </LinearGradient>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  currentContainer: {
    borderColor: '#5B7CFA',
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
  },
  bestValueContainer: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bestValueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  currentTitle: {
    color: '#5B7CFA',
  },
  bestValueTitle: {
    color: '#FFD700',
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  currentPrice: {
    color: '#5B7CFA',
  },
  bestValuePrice: {
    color: '#FFD700',
  },
  period: {
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 4,
  },
  pricePerMonth: {
    fontSize: 14,
    color: '#64748B',
  },
  trialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  trialText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
  },
  currentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  currentButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
