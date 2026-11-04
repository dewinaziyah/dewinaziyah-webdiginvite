/* ==========================================================================
   DIGITAL WEDDING INVITATION - JAVASCRIPT
   Proyek Prototype Undangan Digital
   Ditulis dengan Vanilla JavaScript murni (Tanpa Library / Framework)
   ========================================================================== */

// ===== DATA UNDANGAN MAIN CONFIGURATION =====
// Tim dapat mengganti bagian ini dengan mudah ketika ada customer baru:
const invitationData = {
  couple: {
    bride: {
      name: "Dewi Naziyah",
      shortName: "Dewi",
      parents: "Putri pertama dari Bapak H. Ahmad & Ibu Hj. Siti",
      photo: "images/bride.jpg",
      instagram: "dewinaziyah"
    },
    groom: {
      name: "Fulan",
      shortName: "Fulan",
      parents: "Putra pertama dari Bapak H. Budi & Ibu Hj. Aminah",
      photo: "images/groom.jpg",
      instagram: "fulan_wedding"
    }
  },
  event: {
    title: "THE WEDDING OF DEWI & FULAN",
    targetDateISO: "2026-12-20T10:00:00", // Format: YYYY-MM-DDTHH:mm:ss
    displayDate: "Minggu, 20 Desember 2026",
    akad: {
      date: "Minggu, 20 Desember 2026",
      time: "09.00 WIB – Selesai",
      location: "Gedung Serbaguna UNUSIDA",
      address: "Jl. Lingkar Timur, Sidoarjo"
    },
    reception: {
      date: "Minggu, 20 Desember 2026",
      time: "11.00 WIB – Selesai",
      location: "Gedung Serbaguna UNUSIDA",
      address: "Jl. Lingkar Timur, Sidoarjo"
    },
    googleMapsUrl: "https://maps.google.com/?q=Gedung+Serbaguna+UNUSIDA+Sidoarjo"
  },
  gift: {
    bank1: {
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountHolder: "Dewi Naziyah"
    },
    bank2: {
      bankName: "Bank Mandiri",
      accountNumber: "0987654321",
      accountHolder: "Fulan"
    }
  },
  story: [
    {
      year: "2023",
      title: "First Meeting",
      description: "Kami pertama kali bertemu di salah satu kegiatan organisasi kampus UNUSIDA Sidoarjo. Awal perkenalan yang sederhana namun penuh kesan."
    },
    {
      year: "2024",
      title: "Getting Closer",
      description: "Seiring berjalannya waktu, komunikasi semakin hangat. Kami mulai saling mengenal keluarga dan mendukung satu sama lain."
    },
    {
      year: "2026",
      title: "The Beginning",
      description: "Dengan memohon ridho Allah SWT dan restu kedua orang tua, kami mantap melangkah ke jenjang pernikahan yang suci."
    }
  ],
  gallery: [
    { src: "images/gallery-1.jpg", caption: "Momen Prewedding Outdoors" },
    { src: "images/gallery-2.jpg", caption: "Cincin Pernikahan Simbol Ikatan" },
    { src: "images/gallery-3.jpg", caption: "Dekorasi Venue Impian" },
    { src: "images/gallery-4.jpg", caption: "Kebersamaan Penuh Senyuman" },
    { src: "images/gallery-5.jpg", caption: "Suasana Hangat Keluarga" },
    { src: "images/gallery-6.jpg", caption: "Persiapan Menuju Hari H" }
  ]
};

// Global variables
let isAudioPlaying = false;
let audioContext = null;
let currentGalleryIndex = 0;

// ===== INITIALIZATION WHEN DOM IS READY =====
document.addEventListener("DOMContentLoaded", function () {
  initGuestName();
  initDynamicData();
  initCountdown();
  initGalleryModal();
  initRSVP();
  initNavigation();
  initAudio();
});

/* --------------------------------------------------------------------------
   1. PERSONALIZED GUEST (URL PARAMETER ?guest=Nama)
   Secara otomatis mengambil parameter nama tamu dari URL
   -------------------------------------------------------------------------- */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("guest");

  // KEAMANAN DASAR:
  // Menggunakan textContent agar data dari URL tidak dieksekusi sebagai tag HTML/XSS!
  const guestDisplayName = (guestParam && guestParam.trim() !== "") 
    ? guestParam.trim() 
    : "Tamu Undangan";

  // Set di Opening Screen
  const openingGuestElement = document.getElementById("opening-guest-name");
  if (openingGuestElement) {
    openingGuestElement.textContent = guestDisplayName;
  }

  // Set di RSVP Form Nama (jika input nama kosong)
  const rsvpNameInput = document.getElementById("rsvp-name");
  if (rsvpNameInput && guestParam) {
    rsvpNameInput.value = guestDisplayName;
  }
}

