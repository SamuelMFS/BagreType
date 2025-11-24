/**
 * IndexedDB utility for caching generated layouts and outputs
 */

const DB_NAME = 'BagreTypeCache';
const DB_VERSION = 1;
const STORE_NAME = 'generatedLayouts';

interface CachedLayout {
  id: string;
  corpus: string;
  corpusHash: string;
  layout: string;
  timestamp: number;
  metadata?: {
    generations?: number;
    population?: number;
    mutationRate?: number;
    crossoverRate?: number;
  };
}

/**
 * Open IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('corpusHash', 'corpusHash', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Generate a hash from corpus text for caching
 */
export function hashCorpus(corpus: string): string {
  let hash = 0;
  for (let i = 0; i < corpus.length; i++) {
    const char = corpus.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cached layout for a corpus
 */
export async function getCachedLayout(corpus: string): Promise<CachedLayout | null> {
  try {
    const db = await openDB();
    const corpusHash = hashCorpus(corpus);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('corpusHash');
      const request = index.get(corpusHash);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result || null);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached layout:', error);
    return null;
  }
}

/**
 * Cache a generated layout
 */
export async function cacheLayout(
  corpus: string,
  layout: string,
  metadata?: CachedLayout['metadata']
): Promise<void> {
  try {
    const db = await openDB();
    const corpusHash = hashCorpus(corpus);
    const id = `${corpusHash}_${Date.now()}`;
    
    const cachedLayout: CachedLayout = {
      id,
      corpus: corpus.substring(0, 1000), // Store first 1000 chars for reference
      corpusHash,
      layout,
      timestamp: Date.now(),
      metadata,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(cachedLayout);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error caching layout:', error);
  }
}

/**
 * Get all cached layouts
 */
export async function getAllCachedLayouts(): Promise<CachedLayout[]> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting all cached layouts:', error);
    return [];
  }
}

/**
 * Clear all cached layouts
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache size (approximate)
 */
export async function getCacheSize(): Promise<number> {
  try {
    const layouts = await getAllCachedLayouts();
    return layouts.length;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}

