/**
 * WEDDING PLANNER - AUTHENTICATION & LYNK.ID PAYWALL GATE
 * Mendukung Netlify Functions Serverless (verify-email & demo-session),
 * Multi-layer Anti-Abuse (LocalStorage, IndexedDB, Device Fingerprinting),
 * dan Batasan Demo 2 Menit (120 Detik).
 */

const STORAGE_KEY_AUTH = "wp_auth_user";
const STORAGE_KEY_WHITELIST = "wp_authorized_emails";
const STORAGE_KEY_SETTINGS = "wp_app_settings";
const STORAGE_KEY_DATA = "wp_wedding_data";

// Anti-Abuse Demo Keys
const STORAGE_KEY_DEMO_REMAINING = "wp_demo_remaining_seconds";
const STORAGE_KEY_DEMO_START = "wp_demo_start_time";
const STORAGE_KEY_DEMO_EXPIRED = "wp_demo_expired";
const STORAGE_KEY_DEMO_FP = "wp_demo_fingerprint";
const DEMO_DURATION_SECONDS = 120; // 2 Menit (120 Detik) Waktu Pemakaian Aktif

// IndexedDB Helper for deep anti-abuse persistence
const SEC_DB_NAME = "wp_security_db";
const SEC_STORE_NAME = "sec_tokens";

function saveIndexedDBLock(key, val) {
  try {
    if (!window.indexedDB) return;
    const req = window.indexedDB.open(SEC_DB_NAME, 1);
    req.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SEC_STORE_NAME)) {
        db.createObjectStore(SEC_STORE_NAME);
      }
    };
    req.onsuccess = function(e) {
      const db = e.target.result;
      const tx = db.transaction(SEC_STORE_NAME, "readwrite");
      tx.objectStore(SEC_STORE_NAME).put(val, key);
    };
  } catch (e) {}
}

function checkIndexedDBLock(key, callback) {
  try {
    if (!window.indexedDB) return;
    const req = window.indexedDB.open(SEC_DB_NAME, 1);
    req.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SEC_STORE_NAME)) {
        db.createObjectStore(SEC_STORE_NAME);
      }
    };
    req.onsuccess = function(e) {
      const db = e.target.result;
      const tx = db.transaction(SEC_STORE_NAME, "readonly");
      const getReq = tx.objectStore(SEC_STORE_NAME).get(key);
      getReq.onsuccess = function() {
        if (callback && getReq.result !== undefined) callback(getReq.result);
      };
    };
  } catch (e) {}
}