/* --------------------------------------------------------------------------
   2. ISI DATA DINAMIS KE HALAMAN
   -------------------------------------------------------------------------- */
function initDynamicData() {
  // Opening & Hero
  setText("opening-couple-names", `${invitationData.couple.bride.shortName} & ${invitationData.couple.groom.shortName}`);
  setText("hero-couple-names", `${invitationData.couple.bride.shortName.toUpperCase()} & ${invitationData.couple.groom.shortName.toUpperCase()}`);
  setText("hero-date", invitationData.event.displayDate);

  // Bride details
  setText("bride-name", invitationData.couple.bride.name);
  setText("bride-parents", invitationData.couple.bride.parents);
  setImage("bride-photo", invitationData.couple.bride.photo, invitationData.couple.bride.name);

  // Groom details
  setText("groom-name", invitationData.couple.groom.name);
  setText("groom-parents", invitationData.couple.groom.parents);
  setImage("groom-photo", invitationData.couple.groom.photo, invitationData.couple.groom.name);

  // Akad details
  setText("akad-date", invitationData.event.akad.date);
  setText("akad-time", invitationData.event.akad.time);
  setText("akad-location", invitationData.event.akad.location);
  setText("akad-address", invitationData.event.akad.address);

  // Reception details
  setText("reception-date", invitationData.event.reception.date);
  setText("reception-time", invitationData.event.reception.time);
  setText("reception-location", invitationData.event.reception.location);
  setText("reception-address", invitationData.event.reception.address);

  // Venue location section
  setText("venue-name-display", invitationData.event.akad.location);
  setText("venue-address-display", invitationData.event.akad.address);

  // Google Maps link
  const mapsBtn = document.getElementById("btn-google-maps");
  if (mapsBtn) {
    mapsBtn.href = invitationData.event.googleMapsUrl;
  }

  // Bank Gift info
  setText("bank1-name", invitationData.gift.bank1.bankName);
  setText("bank1-number", invitationData.gift.bank1.accountNumber);
  setText("bank1-holder", invitationData.gift.bank1.accountHolder);
  
  setText("bank2-name", invitationData.gift.bank2.bankName);
  setText("bank2-number", invitationData.gift.bank2.accountNumber);
  setText("bank2-holder", invitationData.gift.bank2.accountHolder);

  // Set story timeline
  renderLoveStory();
  
  // Set gallery images
  renderGallery();
}

// Helper function untuk set text safely
function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.textContent = text;
  }
}

// Helper function untuk set image safely
function setImage(id, src, alt) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.src = src;
    elem.alt = alt || "Foto Undangan";
  }
}

/* --------------------------------------------------------------------------
   3. OPENING FLOW
   Dijalankan ketika tombol "Buka Undangan" ditekan
   -------------------------------------------------------------------------- */
function openInvitation() {
  const openingScreen = document.getElementById("opening-screen");
  if (openingScreen) {
    openingScreen.classList.add("fade-out");
  }

  // Izinkan scroll halaman kembali
  document.body.classList.remove("modal-open");

  // Jalankan musik background
  playAudio();

  // Scroll smooth ke hero section
  const heroSection = document.getElementById("hero");
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: "smooth" });
  }
}

/* --------------------------------------------------------------------------
   4. REAL-TIME COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdown() {
  const targetTime = new Date(invitationData.event.targetDateISO).getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    const daysElem = document.getElementById("days");
    const hoursElem = document.getElementById("hours");
    const minutesElem = document.getElementById("minutes");
    const secondsElem = document.getElementById("seconds");
    const endedElem = document.getElementById("countdown-ended");
    const timerWrapper = document.getElementById("countdown-boxes");

    if (difference <= 0) {
      if (timerWrapper) timerWrapper.style.display = "none";
      if (endedElem) endedElem.style.display = "block";
      return;
    }

    // Perhitungan matematika waktu
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysElem) daysElem.textContent = days < 10 ? "0" + days : days;
    if (hoursElem) hoursElem.textContent = hours < 10 ? "0" + hours : hours;
    if (minutesElem) minutesElem.textContent = minutes < 10 ? "0" + minutes : minutes;
    if (secondsElem) secondsElem.textContent = seconds < 10 ? "0" + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   5. LOVE STORY TIMELINE RENDERER
   -------------------------------------------------------------------------- */
