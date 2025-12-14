// GANTI URL BERIKUT DENGAN WEB APP URL HASIL DEPLOY APPS SCRIPT
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZa2BeDatvUkt2PXDTzkAbX8QH3ItbjLdR99BIIBhgER-KU2-cYyla03mybuDCbFYj/exec";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => { window.scrollTo(0, 0); });

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || "";
}
(function fillGuestName() {
    const name = getQueryParam("to");
    const el = document.getElementById("guestNameCover");
    if (el) el.textContent = name ? name : "Bapak/Ibu/Saudara/i";
})();

const cover = document.getElementById("cover");
const btnOpenCover = document.getElementById("btnOpenCover");
const bgm = document.getElementById("bgm");
const fabMusicLabel = document.getElementById("fabMusicLabel");
let bgmStarted = false;

btnOpenCover.addEventListener("click", () => {
    cover.style.display = "none";
    document.body.classList.remove("locked");
    document.body.classList.add("unlocked");
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });

    if (bgm && !bgmStarted) {
    bgm.volume = 0.8;
    bgm.play().then(() => {
        bgmStarted = true;
        fabMusicLabel.textContent = "Musik Menyala";
    }).catch(() => {});
    }
});

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});
document.querySelectorAll(".nav-links button[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-scroll");
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    if (window.innerWidth <= 768) navLinks.classList.remove("open");
    });
});

document.getElementById("fabRSVP").addEventListener("click", () => {
    document.getElementById("rsvp").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("fabMusic").addEventListener("click", () => {
    if (!bgm) return;
    if (bgm.paused) {
    bgm.play().then(() => {
        bgmStarted = true;
        fabMusicLabel.textContent = "Musik Menyala";
    }).catch(() => {});
    } else {
    bgm.pause();
    fabMusicLabel.textContent = "Musik Dimatikan";
    }
});
document.getElementById("backToTop").addEventListener("click", () => {
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
});

// Reveal on scroll
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
        });
    },
    { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("show"));
}

// Countdown
(function initCountdown() {
    const targetDate = new Date("2025-12-28T07:30:00+07:00");
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");
    const finishMsg = document.getElementById("countdown-finish");
    const countdownBox = document.getElementById("countdown");

    function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
        countdownBox.style.display = "none";
        finishMsg.style.display = "block";
        clearInterval(timer);
        return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
})();

// Salin teks (rekening / alamat)
document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy-target");
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const text = targetEl.innerText || targetEl.textContent || "";
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    const original = btn.innerHTML;
    btn.innerHTML = "✅ Tersalin";
    setTimeout(() => { btn.innerHTML = original; }, 1500);
    });
});

