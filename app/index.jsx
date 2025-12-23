// app/index.jsx
/**
 *  * Page d'accueil avec redirection intelligente
  * Vérifie l'état d'authentification et redirige vers l'écran approprié
   */

   import { useEffect } from 'react';
   import { Redirect } from 'expo-router';
   import { View, ActivityIndicator } from 'react-native';
   import { useAuth } from '../lib/auth/use-auth';

   export default function Index() {
     const { user, loading } = useAuth();

       // Écran de chargement pendant la vérification d'authentification
         if (loading) {
             return (
                   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                           <ActivityIndicator size="large" color="#5B7CFA" />
                                 </View>
                                     );
                                       }

                                         // Redirection basée sur l'état d'authentification
                                           if (!user) {
                                               // Non authentifié → redirection vers l'authentification
                                                   return <Redirect href="/(auth)/login" />;
                                                     }

                                                       // Authentifié → redirection vers l'onglet principal
                                                         return <Redirect href="/(tabs)/nexus" />;
                                                         }