function renderLoveStory() {
  const container = document.getElementById("story-timeline");
  if (!container) return;

  // Bersihkan konten awal secara aman
  container.textContent = "";

  invitationData.story.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "timeline-item";

    const dot = document.createElement("div");
    dot.className = "timeline-dot";

    const contentDiv = document.createElement("div");
    contentDiv.className = "timeline-content";

    const yearDiv = document.createElement("div");
    yearDiv.className = "timeline-year";
    yearDiv.textContent = item.year;

    const titleH4 = document.createElement("h4");
    titleH4.className = "timeline-title";
    titleH4.textContent = item.title;

    const descP = document.createElement("p");
    descP.className = "timeline-desc";
    descP.textContent = item.description;

    contentDiv.appendChild(yearDiv);
    contentDiv.appendChild(titleH4);
    contentDiv.appendChild(descP);

    itemDiv.appendChild(dot);
    itemDiv.appendChild(contentDiv);

    container.appendChild(itemDiv);
  });
}

/* --------------------------------------------------------------------------
   6. GALLERY & MODAL LIGHTBOX
   -------------------------------------------------------------------------- */
function renderGallery() {
  const container = document.getElementById("gallery-grid");
  if (!container) return;

  container.textContent = "";

  invitationData.gallery.forEach((item, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.addEventListener("click", () => openGalleryModal(index));

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || `Foto Galeri ${index + 1}`;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";
    
    const icon = document.createElement("i");
    icon.className = "fas fa-search-plus";
    overlay.appendChild(icon);

    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);

    container.appendChild(galleryItem);
  });
}

function initGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");

  if (closeBtn) closeBtn.addEventListener("click", closeGalleryModal);
  if (prevBtn) prevBtn.addEventListener("click", prevGalleryImage);
  if (nextBtn) nextBtn.addEventListener("click", nextGalleryImage);

  // Close modal when backdrop is clicked
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeGalleryModal();
      }
    });
  }

  // Keyboard controls
  document.addEventListener("keydown", function (e) {
    if (!modal || !modal.classList.contains("active")) return;
    if (e.key === "Escape") closeGalleryModal();
    if (e.key === "ArrowLeft") prevGalleryImage();
    if (e.key === "ArrowRight") nextGalleryImage();
  });
}

function openGalleryModal(index) {
  currentGalleryIndex = index;
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");

  if (!modal || !modalImg) return;

  const currentItem = invitationData.gallery[currentGalleryIndex];
  modalImg.src = currentItem.src;
  if (modalCaption) modalCaption.textContent = currentItem.caption || "";

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  if (modal) {
    modal.classList.remove("active");
  }
  document.body.classList.remove("modal-open");
}

function prevGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + invitationData.gallery.length) % invitationData.gallery.length;
  openGalleryModal(currentGalleryIndex);
}

function nextGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % invitationData.gallery.length;
  openGalleryModal(currentGalleryIndex);
}

/* --------------------------------------------------------------------------
   7. COPY TO CLIPBOARD & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function copyToClipboard(accountNumber) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(accountNumber).then(() => {
      showToast("Nomor rekening berhasil disalin.");
    }).catch(() => {
      fallbackCopy(accountNumber);
    });
  } else {
    fallbackCopy(accountNumber);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast("Nomor rekening berhasil disalin.");
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* --------------------------------------------------------------------------
   8. RSVP FORM HANDLER & LOCALSTORAGE
   Menyimpan data konfirmasi ke localStorage dan langsung menampilkannya di daftar ucapan
   -------------------------------------------------------------------------- */
const STORAGE_KEY = "wedding_rsvp_submissions";

