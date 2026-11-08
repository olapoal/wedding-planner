// netlify/functions/demo-session.js
// Anti-Abuse Serverless Handler for 2-Minute Demo Session (Active Screen Time)
// Mendukung Pause saat keluar & Resume saat masuk kembali via Netlify Blobs

exports.handler = async function(event, context) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const action = body.action || "check"; // "start", "pause", "update", "check", "expire"
        const fingerprint = (body.fingerprint || "unknown-fp").substring(0, 80);
        const reqRemaining = typeof body.remainingSeconds === "number" ? body.remainingSeconds : null;

        // Ambil Alamat IP Klien
        const clientIp = (
            event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            event.headers["client-ip"] ||
            event.headers["x-nf-client-connection-ip"] ||
            "local-ip"
        );

        const DEMO_DURATION = 120; // 2 Menit = 120 Detik
        const fpKey = `demo_fp_${fingerprint}`;
        const ipKey = `demo_ip_${clientIp.replace(/[^a-zA-Z0-9]/g, "_")}`;

        // Coba koneksi ke Netlify Blobs
        let store = null;
        try {
            const { getStore } = require("@netlify/blobs");
            store = getStore("wedding_demo_abuse");
        } catch (e) {
            // Netlify Blobs belum aktif atau berjalan secara lokal
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

        // JIKA MENGGUNAKAN SUPABASE SEBAGAI BACKEND (Ketika Netlify Blobs tidak aktif atau Supabase dikonfigurasi)
        if (!store && supabaseUrl && supabaseKey) {
            const cleanUrl = supabaseUrl.replace(/\/$/, "");
            const now = new Date().toISOString();

            // Cek sesi yang ada di Supabase berdasarkan fingerprint ATAU IP
            let supaSession = null;
            try {
                const queryFilter = (clientIp && clientIp !== "local-ip" && clientIp !== "127.0.0.1")
                    ? `or=(fingerprint.eq.${encodeURIComponent(fingerprint)},client_ip.eq.${encodeURIComponent(clientIp)})`
                    : `fingerprint=eq.${encodeURIComponent(fingerprint)}`;

                const checkRes = await fetch(`${cleanUrl}/rest/v1/wedding_demo_sessions?${queryFilter}&limit=1`, {
                    headers: {
                        "apikey": supabaseKey,
                        "Authorization": `Bearer ${supabaseKey}`
                    }
                });
                if (checkRes.ok) {
                    const rows = await checkRes.json();
                    if (rows && rows.length > 0) supaSession = rows[0];
                }
            } catch (err) {
                console.warn("Supabase demo check notice:", err.message);
            }

            if (action === "start") {
                if (supaSession) {
                    const isExp = supaSession.expired || (supaSession.remaining_seconds !== undefined && supaSession.remaining_seconds <= 0);
                    if (isExp) {
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({
                                allowed: false,
                                expired: true,
                                remainingSeconds: 0,
                                message: "Masa uji coba demo 2 menit untuk perangkat atau koneksi internet ini sudah habis. Silakan beli lisensi di Lynk.id!"
                            })
                        };
                    } else {
                        const rem = supaSession.remaining_seconds !== undefined ? supaSession.remaining_seconds : DEMO_DURATION;
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({
                                allowed: true,
                                expired: false,
                                remainingSeconds: rem
                            })
                        };
                    }
                }

                // Buat sesi baru di Supabase
                const newRem = reqRemaining !== null ? reqRemaining : DEMO_DURATION;
                try {
                    await fetch(`${cleanUrl}/rest/v1/wedding_demo_sessions`, {
                        method: "POST",
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Content-Type": "application/json",
                            "Prefer": "resolution=merge-duplicates"
                        },
                        body: JSON.stringify({
                            fingerprint: fingerprint,
                            client_ip: clientIp,
                            remaining_seconds: newRem,
                            expired: false,
                            started_at: now,
                            last_active_at: now
                        })
                    });
                } catch (e) {}

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        allowed: true,
                        expired: false,
                        remainingSeconds: newRem
                    })
                };
            }

            if (action === "pause" || action === "update") {
                const rem = reqRemaining !== null ? Math.max(0, reqRemaining) : 0;
                try {
                    await fetch(`${cleanUrl}/rest/v1/wedding_demo_sessions?fingerprint=eq.${encodeURIComponent(fingerprint)}`, {
                        method: "PATCH",
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            remaining_seconds: rem,
                            expired: rem <= 0,
                            last_active_at: now
                        })
                    });
                } catch (e) {}

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ success: true, remainingSeconds: rem })
                };
            }

            if (action === "expire") {
                try {
                    await fetch(`${cleanUrl}/rest/v1/wedding_demo_sessions?fingerprint=eq.${encodeURIComponent(fingerprint)}`, {
                        method: "PATCH",
                        headers: {
                            "apikey": supabaseKey,
                            "Authorization": `Bearer ${supabaseKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            remaining_seconds: 0,
                            expired: true,
                            last_active_at: now
                        })
                    });
                } catch (e) {}

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ success: true, expired: true })
                };
            }

            if (action === "check") {
                if (supaSession) {
                    const isExp = supaSession.expired || (supaSession.remaining_seconds !== undefined && supaSession.remaining_seconds <= 0);
                    const rem = supaSession.remaining_seconds !== undefined ? supaSession.remaining_seconds : 0;
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({
                            allowed: !isExp,
                            expired: isExp,
                            remainingSeconds: rem
                        })
                    };
                }
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        allowed: true,
                        expired: false,
                        remainingSeconds: DEMO_DURATION
                    })
                };
            }
        }

        if (store) {
            const now = Date.now();
            let existingFp = null;
            let existingIp = null;

            try {
                existingFp = await store.get(fpKey, { type: "json" });
                if (clientIp !== "local-ip" && clientIp !== "127.0.0.1" && !clientIp.startsWith("192.168.")) {
                    existingIp = await store.get(ipKey, { type: "json" });
                }
            } catch (readErr) {
                console.warn("Blobs read warn:", readErr.message);
            }

            const existing = existingFp || existingIp;

            // 1. ACTION: START / RESUME DEMO
            if (action === "start") {
                if (existing) {
                    if (existing.expired || (existing.remainingSeconds !== undefined && existing.remainingSeconds <= 0)) {
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({
                                allowed: false,
                                expired: true,
                                remainingSeconds: 0,
                                message: "Masa uji coba demo 2 menit untuk perangkat atau koneksi internet ini sudah habis. Silakan beli lisensi di Lynk.id!"
                            })
                        };
                    } else {
                        // Sesi demo dilanjutkan dengan sisa detik yang tersimpan
                        const rem = existing.remainingSeconds !== undefined ? existing.remainingSeconds : DEMO_DURATION;
                        return {
                            statusCode: 200,
                            headers: corsHeaders,
                            body: JSON.stringify({
                                allowed: true,
                                expired: false,
                                remainingSeconds: rem
                            })
                        };
                    }
                }

                // Catat sesi demo baru
                const newRecord = {
                    startedAt: now,
                    clientIp: clientIp,
                    fingerprint: fingerprint,
                    remainingSeconds: reqRemaining !== null ? reqRemaining : DEMO_DURATION,
                    expired: false
                };

                try {
                    await store.setJSON(fpKey, newRecord);
                    if (clientIp !== "local-ip" && clientIp !== "127.0.0.1") {
                        await store.setJSON(ipKey, newRecord);
                    }
                } catch (writeErr) {
                    console.warn("Blobs write warn:", writeErr.message);
                }

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        allowed: true,
                        expired: false,
                        remainingSeconds: newRecord.remainingSeconds
                    })
                };
            }

            // 2. ACTION: PAUSE / UPDATE SISA WAKTU
            if (action === "pause" || action === "update") {
                const rem = reqRemaining !== null ? Math.max(0, reqRemaining) : 0;
                const record = existing || {
                    startedAt: now,
                    clientIp: clientIp,
                    fingerprint: fingerprint
                };
                record.remainingSeconds = rem;
                if (rem <= 0) record.expired = true;

                try {
                    await store.setJSON(fpKey, record);
                    if (clientIp !== "local-ip" && clientIp !== "127.0.0.1") {
                        await store.setJSON(ipKey, record);
                    }
                } catch (writeErr) {}

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ success: true, remainingSeconds: rem })
                };
            }

            // 3. ACTION: EXPIRE DEMO (WAKTU HABIS)
            if (action === "expire") {
                const record = existing || {
                    startedAt: now,
                    clientIp: clientIp,
                    fingerprint: fingerprint
                };
                record.expired = true;
                record.remainingSeconds = 0;

                try {
                    await store.setJSON(fpKey, record);
                    if (clientIp !== "local-ip" && clientIp !== "127.0.0.1") {
                        await store.setJSON(ipKey, record);
                    }
                } catch (writeErr) {}

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ success: true, expired: true })
                };
            }

            // 4. ACTION: CHECK STATUS
            if (existing) {
                const isExp = existing.expired || (existing.remainingSeconds !== undefined && existing.remainingSeconds <= 0);
                const rem = existing.remainingSeconds !== undefined ? existing.remainingSeconds : 0;
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        allowed: !isExp,
                        expired: isExp,
                        remainingSeconds: rem
                    })
                };
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    allowed: true,
                    expired: false,
                    remainingSeconds: DEMO_DURATION
                })
            };
        }

        // Fallback untuk mode lokal / offline testing
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                allowed: true,
                expired: false,
                remainingSeconds: reqRemaining !== null ? reqRemaining : DEMO_DURATION,
                note: "Local mode fallback"
            })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message })
        };
    }
};
