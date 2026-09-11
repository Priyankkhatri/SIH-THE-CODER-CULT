import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback map for instant synchronous access & zero crash resilience
const memoryStorage = new Map<string, string>();

class SafeStorage {
  private writeQueue: Promise<void> = Promise.resolve();

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) return item;
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

    // Chain writes sequentially to prevent IndexedDB transaction collisions
    this.writeQueue = this.writeQueue
      .then(async () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(key, value);
            return;
          } catch {
            // fallback if quota exceeded
          }
        }
        await AsyncStorage.setItem(key, value);
      })
      .catch((err) => {
        console.warn(`[SafeStorage] Persist to disk failed for "${key}", preserved in memory:`, err?.message || err);
      });

    return this.writeQueue;
  }

  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);
    this.writeQueue = this.writeQueue
      .then(async () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.removeItem(key);
            return;
          } catch {}
        }
        await AsyncStorage.removeItem(key);
      })
      .catch(() => {});

    return this.writeQueue;
  }

  async clear(): Promise<void> {
    memoryStorage.clear();
    this.writeQueue = this.writeQueue
      .then(async () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.clear();
            return;
          } catch {}
        }
        await AsyncStorage.clear();
      })
      .catch(() => {});

    return this.writeQueue;
  }
}

export const safeStorage = new SafeStorage();
export default safeStorage;