function initRSVP() {
  const form = document.getElementById("rsvp-form");
  if (!form) return;

  // Load existing wishes from localStorage
  renderWishes();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("rsvp-name");
    const statusSelect = document.getElementById("rsvp-status");
    const countInput = document.getElementById("rsvp-count");
    const messageInput = document.getElementById("rsvp-message");

    const name = nameInput ? nameInput.value.trim() : "";
    const status = statusSelect ? statusSelect.value : "Hadir";
    const count = countInput ? countInput.value : "1";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name) {
      alert("Mohon isi nama lengkap Anda.");
      return;
    }

    const newRsvp = {
      id: Date.now(),
      name: name,
      status: status,
      count: count,
      message: message,
      timestamp: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // Save to LocalStorage
    saveRsvpToStorage(newRsvp);

    // Reset Form
    messageInput.value = "";
    
    // Show Feedback Toast & Update Wishes List
    showToast("Terima kasih atas konfirmasi kehadirannya!");
    renderWishes();
  });
}

function getStoredRsvps() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Gagal membaca dari localStorage:", err);
    return [];
  }
}

function saveRsvpToStorage(rsvpObject) {
  const currentList = getStoredRsvps();
  currentList.unshift(rsvpObject); // Masukkan item terbaru ke urutan atas
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
  } catch (err) {
    console.error("Gagal menyimpan ke localStorage:", err);
  }
}

function renderWishes() {
  const container = document.getElementById("wishes-list");
  if (!container) return;

  container.textContent = "";

  const rsvpList = getStoredRsvps();

  if (rsvpList.length === 0) {
    const emptyP = document.createElement("p");
    emptyP.className = "prototype-notice";
    emptyP.textContent = "Belum ada ucapan. Jadilah yang pertama memberikan doa restu!";
    container.appendChild(emptyP);
    return;
  }

  rsvpList.forEach(item => {
    const card = document.createElement("div");
    card.className = "wish-item";

    const header = document.createElement("div");
    header.className = "wish-header";

    const author = document.createElement("span");
    author.className = "wish-author";
    author.textContent = item.name;

    const badge = document.createElement("span");
    badge.className = `wish-badge ${item.status === "Hadir" ? "badge-hadir" : "badge-tidak"}`;
    badge.textContent = item.status === "Hadir" ? `Hadir (${item.count} Tamu)` : "Tidak Hadir";

    header.appendChild(author);
    header.appendChild(badge);

    card.appendChild(header);

    if (item.message) {
      const msgP = document.createElement("p");
      msgP.className = "wish-message";
      msgP.textContent = item.message;
      card.appendChild(msgP);
    }

    const timeDiv = document.createElement("div");
    timeDiv.className = "wish-time";
    timeDiv.textContent = item.timestamp;
    card.appendChild(timeDiv);

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   9. AUDIO & BACKGROUND MUSIC
   -------------------------------------------------------------------------- */
function initAudio() {
  const toggleBtn = document.getElementById("music-toggle");
  const audioElement = document.getElementById("wedding-audio");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
}

function playAudio() {
  const audioElement = document.getElementById("wedding-audio");
  const toggleBtn = document.getElementById("music-toggle");

  if (audioElement) {
    audioElement.play().then(() => {
      isAudioPlaying = true;
      if (toggleBtn) toggleBtn.classList.add("playing");
    }).catch(err => {
      console.log("Autoplay dibatasi atau audio file belum siap:", err);
      // Mainkan Web Audio API Synthesizer melodi lembut sebagai cadangan
      playSynthMelody();
      isAudioPlaying = true;
      if (toggleBtn) toggleBtn.classList.add("playing");
    });
  }
}

function pauseAudio() {
  const audioElement = document.getElementById("wedding-audio");
  const toggleBtn = document.getElementById("music-toggle");

  if (audioElement) {
    audioElement.pause();
  }
  stopSynthMelody();
  isAudioPlaying = false;
  if (toggleBtn) toggleBtn.classList.remove("playing");
}

// Web Audio API Synthesizer fallback untuk melodi pernikahan romantic
let synthInterval = null;
function playSynthMelody() {
  if (audioContext) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]; // C4, E4, G4, C5, G4, E4
    let noteIdx = 0;

    synthInterval = setInterval(() => {
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[noteIdx];
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 1.2);
      noteIdx = (noteIdx + 1) % notes.length;
    }, 1200);
  } catch (e) {
    console.log("Web Audio API not supported", e);
  }
}

function stopSynthMelody() {
  if (synthInterval) clearInterval(synthInterval);
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

/* --------------------------------------------------------------------------
   10. NAVIGATION & ACTIVE SCROLL HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
