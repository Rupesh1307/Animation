/**
 * @file mmkv-storage.ts
 *
 * Install:
 *   npm install react-native-mmkv react-native-nitro-modules
 *   cd ios && pod install
 *
  * Features:
  * - TypeScript-friendly API with typed getters/setters and custom hooks.
  * - Built-in encryption support with secure defaults.
  * - Flexible instance management: namespacing, batch operations, TTL, and more. 
 *
 * Requires: react-native-mmkv ^4.x  |  react-native >= 0.76  |  react >= 18
 */

import { useCallback, useEffect, useState } from 'react';
import {
  createMMKV,
  deleteMMKV,
  existsMMKV,
  useMMKV,
  useMMKVBoolean,
  useMMKVBuffer,
  useMMKVKeys,
  useMMKVListener,
  useMMKVNumber,
  useMMKVObject,
  useMMKVString,
  type MMKV,
} from 'react-native-mmkv';

// ─────────────────────────────────────────────────────────────────────────────
// RE-EXPORTS — built-in V4 hooks (pass-through for convenience)
// ─────────────────────────────────────────────────────────────────────────────
export {
  createMMKV,
  deleteMMKV,
  existsMMKV,
  useMMKV,
  useMMKVBoolean,
  useMMKVBuffer,
  useMMKVKeys,
  useMMKVListener,
  useMMKVNumber,
  useMMKVObject,
  useMMKVString,
};
export type { MMKV };

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEFAULT ENCRYPTION CONFIG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * App-wide encryption defaults applied to every storage instance.
 * Override per-instance by passing `encryptionKey` / `encryptionType`
 * to `getStorage()` or `createEncryptedStorage()`.
 *
 * ⚠️  In production, load the key from the device Keychain instead of
 *     hardcoding it here (e.g. expo-secure-store / react-native-keychain).
 */
export const DEFAULT_ENCRYPTION = {
  encryptionKey: 'Littlebit',
  encryptionType: 'AES-256' as const,
} satisfies { encryptionKey: string; encryptionType: 'AES-128' | 'AES-256' };

// ─────────────────────────────────────────────────────────────────────────────
// 2. STORAGE INSTANCES
// ─────────────────────────────────────────────────────────────────────────────

/** Global default storage instance — encrypted with DEFAULT_ENCRYPTION */
export const storage = createMMKV({
  id: 'mmkv.default',
  ...DEFAULT_ENCRYPTION,
});

/** Pre-built namespaced stores — all encrypted with DEFAULT_ENCRYPTION */
export const authStorage = createMMKV({ id: 'auth', ...DEFAULT_ENCRYPTION });
export const cacheStorage = createMMKV({ id: 'cache', ...DEFAULT_ENCRYPTION });
export const userPrefsStorage = createMMKV({
  id: 'user-prefs',
  ...DEFAULT_ENCRYPTION,
});

/**
 * Cached factory — returns the same MMKV instance for a given id.
 * Encryption defaults to DEFAULT_ENCRYPTION; pass your own
 * `encryptionKey` / `encryptionType` to override for that instance.
 *
 * @example
 * // Uses default key ("Littlebit") + AES-256
 * export const cartStorage = getStorage("cart");
 *
 * // Override with a user-specific key from Keychain
 * export const vaultStorage = getStorage("vault", { encryptionKey: keychainKey });
 */
const instanceCache = new Map<string, MMKV>();