// Device Fingerprinting: WebGL + Canvas + Screen + Platform
function computeDeviceFingerprint() {
  try {
    const parts = [];
    parts.push((window.screen.width || 0) + "x" + (window.screen.height || 0));
    parts.push(window.screen.colorDepth || 24);
    parts.push(window.devicePixelRatio || 1);
    parts.push(navigator.hardwareConcurrency || 2);
    parts.push(navigator.platform || "");
    parts.push(navigator.language || "");
    try {
      parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    } catch(e) {}

    // WebGL Unmasked GPU Renderer
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          parts.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
          parts.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "");
        }
      }
    } catch (e) {}

    // Canvas 2D Cryptographic Render Hash
    try {
      const c = document.createElement("canvas");
      c.width = 160;
      c.height = 36;
      const ctx = c.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "14px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#E11D48";
      ctx.fillRect(8, 4, 60, 18);
      ctx.fillStyle = "#0F172A";
      ctx.fillText("WP-Secure💍2026", 10, 6);
      parts.push(c.toDataURL().slice(-36));
    } catch (e) {}

    // Fast DJB2 Hash
    const str = parts.join("###");
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    const cleanHash = Math.abs(hash).toString(36);
    return "fp_" + cleanHash + "_" + (window.screen.width * window.screen.height).toString(36);
  } catch (e) {
    return "fp_fallback_" + Math.floor(Math.random() * 1000000);
  }
}

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.whitelist = [];
    this.settings = {};
    this.fingerprint = computeDeviceFingerprint();
    this.init();
  }

  init() {
    // 1. Load Whitelist
    const storedWhitelist = localStorage.getItem(STORAGE_KEY_WHITELIST);
    if (storedWhitelist) {
      try {
        this.whitelist = JSON.parse(storedWhitelist);
      } catch (e) {
        this.whitelist = [...DEFAULT_AUTHORIZED_EMAILS];
      }
      // Pastikan email seed (termasuk olapoal.artgallery@gmail.com) selalu ada di whitelist
      if (typeof DEFAULT_AUTHORIZED_EMAILS !== "undefined") {
        DEFAULT_AUTHORIZED_EMAILS.forEach(seedEmail => {
          const clean = seedEmail.toLowerCase().trim();
          if (!this.whitelist.some(e => (typeof e === 'string' ? e : e.email).toLowerCase().trim() === clean)) {
            this.whitelist.unshift(clean);
          }
        });
        this.saveWhitelist();
      }
    } else {
      this.whitelist = [...DEFAULT_AUTHORIZED_EMAILS];
      this.saveWhitelist();
    }

    // 2. Load Settings
    const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (storedSettings) {
      try {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
      } catch (e) {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    } else {
      this.settings = { ...DEFAULT_SETTINGS };
      this.saveSettings(this.settings);
    }

    // 3. Load Current User Session
    const storedUser = localStorage.getItem(STORAGE_KEY_AUTH);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    // 4. Verify Demo Expiry & Anti-Abuse
    this.checkIndexedDBExpiry();
    this.verifyDemoSessionState();
  }

  checkIndexedDBExpiry() {
    checkIndexedDBLock("demo_expired", (val) => {
      if (val === true) {
        localStorage.setItem(STORAGE_KEY_DEMO_EXPIRED, "true");
        if (this.currentUser && this.currentUser.role === "demo") {
          this.currentUser = null;
          localStorage.removeItem(STORAGE_KEY_AUTH);
        }
      }
    });
  }

  verifyDemoSessionState() {
    // Jika user sedang dalam sesi demo, periksa sisa waktu
    if (this.currentUser && this.currentUser.role === "demo") {
      const rem = this.getDemoRemainingSeconds();
      if (rem <= 0) {
        this.markDemoExpiredLocally();
      }
    }
  }

  saveWhitelist() {
    localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(this.whitelist));
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
  }

  isAuthenticated() {
    if (!this.currentUser) return false;
    if (this.currentUser.role === "admin") return true;

    if (this.currentUser.role === "demo") {
      return !this.isDemoExpired();
    }

    // Check whitelist if mode is whitelist
    if (this.settings.accessMode === "whitelist") {
      const emailLower = (this.currentUser.email || "").toLowerCase().trim();
      return this.whitelist.some(e => e.toLowerCase().trim() === emailLower);
    }

    return true;
  }

  isDemo() {
    return this.currentUser && this.currentUser.role === "demo" && !this.isDemoExpired();
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === "admin";
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // =========================================================================
  // SUPABASE DIRECT CLIENT INTEGRATION (Client-Side Direct - Tanpa Netlify)
  // =========================================================================

  getSupabaseConfig() {
    const url = (localStorage.getItem("wp_supabase_url") || this.settings.supabaseUrl || "https://condofsgwrwhywqhbglb.supabase.co").trim().replace(/\/$/, "");
    const key = (localStorage.getItem("wp_supabase_key") || this.settings.supabaseKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbmRvZnNnd3J3aHl3cWhiZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxMDUxNjIsImV4cCI6MjEwOTY4MTE2Mn0.A0EdfHT8JwmosMiqYJsXAAF8CFL3sWE3UpAMrozsp50").trim();
    return { url, key, isReady: Boolean(url && key) };
  }

  async syncSupabaseDemo(action, remSeconds) {
    const cfg = this.getSupabaseConfig();
    if (!cfg.isReady) return null;
    try {
      const now = new Date().toISOString();
      if (action === "check" || action === "start") {
        const res = await fetch(`${cfg.url}/rest/v1/wedding_demo_sessions?fingerprint=eq.${encodeURIComponent(this.fingerprint)}&limit=1`, {
          headers: {
            "apikey": cfg.key,
            "Authorization": `Bearer ${cfg.key}`
          }
        });
        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0) return rows[0];
        }
      }

      if (action === "start") {
        await fetch(`${cfg.url}/rest/v1/wedding_demo_sessions`, {
          method: "POST",
          headers: {
            "apikey": cfg.key,
            "Authorization": `Bearer ${cfg.key}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
          },
          body: JSON.stringify({
            fingerprint: this.fingerprint,
            client_ip: "browser-client",
            remaining_seconds: remSeconds,
            expired: false,
            started_at: now,
            last_active_at: now
          })
        });
      } else if (action === "pause" || action === "update") {
        await fetch(`${cfg.url}/rest/v1/wedding_demo_sessions?fingerprint=eq.${encodeURIComponent(this.fingerprint)}`, {
          method: "PATCH",
          headers: {
            "apikey": cfg.key,
            "Authorization": `Bearer ${cfg.key}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            remaining_seconds: remSeconds,
            expired: remSeconds <= 0,
            last_active_at: now
          })
        });
      } else if (action === "expire") {
        await fetch(`${cfg.url}/rest/v1/wedding_demo_sessions?fingerprint=eq.${encodeURIComponent(this.fingerprint)}`, {
          method: "PATCH",
          headers: {
            "apikey": cfg.key,
            "Authorization": `Bearer ${cfg.key}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            remaining_seconds: 0,
            expired: true,
            last_active_at: now
          })
        });
      }
    } catch (e) {
      console.warn("Direct Supabase demo sync notice:", e.message);
    }
    return null;
  }

  // =========================================================================
  // DEMO TIMER & ANTI-ABUSE ENGINE (2 MENIT / 120 DETIK)
  // =========================================================================

  isDemoExpired() {
    // 1. Cek tanda permanen di localStorage / sessionStorage
    if (localStorage.getItem(STORAGE_KEY_DEMO_EXPIRED) === "true") return true;
    if (sessionStorage.getItem(STORAGE_KEY_DEMO_EXPIRED) === "true") return true;

    // 2. Cek sisa detik pemakaian aktif
    const stored = localStorage.getItem(STORAGE_KEY_DEMO_REMAINING);
    if (stored !== null && parseInt(stored, 10) <= 0) {
      this.markDemoExpiredLocally();
      return true;
    }

    return false;
  }

  getDemoRemainingSeconds() {
    if (this.isDemoExpired()) return 0;

    const stored = localStorage.getItem(STORAGE_KEY_DEMO_REMAINING);
    if (stored === null) return DEMO_DURATION_SECONDS; // 120 detik awal

    const rem = parseInt(stored, 10);
    if (isNaN(rem) || rem <= 0) {
      this.markDemoExpiredLocally();
      return 0;
    }
    return Math.min(rem, DEMO_DURATION_SECONDS);
  }

  updateDemoRemainingSeconds(seconds) {
    const clean = Math.max(0, Math.floor(seconds));
    localStorage.setItem(STORAGE_KEY_DEMO_REMAINING, clean.toString());
    sessionStorage.setItem(STORAGE_KEY_DEMO_REMAINING, clean.toString());
    saveIndexedDBLock("demo_remaining", clean);

    if (clean <= 0) {
      this.markDemoExpiredLocally();
    }
    return clean;
  }

  markDemoExpiredLocally() {
    localStorage.setItem(STORAGE_KEY_DEMO_EXPIRED, "true");
    sessionStorage.setItem(STORAGE_KEY_DEMO_EXPIRED, "true");
    localStorage.setItem(STORAGE_KEY_DEMO_REMAINING, "0");
    saveIndexedDBLock("demo_expired", true);
    saveIndexedDBLock("demo_remaining", 0);
    saveIndexedDBLock("demo_fp_" + this.fingerprint, true);
    this.syncSupabaseDemo("expire", 0);

    if (this.currentUser && this.currentUser.role === "demo") {
      this.currentUser = null;
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }

  async activateDemo() {
    // 1. Cek apakah sudah expired secara lokal
    if (this.isDemoExpired()) {
      return {
        success: false,
        expired: true,
        message: "Masa uji coba demo 2 menit untuk perangkat ini telah habis. Silakan beli lisensi di Lynk.id!"
      };
    }

    const currentRem = this.getDemoRemainingSeconds();
    if (currentRem <= 0) {
      this.markDemoExpiredLocally();
      return {
        success: false,
        expired: true,
        message: "Masa uji coba demo 2 menit untuk perangkat ini telah habis. Silakan beli lisensi di Lynk.id!"
      };
    }

    // 2. Cek ke Supabase Cloud langsung (Client-Side Direct - Tanpa Perlu Netlify)
    try {
      const supaDemo = await this.syncSupabaseDemo("start", currentRem);
      if (supaDemo) {
        if (supaDemo.expired || (supaDemo.remaining_seconds !== undefined && supaDemo.remaining_seconds <= 0)) {
          this.markDemoExpiredLocally();
          return {
            success: false,
            expired: true,
            message: "Masa uji coba demo 2 menit untuk perangkat ini telah habis di Supabase. Silakan beli lisensi di Lynk.id!"
          };
        }
      }
    } catch (e) {}

    // 3. Cek ke backend Netlify Functions (jika online/terdeploy) untuk IP & Fingerprint check
    try {
      const res = await fetch("/.netlify/functions/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          fingerprint: this.fingerprint,
          remainingSeconds: currentRem
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.allowed) {
          this.markDemoExpiredLocally();
          return {
            success: false,
            expired: true,
            message: data.message || "Masa uji coba demo 2 menit untuk koneksi/perangkat ini telah habis."
          };
        }
      }
    } catch (netErr) {
      // Fallback lokal jika offline / di localhost
    }

    // 4. Pastikan remaining seconds tersimpan
    this.updateDemoRemainingSeconds(currentRem);

    this.currentUser = {
      email: "demo@lynk.id",
      role: "demo",
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));

    return {
      success: true,
      expired: false,
      remainingSeconds: currentRem,
      message: "Mode Demo aktif."
    };
  }

  resetDemoForDev() {
    localStorage.removeItem(STORAGE_KEY_DEMO_EXPIRED);
    localStorage.removeItem(STORAGE_KEY_DEMO_FP);
    sessionStorage.removeItem(STORAGE_KEY_DEMO_EXPIRED);
    localStorage.setItem(STORAGE_KEY_DEMO_REMAINING, DEMO_DURATION_SECONDS.toString());
    sessionStorage.setItem(STORAGE_KEY_DEMO_REMAINING, DEMO_DURATION_SECONDS.toString());
    saveIndexedDBLock("demo_expired", false);
    saveIndexedDBLock("demo_remaining", DEMO_DURATION_SECONDS);
    console.log("Demo session reset successfully to 120 seconds for dev testing.");
    return "Demo session reset successfully to 120 seconds!";
  }

  // =========================================================================
  // LOGIN PEMBELI LYNK.ID & ADMIN
  // =========================================================================

  async loginWithEmail(email, optionalCode = "") {
    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !this.validateEmail(cleanEmail)) {
      return { success: false, message: "Format alamat email tidak valid. Pastikan penulisan benar." };
    }

    // 1. Verifikasi langsung ke Supabase Cloud Database (Client-Side Direct - Tanpa Netlify)
    const supaCfg = this.getSupabaseConfig();
    if (supaCfg.isReady) {
      try {
        const res = await fetch(`${supaCfg.url}/rest/v1/wedding_buyers?email=ilike.${encodeURIComponent(cleanEmail)}&select=email,name,order_id,status`, {
          headers: {
            "apikey": supaCfg.key,
            "Authorization": `Bearer ${supaCfg.key}`
          }
        });

        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0) {
            const buyer = rows[0];
            if (buyer.status === 'revoked') {
              return { success: false, message: "Akses lisensi untuk email ini telah dinonaktifkan." };
            }
            this.addEmail(cleanEmail);
            this.currentUser = {
              email: buyer.email,
              name: buyer.name || buyer.email,
              role: "buyer",
              orderId: buyer.order_id || "-",
              loginAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
            return { success: true, message: `Selamat datang! Email ${cleanEmail} terverifikasi aktif di Supabase Database.` };
          }
        }
      } catch (supaErr) {
        console.warn("Supabase direct buyer check notice:", supaErr.message);
      }
    }

    // 2. Verifikasi online via Netlify Serverless Function jika tersedia
    try {
      const verifyRes = await fetch("/.netlify/functions/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (verifyRes.ok) {
        const result = await verifyRes.json();
        if (result.valid) {
          this.addEmail(cleanEmail);
          this.currentUser = {
            email: cleanEmail,
            name: result.name || cleanEmail,
            role: "buyer",
            orderId: result.orderId || "-",
            loginAt: new Date().toISOString()
          };
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
          return { success: true, message: `Selamat datang! Email ${cleanEmail} terverifikasi lunas di Lynk.id.` };
        }
      }
    } catch (e) {
      // Local/offline fallback
    }

    // 2. Mode Whitelist Lokal (Fallback jika offline atau tester)
    if (this.settings.accessMode === "whitelist") {
      const isFound = this.whitelist.some(e => e.toLowerCase().trim() === cleanEmail);
      if (isFound) {
        this.currentUser = {
          email: cleanEmail,
          role: "buyer",
          loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
        return { success: true, message: `Selamat datang! Akses akun ${cleanEmail} berhasil diverifikasi.` };
      }

      // Check master license code
      if (optionalCode && optionalCode.trim().toUpperCase() === this.settings.masterLicenseCode.toUpperCase()) {
        this.addEmail(cleanEmail);
        this.currentUser = {
          email: cleanEmail,
          role: "buyer",
          loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
        return { success: true, message: `Kode lisensi valid! Email ${cleanEmail} telah terdaftar dan aktif.` };
      }

      return {
        success: false,
        message: "Email belum terdaftar dalam daftar pembeli Lynk.id. Pastikan Anda memasukkan email yang sama persis saat pembayaran di Lynk.id."
      };
    }

    // 3. Mode License Key Only
    if (this.settings.accessMode === "license_key") {
      if (!optionalCode || optionalCode.trim().toUpperCase() !== this.settings.masterLicenseCode.toUpperCase()) {
        return { success: false, message: "Kode lisensi salah. Silakan periksa email tanda terima pembelian dari Lynk.id." };
      }
      this.currentUser = {
        email: cleanEmail,
        role: "buyer",
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
      return { success: true, message: "Aktivasi lisensi berhasil!" };
    }

    // 4. Mode Any Email
    this.currentUser = {
      email: cleanEmail,
      role: "buyer",
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
    return { success: true, message: "Akses terbuka!" };
  }

  loginAsAdmin(pin) {
    if (pin === this.settings.adminPin) {
      this.currentUser = {
        email: "admin@weddingplanner.id",
        role: "admin",
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
      return { success: true, message: "Login Administrator Berhasil!" };
    }
    return { success: false, message: "PIN Admin salah!" };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }

  addEmail(email) {
    const clean = (email || "").toLowerCase().trim();
    if (!clean || !this.validateEmail(clean)) return false;
    if (!this.whitelist.some(e => e.toLowerCase().trim() === clean)) {
      this.whitelist.push(clean);
      this.saveWhitelist();
      return true;
    }
    return false;
  }

  removeEmail(email) {
    const clean = (email || "").toLowerCase().trim();
    const prevLen = this.whitelist.length;
    this.whitelist = this.whitelist.filter(e => e.toLowerCase().trim() !== clean);
    if (this.whitelist.length !== prevLen) {
      this.saveWhitelist();
      return true;
    }
    return false;
  }

  bulkAddEmails(rawText) {
    if (!rawText) return 0;
    const items = rawText.split(/[\n,;\s]+/);
    let count = 0;
    items.forEach(item => {
      const clean = item.toLowerCase().trim();
      if (clean && this.validateEmail(clean)) {
        if (!this.whitelist.some(e => e.toLowerCase().trim() === clean)) {
          this.whitelist.push(clean);
          count++;
        }
      }
    });
    if (count > 0) {
      this.saveWhitelist();
    }
    return count;
  }

  exportEmailsCsv() {
    const csvContent = "data:text/csv;charset=utf-8,Email Pembeli Lynk.id\n" + this.whitelist.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pembeli_wedding_planner_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const auth = new AuthManager();
