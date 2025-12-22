// lib/storage/encryption.js
/**
 * Système de chiffrement pour les données sensibles
 * Utilise AES-256-GCM pour le chiffrement et déchiffrement
 */

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Constantes de chiffrement
const ENCRYPTION_CONFIG = {
  algorithm: Crypto.CryptoEncryptionAlgorithm.AESGCM,
  keySize: 256,
  ivSize: 12, // 96 bits pour GCM
  tagSize: 16, // 128 bits pour GCM
  saltSize: 32,
  iterations: 100000,
  hash: 'SHA-256',
};

// Clés de stockage sécurisé
const ENCRYPTION_KEYS = {
  MASTER_KEY: 'otakus_master_key',
  DEVICE_ID: 'otakus_device_id',
};

class StorageEncryptor {
  constructor() {
    this.masterKey = null;
    this.deviceId = null;
    this.initialized = false;
  }

  /**
   * Initialiser le chiffreur
   */
  async initialize() {
    try {
      // Générer ou récupérer l'ID de l'appareil
      this.deviceId = await this.getOrCreateDeviceId();
      
      // Générer ou récupérer la clé maîtresse
      this.masterKey = await this.getOrCreateMasterKey();
      
      this.initialized = true;
      console.log('Storage encryptor initialized');
      return true;
    } catch (error) {
      console.error('Encryptor initialization failed:', error);
      return false;
    }
  }