export function getStorage(
  id: string,
  options?: {
    path?: string;
    encryptionKey?: string;
    encryptionType?: 'AES-128' | 'AES-256';
    mode?: 'single-process' | 'multi-process';
    readOnly?: boolean;
    compareBeforeSet?: boolean;
  },
): MMKV {
  if (!instanceCache.has(id)) {
    // Caller's options win; fall back to DEFAULT_ENCRYPTION for unset fields
    const encryptionKey =
      options?.encryptionKey ?? DEFAULT_ENCRYPTION.encryptionKey;
    const encryptionType =
      options?.encryptionType ?? DEFAULT_ENCRYPTION.encryptionType;
    instanceCache.set(
      id,
      createMMKV({ id, ...options, encryptionKey, encryptionType }),
    );
  }
  return instanceCache.get(id)!;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TYPED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

type Primitive = string | number | boolean;
type StorageValue = Primitive | object | ArrayBuffer | null;

/**
 * Set any serialisable value.
 * - Passing `null` **deletes** the key.
 * - Objects / arrays are JSON-stringified automatically.
 * - Returns `true` on success, `false` on serialisation error.
 */
export function setItem(
  key: string,
  value: StorageValue,
  store: MMKV = storage,
): boolean {
  try {
    if (value === null) {
      store.remove(key);
      return true;
    }
    if (typeof value === 'boolean') {
      store.set(key, value);
    } else if (typeof value === 'number') {
      store.set(key, value);
    } else if (typeof value === 'string') {
      store.set(key, value);
    } else if (value instanceof ArrayBuffer) {
      store.set(key, value);
    } else {
      store.set(key, JSON.stringify(value));
    }
    return true;
  } catch (e) {
    if (__DEV__) console.warn(`[MMKV] setItem error for key "${key}":`, e);
    return false;
  }
}

/**
 * Get a value with type inferred from `defaultValue`.
 * Falls back to `defaultValue` when the key is absent or cannot be deserialised.
 */
export function getItem<T extends StorageValue>(
  key: string,
  defaultValue: T,
  store: MMKV = storage,
): T {
  try {
    if (typeof defaultValue === 'boolean') {
      const v = store.getBoolean(key);
      return (v !== undefined ? v : defaultValue) as T;
    }
    if (typeof defaultValue === 'number') {
      const v = store.getNumber(key);
      return (v !== undefined ? v : defaultValue) as T;
    }
    if (defaultValue instanceof ArrayBuffer) {
      const v = store.getBuffer(key);
      return (v !== undefined ? v : defaultValue) as T;
    }
    const raw = store.getString(key);
    if (raw === undefined) return defaultValue;
    if (typeof defaultValue === 'string') return raw as T;
    return JSON.parse(raw) as T;
  } catch (e) {
    if (__DEV__) console.warn(`[MMKV] getItem error for key "${key}":`, e);
    return defaultValue;
  }
}

/** Delete a single key. Returns `true` if it existed. */
export function removeItem(key: string, store: MMKV = storage): boolean {
  return store.remove(key);
}

/** Returns `true` if the key exists in the store. */
export function hasItem(key: string, store: MMKV = storage): boolean {
  return store.contains(key);
}

/** List all keys, optionally filtered by prefix. */
export function listKeys(prefix?: string, store: MMKV = storage): string[] {
  const keys = store.getAllKeys();
  return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
}

/** Wipe all keys in a store. */
export function clearStorage(store: MMKV = storage): void {
  store.clearAll();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TTL (TIME-TO-LIVE) WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

interface TTLPayload<T> {
  value: T;
  expiresAt: number; // unix ms
}

const TTL_PREFIX = '__ttl__:';

/**
 * Store a value that auto-expires after `ttlMs` milliseconds.
 * Reading past expiry returns `defaultValue` and removes the entry.
 *
 * @example
 * setWithTTL("weather", { temp: 32 }, 5 * 60_000, cacheStorage);
 */
export function setWithTTL<T extends StorageValue>(
  key: string,
  value: T,
  ttlMs: number,
  store: MMKV = storage,
): boolean {
  const payload: TTLPayload<T> = { value, expiresAt: Date.now() + ttlMs };
  return setItem(TTL_PREFIX + key, payload, store);
}

export function getWithTTL<T extends StorageValue>(
  key: string,
  defaultValue: T,
  store: MMKV = storage,
): T {
  const ttlKey = TTL_PREFIX + key;
  const raw = store.getString(ttlKey);
  if (!raw) return defaultValue;
  try {
    const payload: TTLPayload<T> = JSON.parse(raw);
    if (Date.now() > payload.expiresAt) {
      store.remove(ttlKey);
      return defaultValue;
    }
    return payload.value;
  } catch {
    store.remove(ttlKey);
    return defaultValue;
  }
}

/** Returns remaining TTL in ms, or `null` if the key is absent / expired. */
export function getRemainingTTL(
  key: string,
  store: MMKV = storage,
): number | null {
  const raw = store.getString(TTL_PREFIX + key);
  if (!raw) return null;
  try {
    const { expiresAt }: TTLPayload<unknown> = JSON.parse(raw);
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BATCH OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

type BatchEntry = { key: string; value: StorageValue };

/** Write multiple key-value pairs in one pass. Returns `true` if all succeeded. */
export function batchSet(
  entries: BatchEntry[],
  store: MMKV = storage,
): boolean {
  return entries.every(({ key, value }) => setItem(key, value, store));
}

/** Read multiple keys at once. */
export function batchGet<T extends StorageValue>(
  keys: string[],
  defaultValue: T,
  store: MMKV = storage,
): Record<string, T> {
  return Object.fromEntries(
    keys.map(key => [key, getItem<T>(key, defaultValue, store)]),
  );
}

/** Delete multiple keys. Returns array of `true/false` per key. */
export function batchRemove(keys: string[], store: MMKV = storage): boolean[] {
  return keys.map(key => store.remove(key));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. NAMESPACE HELPER
// ─────────────────────────────────────────────────────────────────────────────

export interface NamespacedStorage {
  get<T extends StorageValue>(key: string, defaultValue: T): T;
  set(key: string, value: StorageValue): boolean;
  remove(key: string): boolean;
  has(key: string): boolean;
  keys(): string[];
  clear(): void;
}

/**
 * Creates a prefix-scoped view over any MMKV instance.
 * All keys are stored as `{prefix}:{key}` under the hood.
 *
 * @example
 * const cart = createNamespace("cart");
 * cart.set("items", [{ id: 1, qty: 2 }]);
 * cart.get("items", []);  // [{ id: 1, qty: 2 }]
 * cart.clear();           // removes only cart: keys
 */
export function createNamespace(
  prefix: string,
  store: MMKV = storage,
): NamespacedStorage {
  const k = (key: string) => `${prefix}:${key}`;
  return {
    get: (key, defaultValue) => getItem(k(key), defaultValue, store),
    set: (key, value) => setItem(k(key), value, store),
    remove: key => store.remove(k(key)),
    has: key => store.contains(k(key)),
    keys: () =>
      store
        .getAllKeys()
        .filter(raw => raw.startsWith(`${prefix}:`))
        .map(raw => raw.slice(prefix.length + 1)),
    clear: () =>
      store
        .getAllKeys()
        .filter(raw => raw.startsWith(`${prefix}:`))
        .forEach(raw => store.remove(raw)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ENCRYPTION HELPERS  (V4 API: .encrypt() / .decrypt())
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encrypt an existing store in place.
 * Load `encryptionKey` from the device Keychain — NEVER hardcode it.
 *
 * @example
 * const key = await SecureStore.getItemAsync("mmkv_key");
 * encryptStorage(storage, key!);
 */
export function encryptStorage(
  store: MMKV,
  encryptionKey: string,
  algorithm: 'AES-128' | 'AES-256' = 'AES-256',
): void {
  store.encrypt(encryptionKey, algorithm);
}

/** Remove encryption from a store. */
export function decryptStorage(store: MMKV): void {
  store.decrypt();
}

/**
 * Create a new MMKV instance that is encrypted from the start.
 * Falls back to `DEFAULT_ENCRYPTION` when arguments are omitted,
 * so calling `createEncryptedStorage("vault")` uses "Littlebit" + AES-256.
 *
 * @example
 * // Default key
 * const vault = createEncryptedStorage("vault");
 *
 * // Custom key from Keychain (overrides default)
 * const key = await SecureStore.getItemAsync("vault_key");
 * const vault = createEncryptedStorage("vault", key!);
 */
export function createEncryptedStorage(
  id: string,
  encryptionKey: string = DEFAULT_ENCRYPTION.encryptionKey,
  encryptionType: 'AES-128' | 'AES-256' = DEFAULT_ENCRYPTION.encryptionType,
): MMKV {
  return getStorage(id, { encryptionKey, encryptionType });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. STORAGE MANAGEMENT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trims a store's memory footprint. Call when `store.size >= threshold`.
 *
 * @example
 * if (cacheStorage.size >= 4096) trimStorage(cacheStorage);
 */
export function trimStorage(store: MMKV = storage): void {
  store.trim();
}

/**
 * Returns the store's current disk size in bytes.
 */
export function getStorageSize(store: MMKV = storage): number {
  return store.size;
}

/**
 * Import every key from `source` into `target`.
 * Returns the number of imported keys.
 *
 * @example
 * const count = importAll(legacyStorage, storage);
 */
export function importAll(source: MMKV, target: MMKV): number {
  return target.importAllFrom(source);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. INSTANCE LIFECYCLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether an MMKV instance file exists on disk.
 *
 * @example
 * if (!checkExists("user-123")) { // first launch for this user }
 */
export function checkExists(id: string): boolean {
  return existsMMKV(id);
}

/**
 * Permanently delete an MMKV instance and its file from disk.
 * Returns `true` if successfully deleted.
 *
 * @example
 * deleteStorage("user-123-storage"); // on account deletion
 */
export function deleteStorage(id: string): boolean {
  instanceCache.delete(id);
  return deleteMMKV(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. MIGRATION UTILITY
// ─────────────────────────────────────────────────────────────────────────────

interface MigrationMap {
  [fromKey: string]: string; // oldKey → newKey
}

/**
 * Rename / move keys between stores (v1 → v2 schema upgrades).
 * Old keys are removed after a successful copy.
 *
 * @example
 * migrateKeys(
 *   { token: "auth:accessToken", refresh: "auth:refreshToken" },
 *   oldStorage,
 *   authStorage
 * );
 */
export function migrateKeys(
  migrationMap: MigrationMap,
  fromStore: MMKV = storage,
  toStore: MMKV = storage,
): { migrated: string[]; skipped: string[] } {
  const migrated: string[] = [];
  const skipped: string[] = [];

  for (const [from, to] of Object.entries(migrationMap)) {
    if (!fromStore.contains(from)) {
      skipped.push(from);
      continue;
    }
    const raw = fromStore.getString(from);
    if (raw !== undefined) {
      toStore.set(to, raw);
      fromStore.remove(from);
      migrated.push(from);
    } else {
      skipped.push(from);
    }
  }

  return { migrated, skipped };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. CUSTOM HOOKS (composing the built-in V4 hooks)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `useMMKVState` — a generic typed hook that persists any JSON-serialisable
 * value to MMKV. For primitive types prefer the purpose-built hooks
 * (`useMMKVString`, `useMMKVNumber`, `useMMKVBoolean`) which are re-exported
 * above and use MMKV's native typed getters internally.
 *
 * Setting the value to `undefined` removes the key from storage.
 *
 * @example
 * const [cart, setCart] = useMMKVState<CartItem[]>("cart", [], cartStorage);
 */
export function useMMKVState<T>(
  key: string,
  defaultValue: T,
  store: MMKV = storage,
): [T, (value: T | ((prev: T) => T) | undefined) => void] {
  const [state, setState] = useState<T>(() => {
    const raw = store.getString(key);
    if (raw === undefined) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    const sub = store.addOnValueChangedListener(changedKey => {
      if (changedKey !== key) return;
      const raw = store.getString(key);
      if (raw === undefined) {
        setState(defaultValue);
      } else {
        try {
          setState(JSON.parse(raw) as T);
        } catch {
          setState(defaultValue);
        }
      }
    });
    return () => sub.remove();
  }, [key, store]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T) | undefined) => {
      setState(prev => {
        const next =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (p: T) => T)(prev)
            : valueOrUpdater;
        if (next === undefined) {
          store.remove(key);
          return defaultValue;
        }
        store.set(key, JSON.stringify(next));
        return next;
      });
    },
    [key, store], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [state, setValue];
}

/**
 * `useMMKVDelete` — returns a stable callback to remove a specific key.
 *
 * @example
 * const clearToken = useMMKVDelete("access_token", authStorage);
 */
export function useMMKVDelete(
  key: string,
  store: MMKV = storage,
): () => boolean {
  return useCallback(() => store.remove(key), [key, store]);
}

/**
 * `useStorageSize` — reactively tracks a store's disk size in bytes.
 * Re-evaluates whenever any key in the store changes.
 *
 * @example
 * const bytes = useStorageSize(cacheStorage);
 */
export function useStorageSize(store: MMKV = storage): number {
  const [size, setSize] = useState(() => store.size);

  useEffect(() => {
    const sub = store.addOnValueChangedListener(() => setSize(store.size));
    return () => sub.remove();
  }, [store]);

  return size;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. DEBUG / DEV UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a plain-object snapshot of all keys in a store. Dev builds only. */
export function dumpStorage(
  store: MMKV = storage,
): Record<string, string | undefined> {
  if (!__DEV__) return {};
  return Object.fromEntries(
    store.getAllKeys().map(key => [key, store.getString(key)]),
  );
}

/** Prints all keys and values to the console. Dev builds only. */
export function logStorage(store: MMKV = storage, label = 'MMKV'): void {
  if (!__DEV__) return;
  console.group(`[${label}] Storage dump (${store.size} bytes)`);
  store.getAllKeys().forEach(key => {
    console.log(`  ${key} →`, store.getString(key));
  });
  console.groupEnd();
}
