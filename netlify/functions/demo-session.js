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