/* ================== LOVE STORY CAROUSEL ================== */
/* ==================== LOVE STORY CAROUSEL + PROGRESS ==================== */
(function () {
    const slides  = Array.from(document.querySelectorAll('.story-slide'));
    const dots    = Array.from(document.querySelectorAll('.story-dot'));
    const btnPrev = document.getElementById('storyPrev');
    const btnNext = document.getElementById('storyNext');

    // PROGRESS: line + teks step
    const progressFill  = document.getElementById('storyProgressFill');
    const stepLabels    = Array.from(document.querySelectorAll('.story-progress-step'));

    if (!slides.length) return;

    const totalSlides = slides.length;        // harus sama jumlahnya dengan step dan dot
    let currentIndex  = 0;
    let isAnimating   = false;

    // Helper: bersihkan class animasi pada satu slide
    function resetSlideClasses(slide) {
    slide.classList.remove(
        'active',
        'enter-from-right',
        'enter-from-left',
        'exit-to-left',
        'exit-to-right'
    );
    }

    // UPDATE SEMUA STATE (slide, dot, step, progress bar)
    function updateStoryState() {
    // pastikan index selalu loop
    currentIndex = (currentIndex + totalSlides) % totalSlides;

    // slide aktif
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });

    // dot indikator (kalau ada)
    if (dots.length) {
        dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        });
    }

    // label step (Awal, Pertemuan, dst)
    if (stepLabels.length) {
        stepLabels.forEach((step, i) => {
        step.classList.toggle('active', i === currentIndex);
        });
    }

    // progress bar (0% di langkah pertama, 100% di langkah terakhir)
    if (progressFill && totalSlides > 1) {
        const percent = (currentIndex / (totalSlides - 1)) * 100;  // 0, 25, 50, 75, 100
        progressFill.style.width = percent + '%';
        progressFill.setAttribute('aria-valuenow', String(currentIndex + 1));
        progressFill.setAttribute('aria-valuemax', String(totalSlides));
    }
    }

    // ANIMASI PINDAH SLIDE
    function goToStory(targetIndex, direction) {
    if (isAnimating || !slides.length) return;
    isAnimating = true;

    const oldIndex = currentIndex;
    const newIndex = (targetIndex + totalSlides) % totalSlides; // loop

    if (oldIndex === newIndex) {
        isAnimating = false;
        return;
    }

    const oldSlide = slides[oldIndex];
    const newSlide = slides[newIndex];

    resetSlideClasses(oldSlide);
    resetSlideClasses(newSlide);

    // posisi awal slide baru + arah animasi
    if (direction === 'next') {
        oldSlide.classList.add('active', 'exit-to-left');
        newSlide.classList.add('enter-from-right');
    } else {
        oldSlide.classList.add('active', 'exit-to-right');
        newSlide.classList.add('enter-from-left');
    }

    // paksa reflow supaya animasi kebaca
    void newSlide.offsetWidth;

    newSlide.classList.add('active');

    setTimeout(() => {
        resetSlideClasses(oldSlide);
        newSlide.classList.remove(
        'enter-from-right',
        'enter-from-left',
        'exit-to-left',
        'exit-to-right'
        );
        newSlide.classList.add('active');

        currentIndex = newIndex;
        updateStoryState();
        isAnimating = false;
    }, 450); // sama dengan durasi transition di CSS
    }

    // TOMBOL NEXT / PREV
    if (btnNext) {
    btnNext.addEventListener('click', () => {
        goToStory(currentIndex + 1, 'next');
    });
    }
    if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        goToStory(currentIndex - 1, 'prev');
    });
    }

    // KLIK DOT (bawah slide bulat-bulat)
    if (dots.length) {
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
        if (i === currentIndex) return;
        const direction = i > currentIndex ? 'next' : 'prev';
        goToStory(i, direction);
        });
    });
    }

    // KLIK STEP TEKS ("Awal", "Pertemuan", dst)
    if (stepLabels.length) {
    stepLabels.forEach((step, i) => {
        step.addEventListener('click', () => {
        if (i === currentIndex) return;
        const direction = i > currentIndex ? 'next' : 'prev';
        goToStory(i, direction);
        });
    });
    }

    // SWIPE (HP)
    let startX = 0;
    let isTouching = false;

    function handleTouchStart(e) {
    isTouching = true;
    startX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
    if (!isTouching) return;
    // bisa ditambah efek drag kalau mau
    }

    function handleTouchEnd(e) {
    if (!isTouching) return;
    isTouching = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
        goToStory(currentIndex + 1, 'next'); // swipe kiri → next
        } else {
        goToStory(currentIndex - 1, 'prev'); // swipe kanan → prev
        }
    }
    }

    const storyTrack = document.querySelector('.story-track');
    if (storyTrack) {
    storyTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
    storyTrack.addEventListener('touchmove', handleTouchMove, { passive: true });
    storyTrack.addEventListener('touchend', handleTouchEnd);
    }

    // INIT PERTAMA
    updateStoryState();
})();


/* ================== RSVP & REKAP ================== */
const rsvpSummary = { hadir: 0, belum: 0, tidak: 0 };

function renderRsvpSummary() {
    const hadirEl = document.getElementById("rsvpSumHadir");
    const belumEl = document.getElementById("rsvpSumBelum");
    const tidakEl = document.getElementById("rsvpSumTidak");
    const totalEl = document.getElementById("rsvpSumTotal");

    if (!hadirEl) return;

    hadirEl.textContent = rsvpSummary.hadir;
    belumEl.textContent = rsvpSummary.belum;
    tidakEl.textContent = rsvpSummary.tidak;

    const total = rsvpSummary.hadir + rsvpSummary.belum + rsvpSummary.tidak;
    totalEl.textContent = total;
}

