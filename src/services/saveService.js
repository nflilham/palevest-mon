import { getSupabase, isSupabaseConfigured } from './supabaseClient.js';

const LOCAL_SAVE_KEY = 'palevest_local_save';
const GUEST_SESSION_KEY = 'palevest_guest_session';

let currentSupabaseUser = null;
let authSubscription = null;
const authSubscribers = new Set();

function readGuestSession() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(GUEST_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.active) {
      return {
        username: (parsed.username || 'Petani').trim(),
        farmName: (parsed.farmName || 'Kebun Lembah').trim(),
        email: parsed.email || 'tamu@palevest.local',
        startedAt: parsed.startedAt || new Date().toISOString(),
      };
    }
  } catch {
    return null;
  }
  return null;
}

function writeGuestSession(guestData) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (!guestData) {
    window.localStorage.removeItem(GUEST_SESSION_KEY);
    return;
  }
  window.localStorage.setItem(
    GUEST_SESSION_KEY,
    JSON.stringify({
      active: true,
      username: (guestData.username || 'Petani').trim(),
      farmName: (guestData.farmName || 'Kebun Lembah').trim(),
      email: 'tamu@palevest.local',
      startedAt: new Date().toISOString(),
    })
  );
}

function readLocalSaveRaw() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocalSaveRaw(payload) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(payload));
  } catch {
    // Abaikan jika kuota penyimpanan penuh
  }
}

function notifyAuthSubscribers() {
  const state = getAuthState();
  authSubscribers.forEach((cb) => {
    try {
      cb(state);
    } catch {
      // Abaikan error callback individual
    }
  });
}

export function getAuthState() {
  const guest = readGuestSession();

  if (currentSupabaseUser && currentSupabaseUser.id) {
    const meta = currentSupabaseUser.user_metadata || {};
    const localSave = readLocalSaveRaw();
    const username =
      meta.username ||
      meta.display_name ||
      (localSave && localSave.username) ||
      (currentSupabaseUser.email ? currentSupabaseUser.email.split('@')[0] : 'Petani');
    const farmName =
      meta.farm_name ||
      meta.farmName ||
      (localSave && (localSave.farm_name || localSave.farmName)) ||
      'Kebun Lembah';

    return {
      user: currentSupabaseUser,
      isAuthenticated: true,
      isGuest: false,
      mode: 'supabase',
      profile: {
        username,
        farmName,
        email: currentSupabaseUser.email || '',
      },
    };
  }

  if (guest) {
    return {
      user: {
        id: 'guest-farmer',
        email: guest.email,
        user_metadata: {
          username: guest.username,
          farm_name: guest.farmName,
        },
      },
      isAuthenticated: false,
      isGuest: true,
      mode: 'guest',
      profile: {
        username: guest.username,
        farmName: guest.farmName,
        email: guest.email,
      },
    };
  }

  return {
    user: null,
    isAuthenticated: false,
    isGuest: false,
    mode: 'none',
    profile: {
      username: 'Petani',
      farmName: 'Kebun Lembah',
      email: '',
    },
  };
}

export async function initAuthListener(onChange) {
  if (typeof onChange === 'function') {
    authSubscribers.add(onChange);
  }

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data && data.session && data.session.user) {
        currentSupabaseUser = data.session.user;
      } else {
        currentSupabaseUser = null;
      }
    } catch {
      currentSupabaseUser = null;
    }

    if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
      authSubscription.unsubscribe();
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      currentSupabaseUser = session && session.user ? session.user : null;
      notifyAuthSubscribers();
    });

    authSubscription = listener && listener.subscription ? listener.subscription : null;
  } else {
    currentSupabaseUser = null;
  }

  const state = getAuthState();
  if (typeof onChange === 'function') {
    onChange(state);
  }
  return state;
}

