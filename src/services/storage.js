// Lightweight AsyncStorage wrapper with safe fallback for environments where async-storage is missing.
let AsyncStorage;
try {
  // prefer community async-storage if available
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // fallback to in-memory store (useful for web or quick testing)
  const store = {};
  AsyncStorage = {
    getItem: async (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: async (k, v) => {
      store[k] = v;
      return null;
    },
    removeItem: async (k) => {
      delete store[k];
      return null;
    },
    getAllKeys: async () => Object.keys(store),
  };
}

/**
 * getItem - parse JSON value or return null
 */
export async function getItem(key) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

/**
 * setItem - stringify value
 */
export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