async function loadRsvpSummaryFromServer() {
    if (!SHEET_SCRIPT_URL || SHEET_SCRIPT_URL.indexOf("PASTE_APPS_SCRIPT_WEB_APP_URL_HERE") !== -1) {
    renderRsvpSummary();
    return;
    }
    try {
    const res = await fetch(SHEET_SCRIPT_URL + "?type=rsvp_stats");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    rsvpSummary.hadir = parseInt(data.hadir || 0, 10) || 0;
    rsvpSummary.belum = parseInt(data.belum || 0, 10) || 0;
    rsvpSummary.tidak = parseInt(data.tidak || 0, 10) || 0;
    } catch (err) {
    console.log("Gagal load rekap RSVP dari server:", err);
    }
    renderRsvpSummary();
}

document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value.trim();
    const phone = document.getElementById("rsvpPhone").value.trim();
    const status = document.getElementById("rsvpStatus").value;
    const guests = document.getElementById("rsvpGuests").value || "1";
    const msg = document.getElementById("rsvpMessage").value.trim();
    const statusMsg = document.getElementById("rsvpStatusMsg");
    if (!name) return;

    const payload = {
    type: "rsvp",
    nama: name,
    whatsapp: phone,
    status: status,
    jumlah: guests,
    ucapan: msg,
    };

    statusMsg.textContent = "Mengirim data RSVP.";

    try {
    // Kirim sebagai x-www-form-urlencoded + no-cors (fire & forget)
    const formBody = new URLSearchParams(payload).toString();

    await fetch(SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
    });

    // Karena mode: "no-cors", kita TIDAK bisa baca res.json().
    // Tapi request tetap terkirim ke Apps Script.

    statusMsg.textContent = "RSVP berhasil dikirim. Terima kasih 🙏";

    // update ringkas lokal
    if (status === "Insya Allah Hadir") rsvpSummary.hadir += 1;
    else if (status === "Belum Pasti") rsvpSummary.belum += 1;
    else if (status === "Maaf Tidak Bisa Hadir") rsvpSummary.tidak += 1;
    renderRsvpSummary();

    this.reset();
    } catch (err) {
    console.log("Gagal kirim RSVP:", err);
    statusMsg.textContent = "Gagal mengirim RSVP. Mohon coba lagi beberapa saat.";
    }
});

/* ================== GUESTBOOK ================== */
const guestListEl = document.getElementById("guestList");

function renderGuestEmpty() {
    guestListEl.innerHTML = '<div class="guest-empty">Belum ada ucapan yang masuk. Jadilah yang pertama mengirimkan doa terbaik untuk kedua mempelai. 🤍</div>';
}

function addGuestCard(item, prepend = false) {
    const div = document.createElement("div");
    div.className = "guest-card";
    const initial = (item.nama || "?").trim().charAt(0).toUpperCase();
    const waktu = item.waktu || "";
    div.innerHTML = `
    <div class="guest-card-header">
        <div class="guest-avatar">${initial || "🤍"}</div>
        <div class="guest-card-meta-wrap">
        <div class="guest-card-name">${item.nama || "Tamu"}</div>
        <div class="guest-card-meta">
            ${(item.hubungan || "Tamu Undangan")}${waktu ? " • " + waktu : ""}
        </div>
        </div>
    </div>
    <div class="guest-quote">${item.ucapan || ""}</div>
    `;
    if (prepend && guestListEl.firstChild) {
    guestListEl.insertBefore(div, guestListEl.firstChild);
    } else {
    guestListEl.appendChild(div);
    }
}

async function loadGuestbook() {
    // Kalau URL belum diganti, langsung tampilkan state kosong
    if (
    !SHEET_SCRIPT_URL ||
    SHEET_SCRIPT_URL.indexOf("PASTE_APPS_SCRIPT_WEB_APP_URL_HERE") !== -1
    ) {
    renderGuestEmpty();
    return;
    }

    try {
    const res = await fetch(SHEET_SCRIPT_URL + "?type=guestbook");
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();

    // sesuai Apps Script: { entries: [...] }
    const entries = Array.isArray(data)
        ? data
        : Array.isArray(data.entries)
        ? data.entries
        : [];

    guestListEl.innerHTML = "";

    if (!entries.length) {
        renderGuestEmpty();
        return;
    }

    entries.forEach((item) => {
        // item: { nama, hubungan, ucapan, tanggal }
        addGuestCard(item);
    });
    } catch (err) {
    console.log("Gagal load guestbook:", err);
    renderGuestEmpty();
    }
}