export async function signUpUser({ email, password, username, farmName }) {
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanPassword = typeof password === 'string' ? password : '';
  const cleanUsername = typeof username === 'string' && username.trim() ? username.trim() : 'Petani';
  const cleanFarmName =
    typeof farmName === 'string' && farmName.trim() ? farmName.trim() : 'Kebun Lembah';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      ok: false,
      error: 'Masukkan alamat email yang valid untuk mendaftar.',
    };
  }

  if (cleanPassword.length < 6) {
    return {
      ok: false,
      error: 'Kata sandi minimal harus terdiri dari 6 karakter.',
    };
  }

  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    writeGuestSession({
      username: cleanUsername,
      farmName: cleanFarmName,
      email: cleanEmail,
    });
    notifyAuthSubscribers();
    return {
      ok: true,
      user: getAuthState().user,
      requiresConfirmation: false,
      authState: getAuthState(),
      message: `Selamat datang di Palevest, ${cleanUsername}.`,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          username: cleanUsername,
          farm_name: cleanFarmName,
        },
      },
    });

    if (error) {
      return {
        ok: false,
        error: translateAuthError(error.message),
      };
    }

    const user = data && data.user ? data.user : null;
    if (user) {
      currentSupabaseUser = user;
      writeGuestSession(null);
    }

    const initialSnapshot = {
      username: cleanUsername,
      farmName: cleanFarmName,
      day: 1,
      season: 'Semi',
      gold: 500,
      energy: 100,
      maxEnergy: 100,
      updatedAt: new Date().toISOString(),
    };

    writeLocalSaveRaw({
      ...initialSnapshot,
      farm_name: cleanFarmName,
      max_energy: 100,
      game_state: initialSnapshot,
      updated_at: initialSnapshot.updatedAt,
    });

    if (user && data.session) {
      try {
        await supabase.from('player_saves').upsert(
          {
            user_id: user.id,
            email: user.email || cleanEmail,
            username: cleanUsername,
            farm_name: cleanFarmName,
            day: 1,
            season: 'Semi',
            gold: 500,
            energy: 100,
            max_energy: 100,
            game_state: initialSnapshot,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      } catch {
        // Jika tabel belum dibuat di Supabase, simpan lokal tetap aman
      }
    }

    notifyAuthSubscribers();

    const requiresConfirmation = Boolean(user && !data.session);
    return {
      ok: true,
      user,
      requiresConfirmation,
      authState: getAuthState(),
      message: requiresConfirmation
        ? 'Akun berhasil dibuat! Silakan cek kotak masuk email Anda bila konfirmasi email diaktifkan, atau langsung masuk.'
        : `Selamat datang di Desa Palevest, ${cleanUsername}!`,
    };
  } catch (err) {
    return {
      ok: false,
      error: translateAuthError(err && err.message ? err.message : 'Gagal mendaftarkan akun.'),
    };
  }
}

export async function signInUser({ email, password }) {
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanPassword = typeof password === 'string' ? password : '';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      ok: false,
      error: 'Masukkan alamat email yang valid.',
    };
  }

  if (!cleanPassword) {
    return {
      ok: false,
      error: 'Masukkan kata sandi akun Anda.',
    };
  }

  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    const fallbackName = cleanEmail.split('@')[0] || 'Petani';
    writeGuestSession({
      username: fallbackName,
      farmName: 'Kebun Lembah',
      email: cleanEmail,
    });
    notifyAuthSubscribers();
    return {
      ok: true,
      user: getAuthState().user,
      authState: getAuthState(),
      message: `Selamat datang kembali, ${fallbackName}.`,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      return {
        ok: false,
        error: translateAuthError(error.message),
      };
    }

    currentSupabaseUser = data && data.user ? data.user : null;
    writeGuestSession(null);
    notifyAuthSubscribers();

    return {
      ok: true,
      user: currentSupabaseUser,
      authState: getAuthState(),
      message: 'Berhasil masuk ke akun Supabase!',
    };
  } catch (err) {
    return {
      ok: false,
      error: translateAuthError(err && err.message ? err.message : 'Gagal masuk ke akun.'),
    };
  }
}

export async function signInWithGoogle() {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const redirectTo =
        typeof window !== 'undefined' && window.location
          ? `${window.location.origin}${window.location.pathname}#game`
          : undefined;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) {
        return {
          ok: false,
          error: translateAuthError(error.message),
        };
      }
      return {
        ok: true,
        data,
        message: 'Mengalihkan ke halaman login Google...',
      };
    } catch (err) {
      return {
        ok: false,
        error: translateAuthError(err && err.message ? err.message : 'Gagal menghubungkan login Google.'),
      };
    }
  }

  return startGuestSession({
    username: 'Petani Google',
    farmName: 'Kebun Lembah',
  });
}

export function startGuestSession({ username, farmName } = {}) {
  const cleanUsername = typeof username === 'string' && username.trim() ? username.trim() : 'Petani';
  const cleanFarmName =
    typeof farmName === 'string' && farmName.trim() ? farmName.trim() : 'Kebun Lembah';

  writeGuestSession({
    username: cleanUsername,
    farmName: cleanFarmName,
  });

  const existingLocal = readLocalSaveRaw();
  if (!existingLocal) {
    const nowIso = new Date().toISOString();
    const initialSnapshot = {
      username: cleanUsername,
      farmName: cleanFarmName,
      day: 1,
      season: 'Semi',
      gold: 500,
      energy: 100,
      maxEnergy: 100,
      updatedAt: nowIso,
    };
    writeLocalSaveRaw({
      ...initialSnapshot,
      farm_name: cleanFarmName,
      max_energy: 100,
      game_state: initialSnapshot,
      updated_at: nowIso,
    });
  } else {
    existingLocal.username = cleanUsername;
    existingLocal.farmName = cleanFarmName;
    existingLocal.farm_name = cleanFarmName;
    if (existingLocal.game_state && typeof existingLocal.game_state === 'object') {
      existingLocal.game_state.username = cleanUsername;
      existingLocal.game_state.farmName = cleanFarmName;
    }
    writeLocalSaveRaw(existingLocal);
  }

  notifyAuthSubscribers();
  return {
    ok: true,
    authState: getAuthState(),
    message: `Mode Petani Tamu aktif untuk ${cleanUsername} (${cleanFarmName}).`,
  };
}

