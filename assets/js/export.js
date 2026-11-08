/**
 * WEDDING PLANNER - EXPORT, BACKUP & UTILITY HELPERS
 */

class ExportManager {
  // BACKUP DATA TO JSON FILE
  static backupData(weddingData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(weddingData, null, 2));
    const downloadAnchor = document.createElement("a");
    const coupleSlug = `${weddingData.profile.cppName}_${weddingData.profile.cpwName}`.replace(/\s+/g, "_");
    const filename = `WeddingPlan_${coupleSlug}_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // RESTORE DATA FROM JSON FILE
  static restoreData(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.profile && parsed.budgetCategories) {
          callback(true, parsed);
        } else {
          callback(false, "Format file tidak valid. Pastikan memilih file backup JSON Wedding Planner yang benar.");
        }
      } catch (err) {
        callback(false, "Gagal membaca file JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // PRINT RUNDOWN FOR WEDDING ORGANIZER & FAMILY
  static printRundown(weddingData, activeEventKey = "all") {
    const profile = weddingData.profile;
    const rundowns = weddingData.rundowns;

    let contentHtml = "";

    const renderEventTable = (title, items) => {
      if (!items || items.length === 0) return "";
      let rows = items.map((item, idx) => `
        <tr style="border-bottom: 1px solid #E5E7EB; ${idx % 2 === 1 ? 'background-color: #FDFBF7;' : ''}">
          <td style="padding: 10px 12px; font-weight: 700; color: #1F2937; white-space: nowrap;">
            ${item.start} - ${item.end}
          </td>
          <td style="padding: 10px 12px; font-weight: 600; color: #111827;">
            ${item.title}
          </td>
          <td style="padding: 10px 12px; color: #92400E; font-weight: 600;">
            ${item.pic || "-"}
          </td>
          <td style="padding: 10px 12px; color: #4B5563; font-size: 13px;">
            ${item.notes || "-"}
          </td>
        </tr>
      `).join("");

      return `
        <div style="margin-bottom: 28px; page-break-inside: avoid;">
          <div style="background: #FAF5EF; border-left: 4px solid #C59B27; padding: 10px 16px; margin-bottom: 12px; border-radius: 0 8px 8px 0;">
            <h3 style="margin: 0; color: #854D0E; font-family: 'Playfair Display', serif; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${title}
            </h3>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;">
            <thead>
              <tr style="background: #F3ECE1; color: #78350F; text-align: left; font-size: 12px; text-transform: uppercase;">
                <th style="padding: 10px 12px; width: 15%;">Waktu</th>
                <th style="padding: 10px 12px; width: 35%;">Agenda Acara</th>
                <th style="padding: 10px 12px; width: 20%;">PIC / Petugas</th>
                <th style="padding: 10px 12px; width: 30%;">Catatan & Perlengkapan</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    };

    if (activeEventKey === "all" || activeEventKey === "lamaran") {
      contentHtml += renderEventTable("1. Rundown Acara Lamaran", rundowns.lamaran);
    }
    if (activeEventKey === "all" || activeEventKey === "siraman") {
      contentHtml += renderEventTable("2. Rundown Siraman & Malam Midodareni", rundowns.siraman);
    }
    if (activeEventKey === "all" || activeEventKey === "akad") {
      contentHtml += renderEventTable("3. Rundown Khidmat Akad Nikah", rundowns.akad);
    }
    if (activeEventKey === "all" || activeEventKey === "resepsi") {
      contentHtml += renderEventTable("4. Rundown Resepsi Pernikahan", rundowns.resepsi);
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rundown Pernikahan - ${profile.cppName} & ${profile.cpwName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1F2937;
            padding: 30px;
            max-width: 900px;
            margin: 0 auto;
            background: #FFF;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .couple-title {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            color: #B45309;
            margin: 0;
            letter-spacing: 1px;
          }
          .subtitle {
            font-size: 14px;
            color: #6B7280;
            margin-top: 6px;
          }
          .meta-box {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-top: 14px;
            font-size: 13px;
            color: #4B5563;
          }
          .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">OFFICIAL WEDDING RUN OF SHOW</div>
          <h1 class="couple-title">${profile.cppName} & ${profile.cpwName}</h1>
          <div class="subtitle">Panduan Rundown Resmi untuk Tim Wedding Organizer, Vendor & Keluarga</div>
          <div class="meta-box">
            <span class="meta-item">📅 Tanggal: <strong>${profile.weddingDate}</strong></span>
            <span class="meta-item">📍 Lokasi: <strong>${profile.venueName || "Venue"} (${profile.venueCity || "-"})</strong></span>
            <span class="meta-item">⏰ Mulai: <strong>${profile.weddingTime} WIB</strong></span>
          </div>
        </div>

        ${contentHtml}

        <div style="margin-top: 40px; border-top: 1px dashed #D1D5DB; padding-top: 15px; font-size: 12px; color: #9CA3AF; text-align: center;">
          Dokumen dicetak dari Aplikasi Wedding Planner Pro &bull; Harap seluruh panitia dan vendor mematuhi ketepatan waktu.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // GENERATE WHATSAPP INVITATION MESSAGE
  static sendWhatsAppInvite(guest, profile) {
    const groom = profile.cppName;
    const bride = profile.cpwName;
    const date = profile.weddingDate;
    const venue = profile.venueName;

    const message = `Halo ${guest.name},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami:

💍 *${groom} & ${bride}*
📅 Tanggal: ${date}
📍 Tempat: ${venue}
👤 Kuota Kehadiran: ${guest.pax} orang (${guest.table || "Meja Tamu"})

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.

Mohon berkenan untuk mengonfirmasi kehadiran Anda melalui tautan atau membalas pesan ini. Terima kasih banyak! ❤️

Salam hangat,
*${groom} & ${bride}*`;

    const cleanPhone = (guest.phone || "").replace(/[^0-9]/g, "");
    let phoneNum = cleanPhone;
    if (phoneNum.startsWith("08")) {
      phoneNum = "62" + phoneNum.slice(1);
    } else if (phoneNum.startsWith("8")) {
      phoneNum = "62" + phoneNum;
    }

    const encodedMsg = encodeURIComponent(message);
    const waUrl = phoneNum ? `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodedMsg}` : `https://api.whatsapp.com/send?text=${encodedMsg}`;

    window.open(waUrl, "_blank");
  }
}
