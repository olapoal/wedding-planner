/**
 * WEDDING PLANNER PRO - CORE APPLICATION LOGIC
 * Single Page Architecture & State Management
 */

class WeddingApp {
  constructor() {
    this.data = this.loadData();
    this.activeTab = "dashboard";
    this.filterChecklist = "all";
    this.filterGuestCategory = "all";
    this.filterGuestRsvp = "all";
    this.searchGuestQuery = "";
    this.activeVendorCategory = "venue";
    this.activeRundownEvent = "resepsi";
    this.activeDeepTalkCategory = "all";
    this.init();
  }

  loadData() {
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading saved data, fallback to defaults", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(this.data));
  }

  init() {
    this.bindEvents();
    this.checkAuthenticationState();
    this.render();
  }

  checkAuthenticationState() {
    const isAuth = auth.isAuthenticated();
    const paywallModal = document.getElementById("paywallModal");
    const demoBanner = document.getElementById("demoBanner");

    if (!isAuth) {
      if (paywallModal) paywallModal.classList.add("active");
      if (demoBanner) demoBanner.classList.add("hidden");
    } else {
      if (paywallModal) paywallModal.classList.remove("active");
    }

    // Sync Lynk.id product links
    const lynkUrl = (auth.settings && auth.settings.lynkidProductUrl) || "https://lynk.id";
    const paywallBuyLink = document.getElementById("paywallBuyLink");
    const demoBannerBuyBtn = document.getElementById("demoBannerBuyBtn");
    const demoExpiredBuyBtn = document.getElementById("demoExpiredBuyBtn");
    if (paywallBuyLink) paywallBuyLink.href = lynkUrl;
    if (demoBannerBuyBtn) demoBannerBuyBtn.href = lynkUrl;
    if (demoExpiredBuyBtn) demoExpiredBuyBtn.href = lynkUrl;

    if (typeof this.checkDemoState === "function") {
      this.checkDemoState();
    }
    this.updateUserSessionUI();
  }