export async function signOutUser() {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Abaikan kegagalan jaringan saat sign out
    }
  }

  currentSupabaseUser = null;
  writeGuestSession(null);

  if (typeof window !== 'undefined' && window.location) {
    if (window.location.hash === '#game') {
      window.location.hash = '#home';
    }
  }

  notifyAuthSubscribers();
  return {
    ok: true,
    authState: getAuthState(),
  };
}

export function canAccessProtectedGame() {
  const state = getAuthState();
  return Boolean(state.isAuthenticated || state.isGuest);
}

export async function saveGameData(gameSnapshot = {}) {
  const authState = getAuthState();
  const timestamp = new Date().toISOString();

  const username =
    gameSnapshot.username ||
    (gameSnapshot.player && gameSnapshot.player.username) ||
    authState.profile.username ||
    'Petani';
  const farmName =
    gameSnapshot.farmName ||
    gameSnapshot.farm_name ||
    (gameSnapshot.player && gameSnapshot.player.farmName) ||
    authState.profile.farmName ||
    'Kebun Lembah';

  const day = Number.isFinite(Number(gameSnapshot.day)) ? Number(gameSnapshot.day) : 1;
  const season = typeof gameSnapshot.season === 'string' && gameSnapshot.season ? gameSnapshot.season : 'Semi';
  const gold = Number.isFinite(Number(gameSnapshot.gold))
    ? Number(gameSnapshot.gold)
    : gameSnapshot.player && Number.isFinite(Number(gameSnapshot.player.gold))
      ? Number(gameSnapshot.player.gold)
      : 500;
  const energy = Number.isFinite(Number(gameSnapshot.energy))
    ? Math.round(Number(gameSnapshot.energy))
    : gameSnapshot.player && Number.isFinite(Number(gameSnapshot.player.energy))
      ? Math.round(Number(gameSnapshot.player.energy))
      : 100;
  const maxEnergy = Number.isFinite(Number(gameSnapshot.maxEnergy || gameSnapshot.max_energy))
    ? Math.round(Number(gameSnapshot.maxEnergy || gameSnapshot.max_energy))
    : gameSnapshot.player && Number.isFinite(Number(gameSnapshot.player.maxEnergy))
      ? Math.round(Number(gameSnapshot.player.maxEnergy))
      : 100;

  const enrichedSnapshot = {
    ...gameSnapshot,
    username,
    farmName,
    day,
    season,
    gold,
    energy,
    maxEnergy,
    updatedAt: timestamp,
  };

  const localRecord = {
    ...enrichedSnapshot,
    farm_name: farmName,
    max_energy: maxEnergy,
    game_state: enrichedSnapshot,
    updated_at: timestamp,
  };

  writeLocalSaveRaw(localRecord);

  const supabase = getSupabase();
  if (authState.isAuthenticated && authState.user && authState.user.id && supabase) {
    try {
      const { error } = await supabase.from('player_saves').upsert(
        {
          user_id: authState.user.id,
          email: authState.user.email || authState.profile.email || '',
          username,
          farm_name: farmName,
          day,
          season,
          gold,
          energy,
          max_energy: maxEnergy,
          game_state: enrichedSnapshot,
          updated_at: timestamp,
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        return {
          ok: true,
          source: 'local',
          timestamp,
          error: `Tersimpan di browser (Cloud tertunda: ${error.message})`,
        };
      }

      return {
        ok: true,
        source: 'supabase',
        timestamp,
        error: null,
      };
    } catch (err) {
      return {
        ok: true,
        source: 'local',
        timestamp,
        error: err && err.message ? err.message : 'Gagal sinkronisasi ke Supabase, tersimpan lokal.',
      };
    }
  }

  return {
    ok: true,
    source: 'local',
    timestamp,
    error: null,
  };
}

export async function loadGameData() {
  const authState = getAuthState();
  const supabase = getSupabase();

  if (authState.isAuthenticated && authState.user && authState.user.id && supabase) {
    try {
      const { data, error } = await supabase
        .from('player_saves')
        .select('*')
        .eq('user_id', authState.user.id)
        .maybeSingle();

      if (!error && data) {
        const snapshot =
          data.game_state && typeof data.game_state === 'object' ? data.game_state : {};
        const mergedSave = {
          ...snapshot,
          username: data.username || snapshot.username || authState.profile.username,
          farmName: data.farm_name || snapshot.farmName || authState.profile.farmName,
          farm_name: data.farm_name || snapshot.farmName || authState.profile.farmName,
          day: Number.isFinite(Number(data.day)) ? Number(data.day) : snapshot.day || 1,
          season: data.season || snapshot.season || 'Semi',
          gold: Number.isFinite(Number(data.gold)) ? Number(data.gold) : snapshot.gold ?? 500,
          energy: Number.isFinite(Number(data.energy)) ? Number(data.energy) : snapshot.energy ?? 100,
          maxEnergy: Number.isFinite(Number(data.max_energy))
            ? Number(data.max_energy)
            : snapshot.maxEnergy ?? 100,
          max_energy: Number.isFinite(Number(data.max_energy))
            ? Number(data.max_energy)
            : snapshot.maxEnergy ?? 100,
          updated_at: data.updated_at || snapshot.updatedAt || new Date().toISOString(),
          updatedAt: data.updated_at || snapshot.updatedAt || new Date().toISOString(),
          game_state: snapshot,
        };

        writeLocalSaveRaw(mergedSave);
        return {
          ok: true,
          save: mergedSave,
          source: 'supabase',
        };
      }
    } catch {
      // Jatuh ke cadangan penyimpanan lokal
    }
  }

  const localRaw = readLocalSaveRaw();
  if (localRaw) {
    const snapshot =
      localRaw.game_state && typeof localRaw.game_state === 'object'
        ? localRaw.game_state
        : localRaw;
    const mergedLocal = {
      ...snapshot,
      ...localRaw,
      username:
        localRaw.username || snapshot.username || authState.profile.username || 'Petani',
      farmName:
        localRaw.farmName ||
        localRaw.farm_name ||
        snapshot.farmName ||
        authState.profile.farmName ||
        'Kebun Lembah',
      day: Number.isFinite(Number(localRaw.day ?? snapshot.day))
        ? Number(localRaw.day ?? snapshot.day)
        : 1,
      season: localRaw.season || snapshot.season || 'Semi',
      gold: Number.isFinite(Number(localRaw.gold ?? snapshot.gold))
        ? Number(localRaw.gold ?? snapshot.gold)
        : 500,
      energy: Number.isFinite(Number(localRaw.energy ?? snapshot.energy))
        ? Number(localRaw.energy ?? snapshot.energy)
        : 100,
      maxEnergy: Number.isFinite(Number(localRaw.maxEnergy ?? localRaw.max_energy ?? snapshot.maxEnergy))
        ? Number(localRaw.maxEnergy ?? localRaw.max_energy ?? snapshot.maxEnergy)
        : 100,
      updatedAt: localRaw.updated_at || localRaw.updatedAt || snapshot.updatedAt || null,
    };

    return {
      ok: true,
      save: mergedLocal,
      source: 'local',
    };
  }

  return {
    ok: false,
    save: null,
    source: 'none',
  };
}

export function getLocalSaveSummary() {
  const localRaw = readLocalSaveRaw();
  if (!localRaw) return null;
  const snapshot =
    localRaw.game_state && typeof localRaw.game_state === 'object' ? localRaw.game_state : localRaw;
  return {
    username: localRaw.username || snapshot.username || 'Petani',
    farmName: localRaw.farmName || localRaw.farm_name || snapshot.farmName || 'Kebun Lembah',
    day: Number(localRaw.day ?? snapshot.day ?? 1),
    season: localRaw.season || snapshot.season || 'Semi',
    gold: Number(localRaw.gold ?? snapshot.gold ?? 500),
    energy: Number(localRaw.energy ?? snapshot.energy ?? 100),
    maxEnergy: Number(localRaw.maxEnergy ?? localRaw.max_energy ?? snapshot.maxEnergy ?? 100),
    updatedAt: localRaw.updated_at || localRaw.updatedAt || snapshot.updatedAt || null,
  };
}

function translateAuthError(message = '') {
  const lower = String(message).toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Email atau kata sandi tidak sesuai. Periksa kembali atau daftar akun baru.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi. Cek kotak masuk email Anda atau gunakan Mode Petani Tamu.';
  }
  if (lower.includes('user already registered')) {
    return 'Email ini sudah terdaftar. Silakan pindah ke tab Masuk.';
  }
  if (lower.includes('password should be at least')) {
    return 'Kata sandi minimal harus 6 karakter.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Tidak dapat terhubung ke server Supabase. Periksa URL project atau gunakan Mode Petani Tamu.';
  }
  return message || 'Terjadi kendala autentikasi. Silakan coba lagi.';
}