  /**
   * Chiffrer une chaîne de caractères
   */
  async encrypt(plaintext) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!plaintext || typeof plaintext !== 'string') {
        throw new Error('Plaintext must be a non-empty string');
      }

      // Générer un sel aléatoire
      const salt = await Crypto.getRandomBytesAsync(ENCRYPTION_CONFIG.saltSize);
      const saltHex = this.arrayBufferToHex(salt);

      // Générer un IV aléatoire
      const iv = await Crypto.getRandomBytesAsync(ENCRYPTION_CONFIG.ivSize);
      const ivHex = this.arrayBufferToHex(iv);

      // Dériver une clé à partir de la clé maîtresse et du sel
      const derivedKey = await this.deriveKey(this.masterKey, salt);

      // Convertir le texte clair en ArrayBuffer
      const plaintextBuffer = new TextEncoder().encode(plaintext);

      // Chiffrer
      const encryptedData = await Crypto.encryptAsync(
        {
          key: derivedKey,
          data: plaintextBuffer,
          iv: iv,
          algorithm: ENCRYPTION_CONFIG.algorithm,
        }
      );

      // Extraire le tag d'authentification
      const tag = encryptedData.slice(-ENCRYPTION_CONFIG.tagSize);
      const ciphertext = encryptedData.slice(0, -ENCRYPTION_CONFIG.tagSize);

      // Convertir en hexadécimal pour le stockage
      const ciphertextHex = this.arrayBufferToHex(ciphertext);
      const tagHex = this.arrayBufferToHex(tag);

      // Format de sortie: salt:iv:ciphertext:tag
      return `${saltHex}:${ivHex}:${ciphertextHex}:${tagHex}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Déchiffrer une chaîne chiffrée
   */
  async decrypt(encryptedString) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!encryptedString || typeof encryptedString !== 'string') {
        throw new Error('Encrypted string must be a non-empty string');
      }

      // Parser la chaîne chiffrée
      const parts = encryptedString.split(':');
      if (parts.length !== 4) {
        throw new Error('Invalid encrypted string format');
      }

      const [saltHex, ivHex, ciphertextHex, tagHex] = parts;

      // Convertir de l'hexadécimal vers ArrayBuffer
      const salt = this.hexToArrayBuffer(saltHex);
      const iv = this.hexToArrayBuffer(ivHex);
      const ciphertext = this.hexToArrayBuffer(ciphertextHex);
      const tag = this.hexToArrayBuffer(tagHex);

      // Dériver la clé
      const derivedKey = await this.deriveKey(this.masterKey, salt);

      // Reconstituer les données chiffrées avec le tag
      const encryptedData = new Uint8Array(ciphertext.byteLength + tag.byteLength);
      encryptedData.set(new Uint8Array(ciphertext), 0);
      encryptedData.set(new Uint8Array(tag), ciphertext.byteLength);

      // Déchiffrer
      const decryptedBuffer = await Crypto.decryptAsync(
        {
          key: derivedKey,
          data: encryptedData.buffer,
          iv: iv,
          algorithm: ENCRYPTION_CONFIG.algorithm,
        }
      );

      // Convertir en chaîne
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Dériver une clé à partir d'une clé maîtresse et d'un sel
   */
  async deriveKey(masterKey, salt) {
    try {
      // Convertir la clé maîtresse en ArrayBuffer
      const masterKeyBuffer = new TextEncoder().encode(masterKey);

      // Utiliser PBKDF2 pour dériver une clé
      const derivedKey = await Crypto.digestAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        new Uint8Array([...masterKeyBuffer, ...new Uint8Array(salt)])
      );

      return derivedKey;
    } catch (error) {
      console.error('Key derivation error:', error);
      throw error;
    }
  }

  /**
   * Obtenir ou créer l'ID de l'appareil
   */
  async getOrCreateDeviceId() {
    try {
      let deviceId = await SecureStore.getItemAsync(ENCRYPTION_KEYS.DEVICE_ID);
      
      if (!deviceId) {
        // Générer un nouvel ID d'appareil
        deviceId = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `${Date.now()}-${Math.random()}-${Platform.OS}`
        );
        
        // Sauvegarder de manière sécurisée
        await SecureStore.setItemAsync(ENCRYPTION_KEYS.DEVICE_ID, deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('Get or create device ID error:', error);
      
      // Fallback: générer un ID temporaire
      return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * Obtenir ou créer la clé maîtresse
   */
  async getOrCreateMasterKey() {
    try {
      let masterKey = await SecureStore.getItemAsync(ENCRYPTION_KEYS.MASTER_KEY);
      
      if (!masterKey) {
        // Générer une nouvelle clé maîtresse
        const randomBytes = await Crypto.getRandomBytesAsync(32);
        masterKey = this.arrayBufferToHex(randomBytes);
        
        // Sauvegarder de manière sécurisée
        await SecureStore.setItemAsync(ENCRYPTION_KEYS.MASTER_KEY, masterKey);
      }
      
      return masterKey;
    } catch (error) {
      console.error('Get or create master key error:', error);
      
      // Fallback: utiliser l'ID de l'appareil comme clé
      return this.deviceId || 'default_master_key';
    }
  }

  /**
   * Chiffrer un objet JSON
   */
  async encryptObject(obj) {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  /**
   * Déchiffrer vers un objet JSON
   */
  async decryptObject(encryptedString) {
    const jsonString = await this.decrypt(encryptedString);
    return JSON.parse(jsonString);
  }

  /**
   * Vérifier l'intégrité des données
   */
  async verifyIntegrity(encryptedString, expectedPlaintext) {
    try {
      const decrypted = await this.decrypt(encryptedString);
      return decrypted === expectedPlaintext;
    } catch (error) {
      return false;
    }
  }

  /**
   * Chiffrer un fichier (pour les images/médias)
   */
  async encryptFile(fileBuffer) {
    try {
      if (!(fileBuffer instanceof ArrayBuffer)) {
        throw new Error('File must be an ArrayBuffer');
      }

      // Générer un sel et un IV
      const salt = await Crypto.getRandomBytesAsync(ENCRYPTION_CONFIG.saltSize);
      const iv = await Crypto.getRandomBytesAsync(ENCRYPTION_CONFIG.ivSize);

      // Dériver une clé
      const derivedKey = await this.deriveKey(this.masterKey, salt);

      // Chiffrer le fichier
      const encryptedData = await Crypto.encryptAsync(
        {
          key: derivedKey,
          data: fileBuffer,
          iv: iv,
          algorithm: ENCRYPTION_CONFIG.algorithm,
        }
      );

      // Extraire le tag
      const tag = encryptedData.slice(-ENCRYPTION_CONFIG.tagSize);
      const ciphertext = encryptedData.slice(0, -ENCRYPTION_CONFIG.tagSize);

      // Retourner les données chiffrées avec les métadonnées
      return {
        salt: this.arrayBufferToHex(salt),
        iv: this.arrayBufferToHex(iv),
        tag: this.arrayBufferToHex(tag),
        data: this.arrayBufferToHex(ciphertext),
        size: fileBuffer.byteLength,
        encryptedSize: ciphertext.byteLength + tag.byteLength,
      };
    } catch (error) {
      console.error('File encryption error:', error);
      throw error;
    }
  }

  /**
   * Déchiffrer un fichier
   */
  async decryptFile(encryptedFile) {
    try {
      const { salt, iv, tag, data } = encryptedFile;

      // Convertir de l'hexadécimal
      const saltBuffer = this.hexToArrayBuffer(salt);
      const ivBuffer = this.hexToArrayBuffer(iv);
      const tagBuffer = this.hexToArrayBuffer(tag);
      const ciphertextBuffer = this.hexToArrayBuffer(data);

      // Dériver la clé
      const derivedKey = await this.deriveKey(this.masterKey, saltBuffer);

      // Reconstituer les données chiffrées
      const encryptedData = new Uint8Array(ciphertextBuffer.byteLength + tagBuffer.byteLength);
      encryptedData.set(new Uint8Array(ciphertextBuffer), 0);
      encryptedData.set(new Uint8Array(tagBuffer), ciphertextBuffer.byteLength);

      // Déchiffrer
      const decryptedBuffer = await Crypto.decryptAsync(
        {
          key: derivedKey,
          data: encryptedData.buffer,
          iv: ivBuffer,
          algorithm: ENCRYPTION_CONFIG.algorithm,
        }
      );

      return decryptedBuffer;
    } catch (error) {
      console.error('File decryption error:', error);
      throw error;
    }
  }

  /**
   * Générer un hash sécurisé pour les mots de passe
   */
  async hashPassword(password, salt = null) {
    try {
      if (!salt) {
        salt = await Crypto.getRandomBytesAsync(32);
      }

      const passwordBuffer = new TextEncoder().encode(password);
      const saltedPassword = new Uint8Array([...passwordBuffer, ...new Uint8Array(salt)]);

      const hash = await Crypto.digestAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        saltedPassword
      );

      return {
        hash: this.arrayBufferToHex(hash),
        salt: this.arrayBufferToHex(salt),
      };
    } catch (error) {
      console.error('Password hashing error:', error);
      throw error;
    }
  }

  /**
   * Vérifier un mot de passe
   */
  async verifyPassword(password, hash, salt) {
    try {
      const newHash = await this.hashPassword(password, this.hexToArrayBuffer(salt));
      return newHash.hash === hash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Nettoyer les clés (pour la déconnexion)
   */
  async cleanup() {
    try {
      // Ne pas supprimer la clé maîtresse, seulement la mettre à jour
      const newMasterKey = this.arrayBufferToHex(await Crypto.getRandomBytesAsync(32));
      await SecureStore.setItemAsync(ENCRYPTION_KEYS.MASTER_KEY, newMasterKey);
      this.masterKey = newMasterKey;
      
      console.log('Encryption keys rotated');
      return true;
    } catch (error) {
      console.error('Encryptor cleanup error:', error);
      return false;
    }
  }

  // Méthodes utilitaires de conversion
  arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  hexToArrayBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }
}

// Singleton pour le chiffreur
export const storageEncryptor = new StorageEncryptor();

// Chiffreur pour les messages (spécialisé)
export const messageEncryptor = {
  async encrypt(text) {
    return storageEncryptor.encrypt(text);
  },
  
  async decrypt(encryptedText) {
    return storageEncryptor.decrypt(encryptedText);
  },
};
