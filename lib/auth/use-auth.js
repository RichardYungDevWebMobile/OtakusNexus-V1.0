// lib/auth/use-auth.js
/**
 *  * Hook personnalisé pour l'authentification
  * Fournit un accès simplifié au contexte d'authentification
   */

   import { useContext } from 'react';
   import { AuthContext } from './auth-context';

   export function useAuth() {
     const context = useContext(AuthContext);
       
         if (!context) {
             throw new Error('useAuth must be used within an AuthProvider');
               }
                 
                   return context;
                   }
 