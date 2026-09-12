import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback map for instant synchronous access & zero crash resilience
const memoryStorage = new Map<string, string>();

class NativeSafeStorage {
  private writeQueue: Promise<void> = Promise.resolve();

  async getItem(key: string): Promise<string | null> {
    try {
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

    // Chain writes sequentially to prevent storage collisions
    this.writeQueue = this.writeQueue
      .then(async () => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch {
          // Gracefully preserved in memoryStorage
        }
      })
      .catch(() => {});

    return this.writeQueue;
  }

  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);
    this.writeQueue = this.writeQueue
      .then(async () => {
        try {
          await AsyncStorage.removeItem(key);
        } catch {}
      })
      .catch(() => {});

    return this.writeQueue;
  }

  async clear(): Promise<void> {
    memoryStorage.clear();
    this.writeQueue = this.writeQueue
      .then(async () => {
        try {
          await AsyncStorage.clear();
        } catch {}
      })
      .catch(() => {});

    return this.writeQueue;
  }
}

export const safeStorage = new NativeSafeStorage();
export default safeStorage;
