// netlify/functions/admin-buyers.js
// Endpoint API aman untuk Admin Panel mengelola data pembeli lisensi Wedding Planner via Netlify Blobs

exports.handler = async function(event, context) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
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
        const action = body.action || "list";
        const adminKey = event.headers["x-admin-key"] || body.admin_key || "";

        // Siapkan Netlify Blobs Stores
        let buyersStore = null;
        let settingsStore = null;
        try {
            const { getStore } = require("@netlify/blobs");
            buyersStore = getStore("wedding_buyers");
            settingsStore = getStore("wedding_settings");
        } catch (e) {
            console.warn("Blobs store init notice:", e.message);
        }

        // Tentukan Password Admin Aktif (default: admin12345 atau 1234)
        let activeAdminPassword = (process.env.ADMIN_PASSWORD || "1234").trim();
        if (settingsStore) {
            try {
                const customPass = await settingsStore.get("admin_password");
                if (customPass && customPass.trim()) {
                    activeAdminPassword = customPass.trim();
                }
            } catch (e) {
                console.warn("Failed to read custom admin password:", e.message);
            }
        }

        // Verifikasi Kunci Admin
        if (!adminKey || adminKey.trim() !== activeAdminPassword) {
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Unauthorized: PIN / Password Admin Salah" })
            };
        }

        // ACTION: LIST BUYERS
        if (action === "list") {
            const buyers = [];
            if (buyersStore) {
                try {
                    const listResult = await buyersStore.list();
                    for (const entry of (listResult.blobs || [])) {
                        try {
                            const data = await buyersStore.get(entry.key, { type: "json" });
                            if (data) buyers.push(data);
                        } catch (err) {
                            buyers.push({ email: entry.key, name: "Data Korup", order_id: "-" });
                        }
                    }
                } catch (e) {
                    console.warn("Blobs list error:", e.message);
                }
            }

            // Pastikan email owner selalu ada di database lisensi pembeli
            if (!buyers.some(b => b.email === "olapoal.artgallery@gmail.com")) {
                const ownerData = {
                    email: "olapoal.artgallery@gmail.com",
                    name: "Ola Poal (Owner VIP)",
                    order_id: "OWNER-LIFETIME",
                    created_at: new Date().toISOString()
                };
                buyers.unshift(ownerData);
                if (buyersStore) {
                    try { await buyersStore.setJSON("olapoal.artgallery@gmail.com", ownerData); } catch(e) {}
                }
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    buyers: buyers,
                    total: buyers.length
                })
            };
        }

        // ACTION: ADD BUYER MANUAL
        if (action === "add") {
            const email = (body.email || "").trim().toLowerCase();
            const name = (body.name || "Pembeli Manual").trim();
            const orderId = (body.order_id || `MANUAL-${Date.now()}`).trim();

            if (!email || !email.includes("@")) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Format email tidak valid" })
                };
            }

            const buyerData = {
                email: email,
                name: name,
                order_id: orderId,
                created_at: new Date().toISOString()
            };

            if (buyersStore) {
                await buyersStore.setJSON(email, buyerData);
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: `Pembeli ${email} berhasil didaftarkan`,
                    buyer: buyerData
                })
            };
        }

        // ACTION: DELETE BUYER
        if (action === "delete") {
            const email = (body.email || "").trim().toLowerCase();
            if (!email) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Email pembeli harus diisi" })
                };
            }

            if (buyersStore) {
                await buyersStore.delete(email);
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: `Pembeli ${email} berhasil dihapus dari sistem`
                })
            };
        }

        // ACTION: CHANGE PASSWORD
        if (action === "change_password") {
            const newPassword = (body.new_password || "").trim();
            if (!newPassword || newPassword.length < 4) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Password baru minimal 4 karakter" })
                };
            }

            if (settingsStore) {
                await settingsStore.set("admin_password", newPassword);
            }

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: true,
                    message: "Password Admin berhasil diperbarui"
                })
            };
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: `Aksi tidak dikenal: ${action}` })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message })
        };
    }
};
