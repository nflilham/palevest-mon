import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'palevest_supabase_config';

let supabaseInstance = null;
let currentConfigInfo = {
  configured: false,
  url: '',
  source: 'none',
};

function readRuntimeConfig() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.url === 'string' &&
      typeof parsed.anonKey === 'string' &&
      parsed.url.trim().startsWith('https://') &&
      parsed.anonKey.trim().length > 20
    ) {
      return {
        url: parsed.url.trim(),
        anonKey: parsed.anonKey.trim(),
      };
    }
  } catch {
    return null;
  }
  return null;
}

function readEnvConfig() {
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  const url = typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : '';
  const anonKey =
    typeof env.VITE_SUPABASE_ANON_KEY === 'string' ? env.VITE_SUPABASE_ANON_KEY.trim() : '';

  const isPlaceholder =
    !url ||
    !anonKey ||
    url.includes('your-project-id') ||
    url.includes('example.supabase.co') ||
    anonKey.includes('your-anon-key');

  if (!isPlaceholder && url.startsWith('https://') && anonKey.length > 20) {
    return { url, anonKey };
  }
  return null;
}

function initSupabaseClient() {
  const envCfg = readEnvConfig();
  const runtimeCfg = readRuntimeConfig();

  // Prioritaskan runtime config jika pengguna menyetel langsung dari modal UI,
  // atau gunakan env config bila tersedia.
  const chosen = runtimeCfg || envCfg;
  const source = runtimeCfg ? 'runtime' : envCfg ? 'env' : 'none';

  if (!chosen) {
    supabaseInstance = null;
    currentConfigInfo = {
      configured: false,
      url: '',
      source: 'none',
    };
    return null;
  }

  try {
    supabaseInstance = createClient(chosen.url, chosen.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'palevest_supabase_auth',
      },
    });
    currentConfigInfo = {
      configured: true,
      url: chosen.url,
      source,
    };
  } catch {
    supabaseInstance = null;
    currentConfigInfo = {
      configured: false,
      url: '',
      source: 'none',
    };
  }

  return supabaseInstance;
}

// Inisialisasi saat modul dimuat
initSupabaseClient();

export function getSupabase() {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

export function isSupabaseConfigured() {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return Boolean(supabaseInstance && currentConfigInfo.configured);
}

export function getSupabaseConfigInfo() {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return { ...currentConfigInfo };
}

export function setRuntimeSupabaseConfig(url, anonKey) {
  const cleanUrl = typeof url === 'string' ? url.trim() : '';
  const cleanKey = typeof anonKey === 'string' ? anonKey.trim() : '';

  if (typeof window !== 'undefined' && window.localStorage) {
    if (!cleanUrl || !cleanKey) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          url: cleanUrl,
          anonKey: cleanKey,
          updatedAt: new Date().toISOString(),
        })
      );
    }
  }

  initSupabaseClient();
  return getSupabaseConfigInfo();
}

export function clearRuntimeSupabaseConfig() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  initSupabaseClient();
  return getSupabaseConfigInfo();
}