  updateUserSessionUI() {
    const userEmailEl = document.getElementById("navUserEmail");
    const userRoleBadge = document.getElementById("navUserRole");
    if (auth.currentUser) {
      if (userEmailEl) userEmailEl.textContent = auth.currentUser.email || "Pengguna";
      if (userRoleBadge) {
        if (auth.isAdmin()) {
          userRoleBadge.textContent = "Admin";
          userRoleBadge.className = "badge-rose";
        } else if (auth.isDemo()) {
          userRoleBadge.textContent = "Demo Preview";
          userRoleBadge.className = "badge-gray";
        } else {
          userRoleBadge.textContent = "VIP Buyer";
          userRoleBadge.className = "badge-gold";
        }
      }
    }
  }

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll(".nav-tab-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const tab = item.getAttribute("data-tab");
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarEl = document.getElementById("sidebar");
    if (mobileMenuBtn && sidebarEl) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebarEl.classList.toggle("-translate-x-full");
      });
    }

    // Modal Close buttons
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".modal-overlay").classList.remove("active");
      });
    });

    // Auto-save and pause demo active timer on tab switch or close
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && auth.isDemo() && this.lastTickTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - this.lastTickTime) / 1000);
        if (elapsed >= 1) {
          const rem = Math.max(0, auth.getDemoRemainingSeconds() - elapsed);
          auth.updateDemoRemainingSeconds(rem);
          this.lastTickTime = now;
        }
      } else if (!document.hidden && auth.isDemo()) {
        this.lastTickTime = Date.now();
      }
    });

    window.addEventListener("beforeunload", () => {
      if (auth.isDemo() && this.lastTickTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - this.lastTickTime) / 1000);
        if (elapsed >= 1) {
          const rem = Math.max(0, auth.getDemoRemainingSeconds() - elapsed);
          auth.updateDemoRemainingSeconds(rem);
        }
      }
    });
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll(".nav-tab-item").forEach(item => {
      if (item.getAttribute("data-tab") === tabKey) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Hide all view containers
    document.querySelectorAll(".tab-view-container").forEach(view => {
      view.classList.add("hidden");
    });

    const activeView = document.getElementById(`view-${tabKey}`);
    if (activeView) {
      activeView.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Close mobile drawer if open
    const sidebarEl = document.getElementById("sidebar");
    if (sidebarEl && window.innerWidth < 1024) {
      sidebarEl.classList.add("-translate-x-full");
    }

    this.render();
  }

  // TOAST NOTIFICATION
  showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item ${type === 'error' ? 'border-rose-500' : 'border-amber-500'}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation text-rose-500' : 'fa-circle-check text-amber-600'} text-lg"></i>
      <span class="text-stone-800 font-medium">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // CONFETTI CELEBRATION
  triggerConfetti() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#E8A598", "#C06C84", "#6B8E7D", "#FFFDF9"]
      });
    }
  }

  formatRupiah(num) {
    const val = Number(num) || 0;
    return "Rp " + val.toLocaleString("id-ID");
  }

  // MAIN RENDER ROUTER
  render() {
    switch (this.activeTab) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "guideline":
        this.renderGuideline();
        break;
      case "tips":
        this.renderTips();
        break;
      case "savings":
        this.renderSavings();
        break;
      case "budget":
        this.renderBudget();
        break;
      case "checklists":
        this.renderChecklists();
        break;
      case "rundown":
        this.renderRundown();
        break;
      case "guests":
        this.renderGuests();
        break;
      case "entourage":
        this.renderEntourage();
        break;
      case "vendors":
        this.renderVendors();
        break;
      case "administration":
        this.renderAdministration();
        break;
      case "songs":
        this.renderSongs();
        break;
      case "cost_plans":
        this.renderCostPlans();
        break;
      case "bonus":
        this.renderBonus();
        break;
    }
  }

  // 1. DASHBOARD MODULE
  renderDashboard() {
    const profile = this.data.profile;
    const coupleTitle = document.getElementById("dashCoupleNames");
    if (coupleTitle) coupleTitle.textContent = `${profile.cppName} & ${profile.cpwName}`;
    const navCouple = document.getElementById("navCoupleLabel");
    if (navCouple) navCouple.textContent = `${profile.cppName} & ${profile.cpwName}`;
    const venueDisplay = document.getElementById("dashVenueDisplay");
    if (venueDisplay) venueDisplay.textContent = `${profile.venueName || "Venue"} (${profile.venueCity || "-"})`;

    // Countdown
    const weddingDateObj = new Date(profile.weddingDate + "T" + (profile.weddingTime || "08:00"));
    const today = new Date();
    const diffTime = weddingDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const countdownDaysEl = document.getElementById("dashDaysCount");
    const countdownTextEl = document.getElementById("dashDaysLabel");
    if (countdownDaysEl) {
      countdownDaysEl.textContent = diffDays > 0 ? diffDays : (diffDays === 0 ? "HARI H!" : "SELESAI");
    }
    if (countdownTextEl) {
      countdownTextEl.textContent = diffDays > 0 ? "Hari Menuju Pernikahan" : (diffDays === 0 ? "Selamat Menempuh Hidup Baru!" : "Telah Terlaksana dengan Indah");
    }

    const dateDisplayEl = document.getElementById("dashWeddingDateDisplay");
    if (dateDisplayEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateDisplayEl.textContent = weddingDateObj.toLocaleDateString("id-ID", options);
    }

    // Financial Overview Calculations
    let totalPlanned = 0;
    let totalActual = 0;
    let totalPaid = 0;

    this.data.budgetCategories.forEach(item => {
      totalPlanned += Number(item.planned) || 0;
      totalActual += Number(item.actual) || 0;
      totalPaid += Number(item.paid) || 0;
    });

    const totalTanggungan = totalPaid - totalActual; // negative means debt remaining
    const totalDanaTersisa = totalPlanned - totalPaid;

    document.getElementById("dashTotalAnggaran").textContent = this.formatRupiah(totalPlanned);
    document.getElementById("dashTotalAktual").textContent = this.formatRupiah(totalActual);
    document.getElementById("dashTotalTerbayar").textContent = this.formatRupiah(totalPaid);
    
    const tanggunganEl = document.getElementById("dashTotalTanggungan");
    if (tanggunganEl) {
      tanggunganEl.textContent = this.formatRupiah(Math.abs(totalActual - totalPaid));
      const badgeTanggungan = document.getElementById("dashTanggunganBadge");
      if (badgeTanggungan) {
        badgeTanggungan.textContent = (totalActual - totalPaid) > 0 ? "Belum Terlunasi" : "Lunas Penuh";
        badgeTanggungan.className = (totalActual - totalPaid) > 0 ? "badge-rose" : "badge-sage";
      }
    }

    // Guests Overview
    const totalGuests = this.data.guests.length;
    const hadirGuests = this.data.guests.filter(g => g.rsvp === "HADIR").length;
    const belumKirim = this.data.guests.filter(g => !g.sent).length;

    document.getElementById("dashGuestTotal").textContent = totalGuests;
    document.getElementById("dashGuestHadir").textContent = hadirGuests;
    document.getElementById("dashGuestPending").textContent = belumKirim;

    // Upcoming Tasks (Nearest 7 tasks)
    const upcomingContainer = document.getElementById("dashUpcomingTasksList");
    if (upcomingContainer) {
      const sortedTasks = [...this.data.checklists]
        .filter(t => !t.done)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 7);

      if (sortedTasks.length === 0) {
        upcomingContainer.innerHTML = `
          <div class="text-center py-8 text-slate-400">
            <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shadow-sm">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <p class="font-bold text-slate-700">Semua tugas terdekat sudah selesai!</p>
            <p class="text-xs text-slate-400 mt-1">Persiapan pernikahan Anda berjalan sangat rapi dan terkendali. 🎉</p>
          </div>
        `;
      } else {
        const stageBadges = {
          "Lamaran": "badge-purple",
          "Persiapan KUA": "badge-blue",
          "Akad Nikah": "badge-rose",
          "Resepsi": "badge-gold",
          "Honeymoon": "badge-mint"
        };

        upcomingContainer.innerHTML = sortedTasks.map(t => {
          const taskDate = new Date(t.date);
          const isOverdue = taskDate < today;
          const stageClass = stageBadges[t.stage] || "badge-gold";

          return `
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-md transition">
              <div class="flex items-center gap-3.5">
                <input type="checkbox" class="custom-checkbox" onchange="app.toggleTaskDone('${t.id}')">
                <div>
                  <h4 class="font-bold text-slate-800 text-sm hover:text-rose-600 transition">${t.task}</h4>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span class="${stageClass} text-[10px] py-0.5 px-2">${t.stage}</span>
                    <span><i class="fa-regular fa-calendar mr-1"></i>${t.date}</span>
                  </div>
                </div>
              </div>
              <span class="${isOverdue ? 'badge-rose' : 'badge-sage'} text-xs">
                ${isOverdue ? '<i class=\"fa-solid fa-triangle-exclamation mr-1\"></i>Terlewat' : '<i class=\"fa-regular fa-clock mr-1\"></i>Mendatang'}
              </span>
            </div>
          `;
        }).join("");
      }
    }
  }

  // EDIT COUPLE PROFILE MODAL
  openEditProfileModal() {
    const p = this.data.profile;
    document.getElementById("editProfileCpp").value = p.cppName || "";
    document.getElementById("editProfileCpw").value = p.cpwName || "";
    document.getElementById("editProfileDate").value = p.weddingDate || "";
    document.getElementById("editProfileTime").value = p.weddingTime || "08:00";
    document.getElementById("editProfileVenue").value = p.venueName || "";
    document.getElementById("editProfileCity").value = p.venueCity || "";
    document.getElementById("editProfileModal").classList.add("active");
  }

  submitEditProfile(e) {
    e.preventDefault();
    const cpp = document.getElementById("editProfileCpp").value.trim();
    const cpw = document.getElementById("editProfileCpw").value.trim();
    const date = document.getElementById("editProfileDate").value;
    const time = document.getElementById("editProfileTime").value;
    const venue = document.getElementById("editProfileVenue").value.trim();
    const city = document.getElementById("editProfileCity").value.trim();

    if (!cpp || !cpw) {
      alert("Nama kedua mempelai harus diisi!");
      return;
    }

    this.data.profile.cppName = cpp;
    this.data.profile.cpwName = cpw;
    if (date) this.data.profile.weddingDate = date;
    if (time) this.data.profile.weddingTime = time;
    if (venue) this.data.profile.venueName = venue;
    if (city) this.data.profile.venueCity = city;

    this.saveData();
    document.getElementById("editProfileModal").classList.remove("active");
    this.renderDashboard();
    this.showToast(`Profil pernikahan ${cpp} & ${cpw} berhasil diperbarui!`);
    this.triggerConfetti();
  }

  // 2. GUIDELINE ACARA
  renderGuideline() {
    const container = document.getElementById("guidelineQAList");
    if (!container) return;

    const gradients = [
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-purple-600",
      "from-emerald-500 to-teal-500",
      "from-sky-500 to-blue-600"
    ];

    container.innerHTML = this.data.guidelineQA.map((q, idx) => {
      const grad = gradients[idx % gradients.length];
      return `
        <div class="wedding-card p-6 relative overflow-hidden group hover:border-rose-300 transition">
          <div class="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b ${grad}"></div>
          <div class="flex items-start justify-between gap-4 mb-3 pl-2">
            <div>
              <span class="badge-gold text-xs mb-1.5">${q.topic}</span>
              <h3 class="font-serif font-bold text-lg text-slate-900">${q.question}</h3>
            </div>
            <button onclick="app.editGuidelineAnswer('${q.id}')" class="text-slate-400 hover:text-rose-600 transition p-2 rounded-xl hover:bg-rose-50" title="Edit Jawaban">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
          <div class="bg-gradient-to-r from-rose-50/60 via-purple-50/30 to-amber-50/30 p-4 rounded-2xl border border-rose-100/60 text-slate-700 text-sm leading-relaxed italic ml-2">
            <i class="fa-solid fa-quote-left text-rose-300 mr-2 text-xs"></i>${q.answer}
          </div>
        </div>
      `;
    }).join("");
  }

  editGuidelineAnswer(id) {
    const item = this.data.guidelineQA.find(q => q.id === id);
    if (!item) return;

    const newAnswer = prompt(`Edit Jawaban untuk '${item.topic}':`, item.answer);
    if (newAnswer !== null && newAnswer.trim() !== "") {
      item.answer = newAnswer.trim();
      this.saveData();
      this.renderGuideline();
      this.showToast("Jawaban guideline berhasil diperbarui!");
    }
  }

  // 3. TIPS KEUANGAN
  renderTips() {
    // Interactive savings meter calculations
    const target = this.data.savings.targetAmount || 100000000;
    const maxRecTabungan = target * 0.5; // Max 50% rule

    const meterEl = document.getElementById("tipsMaxRecommended");
    if (meterEl) {
      meterEl.textContent = this.formatRupiah(maxRecTabungan);
    }
  }

  // 4. TABUNGAN & KONTRIBUTOR
  renderSavings() {
    const savings = this.data.savings;
    const target = savings.targetAmount || 100000000;

    // Sum CPP
    let totalCpp = savings.cppContributions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    // Sum CPW
    let totalCpw = savings.cpwContributions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    // Sum Family
    let totalFamily = savings.familyContributions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const totalTerkumpul = totalCpp + totalCpw + totalFamily;
    const masihKurang = target - totalTerkumpul;
    const progressPercent = Math.min(100, Math.round((totalTerkumpul / target) * 100));

    // Deadline months calculation
    const deadlineObj = new Date(savings.deadlineDate);
    const today = new Date();
    const diffMonth = Math.max(1, Math.ceil((deadlineObj - today) / (1000 * 60 * 60 * 24 * 30)));
    const monthlyRecommendation = masihKurang > 0 ? Math.ceil(masihKurang / diffMonth) : 0;

    // Update Elements
    document.getElementById("savingsTargetDisplay").textContent = this.formatRupiah(target);
    document.getElementById("savingsTotalTerkumpul").textContent = this.formatRupiah(totalTerkumpul);
    document.getElementById("savingsTotalCpp").textContent = this.formatRupiah(totalCpp);
    document.getElementById("savingsTotalCpw").textContent = this.formatRupiah(totalCpw);
    document.getElementById("savingsTotalFamily").textContent = this.formatRupiah(totalFamily);

    const kurangEl = document.getElementById("savingsMasihKurang");
    if (kurangEl) {
      kurangEl.textContent = masihKurang > 0 ? this.formatRupiah(masihKurang) : "Target Tercapai! 🎉";
      kurangEl.className = masihKurang > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold";
    }

    const progressFill = document.getElementById("savingsProgressBar");
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const progressPercentLabel = document.getElementById("savingsProgressLabel");
    if (progressPercentLabel) progressPercentLabel.textContent = `${progressPercent}% Tercapai`;

    const recEl = document.getElementById("savingsMonthlyRec");
    if (recEl) {
      recEl.textContent = masihKurang > 0 ? `${this.formatRupiah(monthlyRecommendation)} / bulan (${diffMonth} bulan lagi)` : "Target Tabungan Sudah Lunas!";
    }

    // Render lists
    this.renderContributionTable("savingsCppList", savings.cppContributions, "cpp");
    this.renderContributionTable("savingsCpwList", savings.cpwContributions, "cpw");
    this.renderFamilyContributionTable("savingsFamilyList", savings.familyContributions);
  }

  renderContributionTable(containerId, list, type) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!list || list.length === 0) {
      el.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-400 text-xs">Belum ada riwayat setoran tabungan.</td></tr>`;
      return;
    }

    const hoverClass = type === "cpp" ? "hover:bg-sky-50/50" : "hover:bg-rose-50/50";
    const textAmountClass = type === "cpp" ? "text-sky-700" : "text-rose-700";

    el.innerHTML = list.map((item) => `
      <tr class="${hoverClass} transition-colors border-b border-slate-100/80 last:border-0">
        <td class="py-2.5 px-3 text-slate-500 font-mono text-xs">${item.date}</td>
        <td class="py-2.5 px-3 font-bold ${textAmountClass} text-sm">${this.formatRupiah(item.amount)}</td>
        <td class="py-2.5 px-3 text-slate-600 text-xs">${item.note || "-"}</td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="app.deleteContribution('${type}', '${item.id}')" class="text-slate-300 hover:text-rose-600 text-xs p-1 rounded hover:bg-rose-50 transition" title="Hapus">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  renderFamilyContributionTable(containerId, list) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!list || list.length === 0) {
      el.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">Belum ada data kontributor keluarga.</td></tr>`;
      return;
    }

    el.innerHTML = list.map(item => `
      <tr class="hover:bg-emerald-50/50 transition-colors border-b border-slate-100/80 last:border-0">
        <td class="py-2.5 px-3 font-bold text-slate-800 text-sm">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              ${item.name.charAt(0)}
            </span>
            ${item.name}
          </div>
        </td>
        <td class="py-2.5 px-3 font-bold text-emerald-700 text-sm">${this.formatRupiah(item.amount)}</td>
        <td class="py-2.5 px-3 text-slate-600 text-xs">${item.note || "-"}</td>
        <td class="py-2.5 px-3 text-slate-400 font-mono text-xs">${item.date || "-"}</td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="app.deleteContribution('family', '${item.id}')" class="text-slate-300 hover:text-rose-600 text-xs p-1 rounded hover:bg-rose-50 transition" title="Hapus">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  addContribution(type) {
    const amountStr = prompt("Masukkan nominal tabungan (contoh: 1000000):");
    if (!amountStr) return;
    const amount = Number(amountStr.replace(/[^0-9]/g, ""));
    if (isNaN(amount) || amount <= 0) {
      alert("Nominal tidak valid!");
      return;
    }

    const note = prompt("Catatan (opsional, contoh: Gaji bulan Agustus):") || "";
    const date = new Date().toISOString().slice(0, 10);
    const newId = "id_" + Date.now();

    if (type === "cpp") {
      this.data.savings.cppContributions.push({ id: newId, date, amount, note });
    } else if (type === "cpw") {
      this.data.savings.cpwContributions.push({ id: newId, date, amount, note });
    } else if (type === "family") {
      const name = prompt("Nama Pihak Kontributor (contoh: Paman Ahmad):") || "Keluarga";
      this.data.savings.familyContributions.push({ id: newId, name, amount, note, date });
    }

    this.saveData();
    this.renderSavings();
    this.showToast("Setoran tabungan berhasil dicatat!");
    this.triggerConfetti();
  }

  deleteContribution(type, id) {
    if (!confirm("Hapus catatan setoran ini?")) return;
    if (type === "cpp") {
      this.data.savings.cppContributions = this.data.savings.cppContributions.filter(i => i.id !== id);
    } else if (type === "cpw") {
      this.data.savings.cpwContributions = this.data.savings.cpwContributions.filter(i => i.id !== id);
    } else if (type === "family") {
      this.data.savings.familyContributions = this.data.savings.familyContributions.filter(i => i.id !== id);
    }
    this.saveData();
    this.renderSavings();
    this.showToast("Catatan dihapus.");
  }

  // 5. BUDGET TRACKER MODULE
  renderBudget() {
    const list = this.data.budgetCategories;
    const tbody = document.getElementById("budgetTableBody");
    if (!tbody) return;

    // Filter event
    const filterEvent = document.getElementById("budgetFilterEvent")?.value || "all";
    const filterCategory = document.getElementById("budgetFilterCategory")?.value || "all";

    const filtered = list.filter(item => {
      const matchEvent = filterEvent === "all" || item.event === filterEvent;
      const matchCat = filterCategory === "all" || item.category === filterCategory;
      return matchEvent && matchCat;
    });

    // Summary calculations
    let totalPlan = 0;
    let totalAct = 0;
    let totalPaid = 0;

    list.forEach(i => {
      totalPlan += Number(i.planned) || 0;
      totalAct += Number(i.actual) || 0;
      totalPaid += Number(i.paid) || 0;
    });

    document.getElementById("budgetSumPlan").textContent = this.formatRupiah(totalPlan);
    document.getElementById("budgetSumActual").textContent = this.formatRupiah(totalAct);
    document.getElementById("budgetSumPaid").textContent = this.formatRupiah(totalPaid);
    document.getElementById("budgetSumTanggungan").textContent = this.formatRupiah(Math.abs(totalAct - totalPaid));

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-slate-400">Tidak ada pengeluaran dengan filter ini.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const tanggungan = (Number(item.actual) || 0) - (Number(item.paid) || 0);
      let statusBadge = "";
      if (item.paid >= item.actual && item.actual > 0) {
        statusBadge = `<span class="badge-sage text-xs"><i class="fa-solid fa-circle-check mr-1"></i>LUNAS</span>`;
      } else if (item.paid > 0) {
        statusBadge = `<span class="badge-gold text-xs"><i class="fa-solid fa-clock-rotate-left mr-1"></i>DP</span>`;
      } else {
        statusBadge = `<span class="badge-rose text-xs"><i class="fa-solid fa-circle-xmark mr-1"></i>BELUM</span>`;
      }

      let eventPill = "badge-rose";
      if (item.event === "Lamaran") eventPill = "badge-purple";
      else if (item.event === "Honeymoon") eventPill = "badge-mint";
      else if (item.event === "Akad & Resepsi") eventPill = "badge-sunset";

      return `
        <tr class="hover:bg-rose-50/30 transition-colors">
          <td class="py-3 px-3">
            <span class="${eventPill} text-[11px]">${item.event}</span>
          </td>
          <td class="py-3 px-3 font-bold text-slate-800 text-sm">
            ${item.category}
          </td>
          <td class="py-3 px-3 text-slate-800 text-sm">
            <div class="font-bold text-slate-900">${item.name}</div>
            <div class="text-xs text-slate-400">${item.vendor || "-"} &bull; ${item.phone || "-"}</div>
          </td>
          <td class="py-3 px-3 font-mono text-sm text-slate-600">${this.formatRupiah(item.planned)}</td>
          <td class="py-3 px-3 font-mono text-sm font-bold text-slate-900">${this.formatRupiah(item.actual)}</td>
          <td class="py-3 px-3 font-mono text-sm font-bold text-emerald-600">${this.formatRupiah(item.paid)}</td>
          <td class="py-3 px-3 font-mono text-sm ${tanggungan > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">
            ${tanggungan > 0 ? '-' + this.formatRupiah(tanggungan) : 'Rp 0'}
          </td>
          <td class="py-3 px-3 text-center">
            ${statusBadge}
          </td>
          <td class="py-3 px-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button onclick="app.quickPayBudgetItem('${item.id}')" class="btn-emerald text-xs py-1 px-3 shadow-none text-white rounded-lg transition" title="Catat Pembayaran">
                <i class="fa-solid fa-receipt mr-1"></i>Bayar
              </button>
              <button onclick="app.deleteBudgetItem('${item.id}')" class="text-slate-300 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition" title="Hapus">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  quickPayBudgetItem(id) {
    const item = this.data.budgetCategories.find(i => i.id === id);
    if (!item) return;

    const remaining = (Number(item.actual) || 0) - (Number(item.paid) || 0);
    const amountStr = prompt(`Catat pembayaran untuk '${item.name}' (Sisa Tanggungan: ${this.formatRupiah(remaining)}):`, remaining > 0 ? remaining : item.actual);
    if (!amountStr) return;
    const amount = Number(amountStr.replace(/[^0-9]/g, ""));
    if (isNaN(amount) || amount <= 0) return;

    item.paid = Math.min(item.actual, (Number(item.paid) || 0) + amount);
    if (item.paid >= item.actual) {
      item.status = "LUNAS";
      this.triggerConfetti();
    } else {
      item.status = "DP";
    }

    this.saveData();
    this.renderBudget();
    this.showToast(`Pembayaran ${this.formatRupiah(amount)} berhasil dicatat!`);
  }

  deleteBudgetItem(id) {
    if (!confirm("Hapus pos anggaran ini?")) return;
    this.data.budgetCategories = this.data.budgetCategories.filter(i => i.id !== id);
    this.saveData();
    this.renderBudget();
    this.showToast("Pos anggaran dihapus.");
  }

  openAddBudgetModal() {
    document.getElementById("addBudgetModal").classList.add("active");
  }

  submitAddBudget(e) {
    e.preventDefault();
    const event = document.getElementById("addBudgetEvent").value;
    const category = document.getElementById("addBudgetCategory").value;
    const name = document.getElementById("addBudgetName").value;
    const vendor = document.getElementById("addBudgetVendor").value;
    const phone = document.getElementById("addBudgetPhone").value;
    const planned = Number(document.getElementById("addBudgetPlanned").value) || 0;
    const actual = Number(document.getElementById("addBudgetActual").value) || planned;
    const paid = Number(document.getElementById("addBudgetPaid").value) || 0;

    const newItem = {
      id: "b_" + Date.now(),
      event,
      category,
      name,
      vendor,
      phone,
      planned,
      actual,
      paid,
      status: paid >= actual ? "LUNAS" : (paid > 0 ? "DP" : "BELUM")
    };

    this.data.budgetCategories.push(newItem);
    this.saveData();
    document.getElementById("addBudgetModal").classList.remove("active");
    document.getElementById("addBudgetForm").reset();
    this.renderBudget();
    this.showToast("Item anggaran baru berhasil ditambahkan!");
  }

  // 6. CHECKLIST PERSIAPAN
  renderChecklists() {
    const list = this.data.checklists;
    const container = document.getElementById("checklistItemsList");
    if (!container) return;

    const today = new Date();
    const filter = this.filterChecklist;

    const filtered = list.filter(item => {
      const isOverdue = new Date(item.date) < today && !item.done;
      if (filter === "done") return item.done;
      if (filter === "pending") return !item.done;
      if (filter === "overdue") return isOverdue;
      return true;
    });

    // Counts
    const total = list.length;
    const doneCount = list.filter(t => t.done).length;
    const overdueCount = list.filter(t => new Date(t.date) < today && !t.done).length;
    const pendingCount = total - doneCount;

    document.getElementById("checkTotalCount").textContent = total;
    document.getElementById("checkDoneCount").textContent = doneCount;
    document.getElementById("checkPendingCount").textContent = pendingCount;
    document.getElementById("checkOverdueCount").textContent = overdueCount;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="text-center py-10 text-slate-400">Tidak ada tugas dengan kriteria ini.</div>`;
      return;
    }

    const stageBadges = {
      "Lamaran": "badge-purple",
      "Persiapan KUA": "badge-blue",
      "Akad Nikah": "badge-rose",
      "Resepsi": "badge-gold",
      "Honeymoon": "badge-mint"
    };

    container.innerHTML = filtered.map(t => {
      const isOverdue = new Date(t.date) < today && !t.done;
      const stageClass = stageBadges[t.stage] || "badge-gold";

      return `
        <div class="flex items-center justify-between p-4 rounded-2xl border ${t.done ? 'bg-emerald-50/40 border-emerald-200' : (isOverdue ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200 hover:border-rose-200')} transition hover:shadow-md">
          <div class="flex items-start gap-3.5 flex-1">
            <input type="checkbox" class="custom-checkbox mt-1" ${t.done ? 'checked' : ''} onchange="app.toggleTaskDone('${t.id}')">
            <div>
              <h4 class="font-bold text-slate-800 text-sm ${t.done ? 'line-through text-slate-400' : ''}">
                ${t.task}
              </h4>
              <div class="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                <span class="${stageClass} text-[10px] py-0.5 px-2.5">${t.stage}</span>
                <span><i class="fa-regular fa-calendar mr-1 text-slate-400"></i>${t.date}</span>
                ${t.vendor ? `<span class="text-slate-700 font-medium">&bull; ${t.vendor}</span>` : ''}
                ${t.notes ? `<span class="italic text-slate-400">(${t.notes})</span>` : ''}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="${t.done ? 'badge-sage' : (isOverdue ? 'badge-rose' : 'badge-gold')} text-xs">
              ${t.done ? '<i class=\"fa-solid fa-check mr-1\"></i>Selesai' : (isOverdue ? '<i class=\"fa-solid fa-triangle-exclamation mr-1\"></i>Terlewat' : '<i class=\"fa-regular fa-clock mr-1\"></i>Mendatang')}
            </span>
            <button onclick="app.deleteTask('${t.id}')" class="text-slate-300 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition" title="Hapus">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  toggleTaskDone(id) {
    const task = this.data.checklists.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    this.saveData();
    this.render();
    if (task.done) {
      this.triggerConfetti();
      this.showToast(`Tugas '${task.task}' ditandai selesai!`);
    }
  }

  deleteTask(id) {
    if (!confirm("Hapus tugas ini?")) return;
    this.data.checklists = this.data.checklists.filter(t => t.id !== id);
    this.saveData();
    this.render();
    this.showToast("Tugas dihapus.");
  }

  openAddTaskModal() {
    document.getElementById("addTaskModal").classList.add("active");
  }

  submitAddTask(e) {
    e.preventDefault();
    const stage = document.getElementById("addTaskStage").value;
    const task = document.getElementById("addTaskName").value;
    const vendor = document.getElementById("addTaskVendor").value;
    const date = document.getElementById("addTaskDate").value;
    const notes = document.getElementById("addTaskNotes").value;
    const priority = document.getElementById("addTaskPriority").value;

    this.data.checklists.push({
      id: "t_" + Date.now(),
      stage,
      task,
      vendor,
      date: date || new Date().toISOString().slice(0, 10),
      notes,
      priority,
      done: false
    });

    this.saveData();
    document.getElementById("addTaskModal").classList.remove("active");
    document.getElementById("addTaskForm").reset();
    this.renderChecklists();
    this.showToast("Tugas baru berhasil ditambahkan!");
  }

  // 7. RUNDOWN SAAT ACARA
  renderRundown() {
    const key = this.activeRundownEvent;
    const list = this.data.rundowns[key] || [];
    const container = document.getElementById("rundownItemsTimeline");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<div class="text-center py-10 text-slate-400">Belum ada rundown untuk acara ini.</div>`;
      return;
    }

    container.innerHTML = list.map((item, idx) => `
      <div class="relative pl-8 pb-7 border-l-2 border-rose-200 last:border-l-0">
        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 border-2 border-white shadow-md"></div>
        <div class="wedding-card p-5 hover:border-rose-300 transition shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono font-bold text-rose-700 text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              <i class="fa-regular fa-clock mr-1.5 text-rose-500"></i>${item.start} - ${item.end}
            </span>
            <span class="badge-purple text-xs">
              <i class="fa-solid fa-user-tie mr-1 text-purple-600"></i>${item.pic || "Koordinator"}
            </span>
          </div>
          <h4 class="font-serif font-bold text-base text-slate-900 mb-1">${item.title}</h4>
          <p class="text-slate-600 text-xs leading-relaxed">${item.notes || "-"}</p>
        </div>
      </div>
    `).join("");
  }

  switchRundownEvent(eventKey) {
    this.activeRundownEvent = eventKey;
    document.querySelectorAll(".rundown-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-event") === eventKey) {
        btn.className = "rundown-tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md transition";
      } else {
        btn.className = "rundown-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 transition border border-slate-200";
      }
    });
    this.renderRundown();
  }

  printCurrentRundown() {
    ExportManager.printRundown(this.data, this.activeRundownEvent);
  }

  // 8. DAFTAR TAMU & RSVP
  renderGuests() {
    const list = this.data.guests;
    const tbody = document.getElementById("guestTableBody");
    if (!tbody) return;

    const catFilter = this.filterGuestCategory;
    const rsvpFilter = this.filterGuestRsvp;
    const query = this.searchGuestQuery.toLowerCase();

    const filtered = list.filter(g => {
      const matchCat = catFilter === "all" || g.category === catFilter;
      const matchRsvp = rsvpFilter === "all" || g.rsvp === rsvpFilter;
      const matchQuery = !query || g.name.toLowerCase().includes(query) || (g.phone && g.phone.includes(query)) || (g.address && g.address.toLowerCase().includes(query));
      return matchCat && matchRsvp && matchQuery;
    });

    // Counts
    const total = list.length;
    const hadir = list.filter(g => g.rsvp === "HADIR").length;
    const ragu = list.filter(g => g.rsvp === "RAGU-RAGU").length;
    const tidak = list.filter(g => g.rsvp === "TIDAK HADIR").length;
    const unconfirmed = list.filter(g => g.rsvp === "BELUM KONFIRMASI" || !g.rsvp).length;
    const belumKirim = list.filter(g => !g.sent).length;

    document.getElementById("guestStatTotal").textContent = total;
    document.getElementById("guestStatHadir").textContent = hadir;
    document.getElementById("guestStatRagu").textContent = ragu;
    document.getElementById("guestStatTidak").textContent = tidak;
    document.getElementById("guestStatPending").textContent = unconfirmed;
    document.getElementById("guestStatBelumKirim").textContent = belumKirim;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-stone-400">Tidak ada tamu yang cocok dengan pencarian.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(g => {
      let rsvpBadge = "";
      if (g.rsvp === "HADIR") rsvpBadge = `<span class="badge-sage text-xs"><i class="fa-solid fa-circle-check mr-1"></i>HADIR</span>`;
      else if (g.rsvp === "RAGU-RAGU") rsvpBadge = `<span class="badge-gold text-xs"><i class="fa-solid fa-circle-question mr-1"></i>RAGU-RAGU</span>`;
      else if (g.rsvp === "TIDAK HADIR") rsvpBadge = `<span class="badge-rose text-xs"><i class="fa-solid fa-circle-xmark mr-1"></i>TIDAK HADIR</span>`;
      else rsvpBadge = `<span class="badge-gray text-xs">BELUM RESPON</span>`;

      return `
        <tr class="hover:bg-rose-50/30 transition-colors">
          <td class="py-3.5 px-3">
            <div class="font-bold text-slate-900 text-sm">${g.name}</div>
            <div class="text-xs text-slate-400 font-mono">${g.phone || "-"}</div>
          </td>
          <td class="py-3.5 px-3">
            <span class="badge-blue text-[11px]">${g.category || "-"}</span>
          </td>
          <td class="py-3.5 px-3 text-xs text-slate-700 font-medium">
            ${g.table || "-"} <span class="text-slate-400 font-normal">(${g.pax || 1} Pax)</span>
          </td>
          <td class="py-3.5 px-3 text-center">
            <input type="checkbox" class="custom-checkbox" ${g.sent ? 'checked' : ''} onchange="app.toggleGuestSent('${g.id}')">
          </td>
          <td class="py-3.5 px-3 text-center">
            ${rsvpBadge}
          </td>
          <td class="py-3.5 px-3 text-right">
            <div class="flex items-center justify-end gap-2">
              <button onclick="app.sendWhatsAppInvitation('${g.id}')" class="btn-emerald text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition">
                <i class="fa-brands fa-whatsapp text-sm"></i>Undang
              </button>
              <button onclick="app.deleteGuest('${g.id}')" class="text-slate-300 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition" title="Hapus">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  toggleGuestSent(id) {
    const guest = this.data.guests.find(g => g.id === id);
    if (!guest) return;
    guest.sent = !guest.sent;
    this.saveData();
    this.renderGuests();
  }

  sendWhatsAppInvitation(id) {
    const guest = this.data.guests.find(g => g.id === id);
    if (!guest) return;
    guest.sent = true;
    this.saveData();
    this.renderGuests();
    ExportManager.sendWhatsAppInvite(guest, this.data.profile);
    this.showToast(`Undangan dikirim via WhatsApp untuk ${guest.name}!`);
  }

  deleteGuest(id) {
    if (!confirm("Hapus tamu ini dari daftar?")) return;
    this.data.guests = this.data.guests.filter(g => g.id !== id);
    this.saveData();
    this.renderGuests();
    this.showToast("Tamu dihapus.");
  }

  openAddGuestModal() {
    document.getElementById("addGuestModal").classList.add("active");
  }

  submitAddGuest(e) {
    e.preventDefault();
    const name = document.getElementById("addGuestName").value;
    const phone = document.getElementById("addGuestPhone").value;
    const category = document.getElementById("addGuestCategory").value;
    const address = document.getElementById("addGuestAddress").value;
    const pax = Number(document.getElementById("addGuestPax").value) || 1;
    const table = document.getElementById("addGuestTable").value || "Meja Umum";

    this.data.guests.push({
      id: "g_" + Date.now(),
      name,
      phone,
      category,
      address,
      pax,
      table,
      sent: false,
      rsvp: "BELUM KONFIRMASI"
    });

    this.saveData();
    document.getElementById("addGuestModal").classList.remove("active");
    document.getElementById("addGuestForm").reset();
    this.renderGuests();
    this.showToast(`Tamu '${name}' berhasil ditambahkan!`);
  }

  // 9. BRIDESMAID & GROOMSMEN
  renderEntourage() {
    const bmList = this.data.entourage.bridesmaids;
    const gmList = this.data.entourage.groomsmen;

    const bmContainer = document.getElementById("bridesmaidListContainer");
    const gmContainer = document.getElementById("groomsmenListContainer");

    if (bmContainer) {
      bmContainer.innerHTML = bmList.map(bm => `
        <div class="wedding-card p-4 flex items-center justify-between border-rose-100 hover:border-rose-300 transition">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-md flex items-center justify-center font-serif font-bold text-base">
              ${bm.name.charAt(0)}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                ${bm.name}
                <i class="fa-solid fa-sparkles text-[11px] text-rose-400"></i>
              </h4>
              <p class="text-xs text-slate-500">${bm.role} &bull; Ukuran Gaun: <strong class="text-rose-700">${bm.dressSize || "-"}</strong></p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="${bm.uniformGiven ? 'badge-sage' : 'badge-gold'} text-xs">
              ${bm.uniformGiven ? '<i class=\"fa-solid fa-check mr-1\"></i>Seragam Diterima' : 'Belum Seragam'}
            </span>
            <button onclick="app.deleteEntourage('bm', '${bm.id}')" class="text-slate-300 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join("");
    }

    if (gmContainer) {
      gmContainer.innerHTML = gmList.map(gm => `
        <div class="wedding-card p-4 flex items-center justify-between border-indigo-100 hover:border-indigo-300 transition">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md flex items-center justify-center font-serif font-bold text-base">
              ${gm.name.charAt(0)}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                ${gm.name}
                <i class="fa-solid fa-shield-halved text-[11px] text-indigo-400"></i>
              </h4>
              <p class="text-xs text-slate-500">${gm.role} &bull; Ukuran Jas: <strong class="text-indigo-700">${gm.suitSize || "-"}</strong></p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="${gm.uniformGiven ? 'badge-sage' : 'badge-gold'} text-xs">
              ${gm.uniformGiven ? '<i class=\"fa-solid fa-check mr-1\"></i>Seragam Diterima' : 'Belum Seragam'}
            </span>
            <button onclick="app.deleteEntourage('gm', '${gm.id}')" class="text-slate-300 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  deleteEntourage(type, id) {
    if (!confirm("Hapus dari daftar pengiring?")) return;
    if (type === "bm") {
      this.data.entourage.bridesmaids = this.data.entourage.bridesmaids.filter(i => i.id !== id);
    } else {
      this.data.entourage.groomsmen = this.data.entourage.groomsmen.filter(i => i.id !== id);
    }
    this.saveData();
    this.renderEntourage();
    this.showToast("Berhasil dihapus.");
  }

  // 10. PERBANDINGAN VENDOR (Side-by-Side Matrix)
  renderVendors() {
    const cat = this.activeVendorCategory;
    const vendors = this.data.vendors[cat] || [];
    const container = document.getElementById("vendorComparisonCards");
    if (!container) return;

    if (vendors.length === 0) {
      container.innerHTML = `<div class="col-span-3 text-center py-10 text-slate-400">Belum ada vendor terdaftar untuk kategori ini.</div>`;
      return;
    }

    container.innerHTML = vendors.map(v => `
      <div class="wedding-card p-6 relative flex flex-col justify-between transition ${v.isDeal ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-white shadow-lg' : 'hover:border-rose-200'}">
        ${v.isDeal ? `<span class="absolute top-3.5 right-3.5 badge-gold text-xs shadow-sm"><i class="fa-solid fa-crown mr-1 text-amber-500"></i>VENDOR TERPILIH</span>` : ''}
        <div>
          <h3 class="font-serif font-bold text-xl text-slate-900 mb-1">${v.name}</h3>
          <p class="text-xs text-slate-400 mb-4 flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-rose-400"></i>${v.address || "Lokasi tidak tercantum"}</p>
          
          <div class="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 mb-4 space-y-2 text-xs">
            <div class="flex justify-between items-center"><span class="text-slate-500">Estimasi Biaya:</span><strong class="text-rose-700 font-bold">${v.priceNote || "-"}</strong></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Kontak:</span><strong class="text-slate-800">${v.phone || "-"}</strong></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Instagram:</span><strong class="text-blue-600">${v.instagram || "-"}</strong></div>
            ${v.capacity ? `<div class="flex justify-between items-center"><span class="text-slate-500">Kapasitas:</span><strong class="text-emerald-700">${v.capacity}</strong></div>` : ''}
          </div>

          <div class="space-y-2.5 mb-5 text-xs">
            <div class="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <span class="font-bold text-emerald-800 block mb-0.5"><i class="fa-solid fa-circle-check mr-1 text-emerald-600"></i>Kelebihan:</span>
              <p class="text-slate-600 leading-relaxed">${v.pros || "-"}</p>
            </div>
            <div class="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
              <span class="font-bold text-rose-800 block mb-0.5"><i class="fa-solid fa-circle-exclamation mr-1 text-rose-500"></i>Kekurangan / Catatan:</span>
              <p class="text-slate-600 leading-relaxed">${v.cons || "-"}</p>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button onclick="app.toggleVendorDeal('${cat}', '${v.id}')" class="w-full ${v.isDeal ? 'btn-gold' : 'btn-outline-gold'} text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2">
            <i class="fa-solid ${v.isDeal ? 'fa-check' : 'fa-handshake'}"></i>
            ${v.isDeal ? 'Sudah Deal (Terpilih)' : 'Pilih Jadi Vendor Utama'}
          </button>
        </div>
      </div>
    `).join("");
  }

  switchVendorCategory(catKey) {
    this.activeVendorCategory = catKey;
    document.querySelectorAll(".vendor-cat-pill").forEach(btn => {
      if (btn.getAttribute("data-cat") === catKey) {
        btn.className = "vendor-cat-pill bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md";
      } else {
        btn.className = "vendor-cat-pill bg-white text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 border border-slate-200 transition";
      }
    });
    this.renderVendors();
  }

  toggleVendorDeal(cat, id) {
    const list = this.data.vendors[cat];
    if (!list) return;
    list.forEach(v => {
      if (v.id === id) {
        v.isDeal = !v.isDeal;
        if (v.isDeal) {
          this.triggerConfetti();
          this.showToast(`Selamat! '${v.name}' resmi dipilih jadi vendor utama!`);
        }
      } else {
        v.isDeal = false; // Only one deal per category
      }
    });
    this.saveData();
    this.renderVendors();
  }

  // 11. ADMINISTRASI & SESERAHAN
  renderAdministration() {
    const adminList = this.data.administration;
    const seserahanList = this.data.seserahan;

    const admContainer = document.getElementById("adminRequirementsList");
    const sesContainer = document.getElementById("seserahanTableBody");

    if (admContainer) {
      admContainer.innerHTML = adminList.map(a => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl border ${a.done ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 hover:border-amber-200'} transition">
          <div class="flex items-center gap-3">
            <input type="checkbox" class="custom-checkbox" ${a.done ? 'checked' : ''} onchange="app.toggleAdminDone('${a.id}')">
            <div>
              <h4 class="font-bold text-slate-800 text-sm ${a.done ? 'line-through text-slate-400' : ''}">${a.title}</h4>
              <p class="text-xs text-slate-400">${a.note || "-"} ${a.cost > 0 ? `&bull; Biaya: <strong class="text-slate-600">${this.formatRupiah(a.cost)}</strong>` : ''}</p>
            </div>
          </div>
          <span class="${a.done ? 'badge-sage' : 'badge-gold'} text-xs">
            ${a.done ? '<i class=\"fa-solid fa-check mr-1\"></i>Selesai' : 'Belum'}
          </span>
        </div>
      `).join("");
    }

    if (sesContainer) {
      let totalEst1 = 0;
      let totalEst2 = 0;
      let totalReal = 0;

      seserahanList.forEach(s => {
        totalEst1 += Number(s.price1) || 0;
        totalEst2 += Number(s.price2) || 0;
        if (s.bought) totalReal += Number(s.actualPrice) || 0;
      });

      document.getElementById("seserahanEst1").textContent = this.formatRupiah(totalEst1);
      document.getElementById("seserahanEst2").textContent = this.formatRupiah(totalEst2);
      document.getElementById("seserahanReal").textContent = this.formatRupiah(totalReal);

      sesContainer.innerHTML = seserahanList.map(s => `
        <tr class="hover:bg-rose-50/30 transition-colors">
          <td class="py-2.5 px-3">
            <input type="checkbox" class="custom-checkbox" ${s.bought ? 'checked' : ''} onchange="app.toggleSeserahanBought('${s.id}')">
          </td>
          <td class="py-2.5 px-3">
            <span class="badge-gold text-[10px]">${s.category}</span>
          </td>
          <td class="py-2.5 px-3 font-bold text-slate-800 text-sm">${s.item}</td>
          <td class="py-2.5 px-3 text-xs">
            <a href="${s.link1 || '#'}" target="_blank" class="text-blue-600 hover:underline inline-flex items-center gap-1">
              ${this.formatRupiah(s.price1)} <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </td>
          <td class="py-2.5 px-3 text-xs">
            <a href="${s.link2 || '#'}" target="_blank" class="text-blue-600 hover:underline inline-flex items-center gap-1">
              ${this.formatRupiah(s.price2)} <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </td>
          <td class="py-2.5 px-3 font-mono font-bold text-emerald-700 text-xs">
            ${this.formatRupiah(s.actualPrice)}
          </td>
        </tr>
      `).join("");
    }
  }

  toggleAdminDone(id) {
    const item = this.data.administration.find(a => a.id === id);
    if (!item) return;
    item.done = !item.done;
    this.saveData();
    this.renderAdministration();
  }

  toggleSeserahanBought(id) {
    const item = this.data.seserahan.find(s => s.id === id);
    if (!item) return;
    item.bought = !item.bought;
    this.saveData();
    this.renderAdministration();
    if (item.bought) this.triggerConfetti();
  }

  // 12. WEDDING PLAYLIST
  renderSongs() {
    const container = document.getElementById("weddingSongList");
    if (!container) return;

    const momentBadges = {
      "Ijab Kabul & Akad": "badge-rose",
      "Grand Entrance": "badge-gold",
      "Kirab Resepsi": "badge-gold",
      "First Dance": "badge-purple",
      "Dinner & Santai": "badge-sage"
    };

    container.innerHTML = this.data.songs.map(song => {
      const badgeClass = momentBadges[song.moment] || "badge-gold";
      return `
        <div class="wedding-card p-4 flex items-center justify-between hover:border-rose-300 transition">
          <div class="flex items-center gap-3.5">
            <input type="checkbox" class="custom-checkbox" ${song.isSelected ? 'checked' : ''} onchange="app.toggleSongSelected('${song.id}')">
            <div>
              <h4 class="font-bold text-slate-900 text-sm">${song.title} <span class="text-slate-400 font-normal">by ${song.artist}</span></h4>
              <span class="${badgeClass} text-[10px] mt-1"><i class="fa-solid fa-music mr-1"></i>${song.moment}</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 italic">${song.note || ""}</p>
        </div>
      `;
    }).join("");
  }

  toggleSongSelected(id) {
    const song = this.data.songs.find(s => s.id === id);
    if (!song) return;
    song.isSelected = !song.isSelected;
    this.saveData();
    this.renderSongs();
  }

  // 13. RANCANGAN BIAYA BERDASARKAN BUDGET
  renderCostPlans() {
    const container = document.getElementById("costPresetsContainer");
    if (!container) return;

    container.innerHTML = this.data.budgetPresets.map(preset => `
      <div class="wedding-card p-6 hover:border-rose-300 transition">
        <div class="flex items-start justify-between gap-4 mb-3">
          <div>
            <span class="badge-gold text-xs mb-1">Target Anggaran</span>
            <h3 class="font-serif font-bold text-xl text-slate-900">${preset.title}</h3>
            <p class="text-xs text-slate-500 mt-1">${preset.description}</p>
          </div>
          <button onclick="app.applyPresetToBudget(${preset.targetBudget})" class="btn-gold text-xs py-1.5 px-3">
            Terapkan ke Budget
          </button>
        </div>

        <div class="mt-4 space-y-2">
          ${preset.breakdown.map(b => `
            <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
              <span class="text-slate-700 font-medium">${b.item} <span class="text-slate-400">(${b.percentage}%)</span></span>
              <span class="font-mono font-bold text-slate-900">${this.formatRupiah(b.amount)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  applyPresetToBudget(targetBudget) {
    if (!confirm(`Terapkan simulasi paket ${this.formatRupiah(targetBudget)} ke Budget Tracker Anda? Item anggaran lama akan disesuaikan dengan proporsi ideal.`)) return;

    const preset = this.data.budgetPresets.find(p => p.targetBudget === targetBudget);
    if (!preset) return;

    // Apply to savings target & recalculate items
    this.data.savings.targetAmount = targetBudget;
    this.saveData();
    this.showToast(`Paket ${this.formatRupiah(targetBudget)} berhasil diterapkan!`);
    this.triggerConfetti();
  }

  calculateCustomBudget() {
    const input = document.getElementById("customBudgetInput");
    const val = Number(input.value.replace(/[^0-9]/g, "")) || 0;
    if (val <= 0) {
      alert("Masukkan nominal anggaran yang valid!");
      return;
    }

    const resContainer = document.getElementById("customBudgetResult");
    resContainer.classList.remove("hidden");

    // Wedding Golden Ratio
    const ratios = [
      { name: "Katering & Hidangan Tamu", pct: 35, icon: "fa-utensils", color: "text-amber-500 bg-amber-50" },
      { name: "Sewa Venue / Gedung", pct: 12, icon: "fa-building", color: "text-blue-500 bg-blue-50" },
      { name: "Dekorasi Pelaminan & Lighting", pct: 10, icon: "fa-wand-magic-sparkles", color: "text-rose-500 bg-rose-50" },
      { name: "MUA, Gaun Pengantin & Keluarga", pct: 10, icon: "fa-vest", color: "text-purple-500 bg-purple-50" },
      { name: "Cincin Kawin & Mahar", pct: 10, icon: "fa-ring", color: "text-amber-600 bg-amber-50" },
      { name: "Dokumentasi Foto & Sinematik", pct: 8, icon: "fa-camera", color: "text-cyan-500 bg-cyan-50" },
      { name: "Wedding Organizer & Sound", pct: 5, icon: "fa-clipboard-check", color: "text-indigo-500 bg-indigo-50" },
      { name: "Seserahan & Hantaran", pct: 5, icon: "fa-gift", color: "text-pink-500 bg-pink-50" },
      { name: "Undangan & Souvenir Tamu", pct: 2, icon: "fa-envelope-open-text", color: "text-teal-500 bg-teal-50" },
      { name: "Dana Darurat & KUA", pct: 3, icon: "fa-shield-heart", color: "text-emerald-500 bg-emerald-50" }
    ];

    resContainer.innerHTML = `
      <div class="bg-gradient-to-r from-rose-50/70 via-amber-50/60 to-purple-50/50 p-6 rounded-2xl border border-rose-200 mt-5 shadow-sm">
        <h4 class="font-serif font-bold text-slate-900 text-base mb-1">
          Rekomendasi Alokasi Ideal untuk Budget ${this.formatRupiah(val)}
        </h4>
        <p class="text-xs text-slate-500 mb-4">Formula proporsi emas pernikahan agar pos biaya terpenting terpenuhi tanpa resiko boncos.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          ${ratios.map(r => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <span class="text-slate-700 flex items-center gap-2.5 font-medium">
                <span class="w-7 h-7 rounded-lg ${r.color} flex items-center justify-center text-xs">
                  <i class="fa-solid ${r.icon}"></i>
                </span>
                ${r.name} (${r.pct}%)
              </span>
              <strong class="font-mono text-slate-900 text-sm">${this.formatRupiah(Math.round(val * (r.pct / 100)))}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 14. BONUS & DEEP TALK
  renderBonus() {
    const list = this.data.deepTalkQuestions;
    const container = document.getElementById("deepTalkQuestionsContainer");
    if (!container) return;

    const catGradients = [
      "from-rose-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-violet-500 to-purple-600",
      "from-sky-500 to-blue-600",
      "from-amber-500 to-orange-500",
      "from-fuchsia-500 to-rose-500"
    ];

    container.innerHTML = list.map((cat, idx) => {
      const grad = catGradients[idx % catGradients.length];
      return `
        <div class="wedding-card p-6">
          <div class="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-100">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr ${grad} text-white flex items-center justify-center text-lg shadow-md">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <div>
              <h3 class="font-serif font-bold text-lg text-slate-900">${cat.category}</h3>
              <p class="text-xs text-slate-400">${cat.questions.length} Topik Pembahasan Kritis</p>
            </div>
          </div>
          <div class="space-y-3 text-sm">
            ${cat.questions.map((q, qIdx) => `
              <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-rose-200 hover:bg-white transition">
                <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">${qIdx + 1}</span>
                <p class="text-slate-700 leading-relaxed text-xs sm:text-sm">${q}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  // DEMO 2-MENIT & LIVE COUNTDOWN TIMERS (PAUSE & RESUME PEMAKAIAN AKTIF)
  checkDemoState() {
    const isAuth = auth.isAuthenticated();
    const paywallModal = document.getElementById("paywallModal");
    const demoExpiredModal = document.getElementById("demoExpiredModal");
    const demoBanner = document.getElementById("demoBanner");
    const floatingWidget = document.getElementById("floatingDemoCountdownWidget");
    const headerPill = document.getElementById("headerDemoCountdownPill");
    const btnTryDemo = document.getElementById("btnTryDemo");
    const demoExpiredNotice = document.getElementById("demoExpiredNotice");

    if (auth.isDemo()) {
      const rem = auth.getDemoRemainingSeconds();
      if (rem <= 0) {
        this.handleDemoExpired();
      } else {
        if (paywallModal) paywallModal.classList.remove("active");
        if (demoExpiredModal) demoExpiredModal.classList.remove("active");
        if (demoBanner) demoBanner.classList.remove("hidden");
        if (floatingWidget) floatingWidget.classList.remove("hidden");
        if (headerPill) headerPill.classList.remove("hidden");
        this.startDemoCountdownTimer();
      }
    } else if (!isAuth) {
      if (demoBanner) demoBanner.classList.add("hidden");
      if (floatingWidget) floatingWidget.classList.add("hidden");
      if (headerPill) headerPill.classList.add("hidden");

      if (auth.isDemoExpired()) {
        if (btnTryDemo) btnTryDemo.classList.add("hidden");
        if (demoExpiredNotice) demoExpiredNotice.classList.remove("hidden");
      } else {
        if (btnTryDemo) {
          btnTryDemo.classList.remove("hidden");
          const rem = auth.getDemoRemainingSeconds();
          if (rem < 120 && rem > 0) {
            const m = Math.floor(rem / 60).toString().padStart(2, '0');
            const s = (rem % 60).toString().padStart(2, '0');
            btnTryDemo.innerHTML = `<i class="fa-solid fa-play text-[11px]"></i> Lanjutkan Preview Demo (${m}:${s} Tersisa)`;
          } else {
            btnTryDemo.innerHTML = `<i class="fa-solid fa-sparkles text-[11px]"></i> Coba Versi Preview Demo (2 Menit)`;
          }
        }
        if (demoExpiredNotice) demoExpiredNotice.classList.add("hidden");
      }
    } else {
      if (demoBanner) demoBanner.classList.add("hidden");
      if (floatingWidget) floatingWidget.classList.add("hidden");
      if (headerPill) headerPill.classList.add("hidden");
    }
  }

  startDemoCountdownTimer() {
    if (this.demoInterval) clearInterval(this.demoInterval);
    this.lastTickTime = Date.now();

    const updateAllCountdowns = () => {
      if (!auth.isDemo()) {
        clearInterval(this.demoInterval);
        return;
      }

      const now = Date.now();
      const elapsed = Math.floor((now - this.lastTickTime) / 1000);
      let rem = auth.getDemoRemainingSeconds();

      if (elapsed >= 1) {
        rem = Math.max(0, rem - elapsed);
        this.lastTickTime = now;
        auth.updateDemoRemainingSeconds(rem);
      }

      const m = Math.floor(rem / 60).toString().padStart(2, '0');
      const s = (rem % 60).toString().padStart(2, '0');
      const timeStr = `${m}:${s}`;

      // 1. Floating Widget Timer
      const floatingTimer = document.getElementById("floatingDemoTimer");
      if (floatingTimer) floatingTimer.textContent = timeStr;

      // 2. Header Navbar Timer
      const headerTimer = document.getElementById("headerDemoCountdown");
      if (headerTimer) headerTimer.textContent = timeStr;

      // 3. Top Banner Timer
      const bannerTimer = document.getElementById("demoTimerCountdown");
      if (bannerTimer) bannerTimer.textContent = timeStr;

      // 4. Alert Styling saat <= 30 detik
      const bannerEl = document.getElementById("demoBanner");
      const floatingWidget = document.getElementById("floatingDemoCountdownWidget");
      if (rem <= 30) {
        if (bannerEl) bannerEl.className = "bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium shadow-lg sticky top-0 z-50 animate-pulse";
        if (floatingWidget) {
          floatingWidget.classList.add("border-red-500", "animate-pulse");
        }
      }

      if (rem <= 0) {
        clearInterval(this.demoInterval);
        this.handleDemoExpired();
      }
    };

    updateAllCountdowns();
    this.demoInterval = setInterval(updateAllCountdowns, 1000);
  }

  handleDemoExpired() {
    if (this.demoInterval) clearInterval(this.demoInterval);
    auth.markDemoExpiredLocally();

    const demoBanner = document.getElementById("demoBanner");
    if (demoBanner) demoBanner.classList.add("hidden");

    const floatingWidget = document.getElementById("floatingDemoCountdownWidget");
    if (floatingWidget) floatingWidget.classList.add("hidden");

    const headerPill = document.getElementById("headerDemoCountdownPill");
    if (headerPill) headerPill.classList.add("hidden");

    const paywallModal = document.getElementById("paywallModal");
    if (paywallModal) paywallModal.classList.remove("active");

    const demoExpiredModal = document.getElementById("demoExpiredModal");
    if (demoExpiredModal) demoExpiredModal.classList.add("active");

    this.updateUserSessionUI();

    const btnTryDemo = document.getElementById("btnTryDemo");
    const demoExpiredNotice = document.getElementById("demoExpiredNotice");
    if (btnTryDemo) btnTryDemo.classList.add("hidden");
    if (demoExpiredNotice) demoExpiredNotice.classList.remove("hidden");

    try {
      fetch("/.netlify/functions/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "expire", fingerprint: auth.fingerprint })
      });
    } catch (e) {}
  }

  async tryDemoMode() {
    if (auth.isDemoExpired()) {
      this.handleDemoExpired();
      return;
    }

    const btn = document.getElementById("btnTryDemo");
    const origText = btn ? btn.innerHTML : "";
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Memuat Demo...';
      btn.disabled = true;
    }

    try {
      const res = await auth.activateDemo();
      if (!res.success) {
        this.handleDemoExpired();
        return;
      }

      const paywallModal = document.getElementById("paywallModal");
      if (paywallModal) paywallModal.classList.remove("active");

      const demoBanner = document.getElementById("demoBanner");
      if (demoBanner) demoBanner.classList.remove("hidden");

      const floatingWidget = document.getElementById("floatingDemoCountdownWidget");
      if (floatingWidget) floatingWidget.classList.remove("hidden");

      const headerPill = document.getElementById("headerDemoCountdownPill");
      if (headerPill) headerPill.classList.remove("hidden");

      this.startDemoCountdownTimer();
      this.updateUserSessionUI();

      const rem = auth.getDemoRemainingSeconds();
      const m = Math.floor(rem / 60).toString().padStart(2, '0');
      const s = (rem % 60).toString().padStart(2, '0');
      this.showToast(`⏱️ Sesi Demo aktif! Sisa waktu pemakaian: ${m}:${s}.`);
    } finally {
      if (btn) {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    }
  }

  openPaywallFromExpired() {
    const demoExpiredModal = document.getElementById("demoExpiredModal");
    if (demoExpiredModal) demoExpiredModal.classList.remove("active");

    const paywallModal = document.getElementById("paywallModal");
    if (paywallModal) paywallModal.classList.add("active");

    const btnTryDemo = document.getElementById("btnTryDemo");
    const demoExpiredNotice = document.getElementById("demoExpiredNotice");
    if (btnTryDemo) btnTryDemo.classList.add("hidden");
    if (demoExpiredNotice) demoExpiredNotice.classList.remove("hidden");
  }

  // =========================================================================
  // MODAL KONFIRMASI KELUAR MEWAH (PAUSE DEMO & LOGOUT)
  // =========================================================================
  openLogoutModal() {
    const modal = document.getElementById("logoutConfirmModal");
    if (!modal) {
      this.confirmLogout();
      return;
    }

    const demoBox = document.getElementById("logoutDemoInfoBox");
    const buyerBox = document.getElementById("logoutBuyerInfoBox");
    const timeBadge = document.getElementById("logoutRemainingTimeBadge");

    if (auth.isDemo()) {
      if (demoBox) demoBox.classList.remove("hidden");
      if (buyerBox) buyerBox.classList.add("hidden");
      if (timeBadge) {
        const rem = auth.getDemoRemainingSeconds();
        const m = Math.floor(rem / 60).toString().padStart(2, '0');
        const s = (rem % 60).toString().padStart(2, '0');
        timeBadge.textContent = `${m}:${s}`;
      }
    } else {
      if (demoBox) demoBox.classList.add("hidden");
      if (buyerBox) buyerBox.classList.remove("hidden");
    }

    modal.classList.add("active");
  }

  closeLogoutModal() {
    const modal = document.getElementById("logoutConfirmModal");
    if (modal) modal.classList.remove("active");
  }

  confirmLogout() {
    // 1. Hentikan interval timer demo seketika
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }

    // 2. Simpan sisa detik aktif terakhir jika dalam sesi demo
    if (auth.isDemo() && this.lastTickTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - this.lastTickTime) / 1000);
      if (elapsed >= 1) {
        const rem = Math.max(0, auth.getDemoRemainingSeconds() - elapsed);
        auth.updateDemoRemainingSeconds(rem);
      }
    }

    // 3. Sembunyikan banner dan widget demo
    const demoBanner = document.getElementById("demoBanner");
    if (demoBanner) demoBanner.classList.add("hidden");
    const floatingWidget = document.getElementById("floatingDemoCountdownWidget");
    if (floatingWidget) floatingWidget.classList.add("hidden");
    const headerPill = document.getElementById("headerDemoCountdownPill");
    if (headerPill) headerPill.classList.add("hidden");

    // 4. Tutup modal konfirmasi
    this.closeLogoutModal();

    // 5. Logout auth session
    auth.logout();

    // 6. Buka kembali paywall modal dengan status terupdate
    const paywallModal = document.getElementById("paywallModal");
    if (paywallModal) paywallModal.classList.add("active");

    this.checkDemoState();
    this.updateUserSessionUI();
    this.showToast("Anda telah keluar. Sisa waktu demo berhasil disimpan & dijeda.");
  }

  resetAllData() {
    if (!confirm("PERINGATAN: Semua data rencana pernikahan akan dikembalikan ke pengaturan awal (demo seed). Lanjutkan?")) return;
    localStorage.removeItem(STORAGE_KEY_DATA);
    this.data = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
    this.saveData();
    this.render();
    this.showToast("Data berhasil direset ke setelan awal.");
  }
}

// Global App Instance
window.app = null;
function initWeddingApp() {
  if (!window.app) {
    window.app = new WeddingApp();
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initWeddingApp);
} else {
  initWeddingApp();
}
