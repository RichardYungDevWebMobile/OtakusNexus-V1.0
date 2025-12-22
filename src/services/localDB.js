import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = '@OtakusNexus:';

const localDB = {
  async set(key, value) {
    try {
      const v = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(prefix + key, v);
      return true;
    } catch (e) {
      console.warn('localDB set error', e);
      return false;
    }
  },

  async get(key, defaultValue = null) {
    try {
      const v = await AsyncStorage.getItem(prefix + key);
      if (v === null) return defaultValue;
      try {
        return JSON.parse(v);
      } catch (_) {
        return v;
      }
    } catch (e) {
      console.warn('localDB get error', e);
      return defaultValue;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(prefix + key);
      return true;
    } catch (e) {
      console.warn('localDB remove error', e);
      return false;
    }
  },

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((k) => k.startsWith(prefix));
      await AsyncStorage.multiRemove(appKeys);
      return true;
    } catch (e) {
      console.warn('localDB clear error', e);
      return false;
    }
  },
};

export default localDB;