document.getElementById("guestForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama = document.getElementById("guestName").value.trim();
    const hubungan = document.getElementById("guestRelation").value.trim();
    const ucapan = document.getElementById("guestMessage").value.trim();

    if (!nama || !ucapan) return;

    const payload = {
    type: "guestbook",
    nama,
    hubungan,
    ucapan,
    tanggal: new Date().toISOString() // dikirim ke Apps Script (boleh kosong, AS sudah handle)
    };

    const hint = this.querySelector(".small-hint");
    if (hint) {
    hint.style.opacity = "1";
    hint.textContent = "Mengirim ucapan...";
    }

    try {
    const formBody = new URLSearchParams(payload).toString();

    await fetch(SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
    });

    // Tidak bisa baca res.json(), tapi data terkirim.

    if (hint) {
        hint.textContent = "Ucapan berhasil dikirim. Terima kasih 🤍";
        setTimeout(() => (hint.style.opacity = "0"), 1800);
    }

    addGuestCard(
        {
        nama,
        hubungan,
        ucapan,
        tanggal: "Baru saja"
        },
        true
    );

    this.reset();
    } catch (err) {
    console.error("Gagal kirim guestbook:", err);
    if (hint) {
        hint.textContent = "Gagal mengirim ucapan. Mohon coba lagi.";
        hint.style.opacity = "1";
    }
    }
});

/* ================== GALLERY LIGHTBOX ================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
let currentGalleryIndex = 0;

function openLightbox(index) {
    if (!galleryItems.length) return;
    if (index < 0 || index >= galleryItems.length) index = 0;
    currentGalleryIndex = index;
    lightboxImg.src = galleryItems[index].src;
    lightbox.classList.add("open");
    document.body.classList.add("locked");
}

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("locked");
}

function nextGallery(delta) {
    if (!galleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex + delta + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentGalleryIndex].src;
}

galleryItems.forEach((img, idx) => {
    img.parentElement.addEventListener("click", () => openLightbox(idx));
});

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}
if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => nextGallery(-1));
}
if (lightboxNext) {
    lightboxNext.addEventListener("click", () => nextGallery(1));
}
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
    closeLightbox();
    }
});
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextGallery(1);
    if (e.key === "ArrowLeft") nextGallery(-1);
});

/* ================== SHARE ================== */
const btnShareNative = document.getElementById("btnShareNative");
const btnShareWA = document.getElementById("btnShareWA");
const btnCopyLink = document.getElementById("btnCopyLink");

const shareTitle = "Undangan Pernikahan Nisa & Fadil";
const shareText = "Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.";
const shareUrl = window.location.href;

if (btnShareNative) {
    btnShareNative.addEventListener("click", async () => {
    if (navigator.share) {
        try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        } catch (err) {
        console.log("Share dibatalkan / gagal:", err);
        }
    } else {
        // fallback copy
        if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link undangan sudah disalin.");
        } else {
        alert("Silakan salin link undangan langsung dari address bar browser.");
        }
    }
    });
}

if (btnShareWA) {
    btnShareWA.addEventListener("click", () => {
    const text = encodeURIComponent(
        "Assalamu'alaikum,\n\n" +
        "Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan Nisa & Fadil.\n\n" +
        "Berikut link undangan lengkapnya:\n" + shareUrl + "\n\n" +
        "Atas kehadiran dan doa restunya, kami ucapkan terima kasih."
    );
    const waUrl = "https://wa.me/?text=" + text;
    window.open(waUrl, "_blank");
    });
}

if (btnCopyLink) {
    btnCopyLink.addEventListener("click", async () => {
    try {
        if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link undangan berhasil disalin.");
        } else {
        const temp = document.createElement("textarea");
        temp.value = shareUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        alert("Link undangan berhasil disalin.");
        }
    } catch (err) {
        alert("Gagal menyalin link. Silakan salin langsung dari address bar.");
    }
    });
}

// Inisialisasi data dari server setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
    loadRsvpSummaryFromServer();
    loadGuestbook();
});