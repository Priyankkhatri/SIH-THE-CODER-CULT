// Web-specific SafeStorage: Uses window.localStorage & memory fallback with zero native module dependencies.
const memoryStorage = new Map<string, string>();

class WebSafeStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) return item;
      }
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    memoryStorage.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Quota exceeded or private browsing fallback
    }
    return Promise.resolve();
  }

  async removeItem(key: string): Promise<void> {
    memoryStorage.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
    return Promise.resolve();
  }

  async clear(): Promise<void> {
    memoryStorage.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {}
    return Promise.resolve();
  }
}

export const safeStorage = new WebSafeStorage();
export default safeStorage;
