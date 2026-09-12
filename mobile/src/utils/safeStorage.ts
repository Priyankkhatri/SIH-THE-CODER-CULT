import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback map for instant synchronous access & zero crash resilience
const memoryStorage = new Map<string, string>();

class SafeStorage {
  private writeQueue: Promise<void> = Promise.resolve();

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return memoryStorage.get(key) ?? null;
      }
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    // Keep in-memory cache instantly in sync
    memoryStorage.set(key, value);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(key, value);
        } catch {
          // Quota exceeded or private browsing fallback
        }
      }
      return Promise.resolve();
    }

    // Native mobile: Chain writes sequentially to prevent storage collisions
    this.writeQueue = this.writeQueue
      .then(async () => {
        await AsyncStorage.setItem(key, value);
      })
      .catch((err) => {
        console.warn(`[SafeStorage] Persist to disk failed for "${key}", preserved in memory:`, err?.message || err);
      });

    return this.writeQueue;
  }

  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.removeItem(key);
        } catch {}
      }
      return Promise.resolve();
    }

    this.writeQueue = this.writeQueue
      .then(async () => {
        await AsyncStorage.removeItem(key);
      })
      .catch(() => {});

    return this.writeQueue;
  }

  async clear(): Promise<void> {
    memoryStorage.clear();

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.clear();
        } catch {}
      }
      return Promise.resolve();
    }

    this.writeQueue = this.writeQueue
      .then(async () => {
        await AsyncStorage.clear();
      })
      .catch(() => {});

    return this.writeQueue;
  }
}

export const safeStorage = new SafeStorage();
export default safeStorage;
