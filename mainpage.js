// Firebase imports (ES6 modules; for CDN, use window.firebase)
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, onSnapshot, collection, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlFYzg5Te2jz-kVKXd0yGYlJkMwU9fxss",
  authDomain: "ju-civil-a-martian.firebaseapp.com",
  projectId: "ju-civil-a-martian",
  storageBucket: "ju-civil-a-martian.appspot.com",
  messagingSenderId: "247448010406",
  appId: "1:247448010406:web:a2efa79a4080513cc87e67",
  measurementId: "G-BXYMLKE395"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========== SESSION CHECK & USER GREETING ==========
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth/index.html";
    return;
  }
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    alert("Profile not found!");
    await signOut(auth);
    window.location.href = "auth/index.html";
    return;
  }
  const data = userDoc.data();
  document.getElementById('userGreeting').textContent = `Hi, ${data.name}!`;
  if (data.role === "admin") {
    window.location.href = "admin.html";
  }
});

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = async () => {
  await signOut(auth);
  window.location.href = "auth/index.html";
};

// ========== PROFILE BUTTON ==========
document.getElementById('profileBtn').onclick = () => {
  window.location.href = "profile.html";
};

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
let darkMode = true;
themeToggle.onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  themeToggle.textContent = darkMode ? "🌑" : "☀️";
};
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.body.classList.add('light');
  themeToggle.textContent = "☀️";
  darkMode = false;
}

// ========== REAL-TIME ANNOUNCEMENTS ==========
let announcements = [];
onSnapshot(
  query(collection(db, "announcements"), orderBy("createdAt", "desc")),
  (snapshot) => {
    announcements = [];
    snapshot.forEach(doc => announcements.push(doc.data()));
    renderAnnouncements(document.getElementById('announcementFilter').value || "all");
  }
);
function renderAnnouncements(filter = "all") {
  const feed = document.getElementById('announcementsFeed');
  feed.innerHTML = "";
  let filtered = announcements;
  if (filter === "today") {
    const today = new Date().toISOString().slice(0, 10);
    filtered = announcements.filter(a => a.date === today);
  } else if (filter === "high") {
    filtered = announcements.filter(a => a.priority === "high");
  }
  filtered.forEach(a => {
    const div = document.createElement('li');
    div.className = "announcement " + (a.priority || "");
    div.innerHTML = `<div>
      <b>${a.title}</b><br>
      <span>${a.desc}</span>
    </div>
    <span class="priority">${a.priority ? a.priority.charAt(0).toUpperCase() + a.priority.slice(1) : ""}</span>
    <span class="date">${a.date}</span>`;
    feed.appendChild(div);
  });
}
document.getElementById('announcementFilter').onchange = (e) => renderAnnouncements(e.target.value);

// ========== REAL-TIME SCHEDULE ==========
let schedules = { A1: [], A2: [], A3: [] };
onSnapshot(collection(db, "schedule"), (snapshot) => {
  // Clear schedules
  schedules = { A1: [], A2: [], A3: [] };
  snapshot.forEach(doc => {
    const s = doc.data();
    if (s.subsection && schedules[s.subsection]) schedules[s.subsection].push(s);
  });
  renderSchedule(document.getElementById('subsectionSelect').value || "A1");
});
function renderSchedule(subsection = "A1") {
  const timeline = document.getElementById('scheduleTimeline');
  timeline.innerHTML = "";
  const schedule = schedules[subsection] || [];
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  let nextIdx = schedule.findIndex(s => {
    const [h, m] = s.time.split(":").map(Number);
    return h * 60 + m > current;
  });
  if (nextIdx === -1) nextIdx = schedule.length - 1;
  schedule.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = "schedule-item" + (i === nextIdx ? " next" : "");
    div.innerHTML = `<span class="schedule-time">${s.time}</span>
      <span><b>${s.subject}</b></span>
      <span class="schedule-location">${s.location}</span>`;
    timeline.appendChild(div);
  });
}
const subsectionSelect = document.getElementById('subsectionSelect');
subsectionSelect.onchange = (e) => renderSchedule(e.target.value);

// ========== REAL-TIME GALLERY CAROUSEL ==========
let galleryImages = [];
onSnapshot(query(collection(db, "gallery"), orderBy("uploadedAt", "desc")), (snapshot) => {
  galleryImages = [];
  snapshot.forEach(doc => galleryImages.push({ url: doc.data().img, alt: doc.data().caption }));
  renderGallery();
});
let galleryIdx = 0;
function renderGallery() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = "";
  for (let i = 0; i < 3 && galleryImages.length > 0; i++) {
    const imgIdx = (galleryIdx + i) % galleryImages.length;
    const img = document.createElement('img');
    img.src = galleryImages[imgIdx].url;
    img.alt = galleryImages[imgIdx].alt;
    img.className = "carousel-img";
    img.onclick = () => window.location.href = "#gallery";
    track.appendChild(img);
  }
}
document.getElementById('galleryPrev').onclick = () => {
  galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
  renderGallery();
};
document.getElementById('galleryNext').onclick = () => {
  galleryIdx = (galleryIdx + 1) % galleryImages.length;
  renderGallery();
};

// ========== REAL-TIME EVENTS ==========
let eventsList = [];
onSnapshot(query(collection(db, "events"), orderBy("createdAt", "desc")), (snapshot) => {
  eventsList = [];
  snapshot.forEach(doc => eventsList.push(doc.data()));
  if (eventsList.length > 0) {
    const nextEvent = eventsList[0];
    document.getElementById('eventTitle').textContent = nextEvent.title;
    // Countdown logic as before
    function updateCountdown() {
      const now = new Date();
      const eventDate = new Date(nextEvent.date);
      const diff = eventDate - now;
      if (diff <= 0) {
        document.getElementById('eventCountdown').textContent = "Event is live!";
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      document.getElementById('eventCountdown').textContent =
        `${d}d ${h}h ${m}m ${s}s`;
      setTimeout(updateCountdown, 1000);
    }
    updateCountdown();
  }
});

// ========== REAL-TIME RESOURCES ==========
let resources = [];
onSnapshot(query(collection(db, "resources"), orderBy("uploadedAt", "desc")), (snapshot) => {
  resources = [];
  snapshot.forEach(doc => resources.push(doc.data()));
  // You can now use the resources array to update your resources UI
});

// ========== QUICK LINKS ==========
document.querySelectorAll('.quicklink-btn').forEach(btn => {
  btn.onclick = () => alert(`Navigate to ${btn.dataset.link} (integrate with router/Firebase as needed)`);
});

// ========== DAILY KNOWLEDGE BUBBLE (STATIC) ==========
const knowledgeBubbles = [
  "Did you know? Mars has the largest volcano in the solar system: Olympus Mons.",
  "Civil engineers on Mars use regolith bricks for habitats.",
  "Martian dust storms can last for weeks-plan your site visits accordingly!",
  "Mars' gravity is only 38% of Earth's. Structures need less support but more insulation.",
  "The first Martian highway is planned for 2027-get ready!"
];
function renderKnowledgeBubble() {
  const idx = Math.floor(Math.random() * knowledgeBubbles.length);
  document.getElementById('dailyKnowledge').textContent = knowledgeBubbles[idx];
}
renderKnowledgeBubble();

// ========== STUDENT CORNER (STATIC, or you can fetch from Firestore) ==========
const studentMemories = [
  { text: "Best Martian field trip ever!", name: "Aditi, A2" },
  { text: "Built my first regolith bridge!", name: "Rahul, A1" },
  { text: "Night study marathons are the best.", name: "Priya, A3" },
  { text: "Mars sunrise is out of this world.", name: "Sam, A1" }
];
let memoryIdx = 0;
function renderStudentCorner() {
  const mem = studentMemories[memoryIdx];
  document.getElementById('studentCorner').innerHTML =
    `<blockquote>"${mem.text}"<br><span>- ${mem.name}</span></blockquote>`;
  memoryIdx = (memoryIdx + 1) % studentMemories.length;
  setTimeout(renderStudentCorner, 6000);
}
renderStudentCorner();
document.getElementById('submitMemoryBtn').onclick = () =>
  alert("Submit your memory (admin approval required, integrate with Firebase)!");

// ========== PROJECTS & CLUBS (STATIC, or fetch from Firestore) ==========
const projects = [
  { title: "Mars Rover Bridge", team: "Team Ares", status: "Ongoing" },
  { title: "Hydroponics Dome", team: "GreenMartians", status: "Completed" },
  { title: "Martian Habitat AI", team: "RedBrains", status: "Ongoing" },
  { title: "Mars Radio Club", team: "ComMartians", status: "Recruiting" }
];
function renderProjects(filter = "") {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = "";
  projects
    .filter(p => !filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.team.toLowerCase().includes(filter.toLowerCase()))
    .forEach(p => {
      const div = document.createElement('div');
      div.className = "project-card";
      div.innerHTML = `<div class="project-title">${p.title}</div>
        <div class="project-team">Team: ${p.team}</div>
        <div class="project-status">Status: ${p.status}</div>`;
      grid.appendChild(div);
    });
}
renderProjects();
document.getElementById('searchBar').oninput = (e) => renderProjects(e.target.value);

// ========== MARTIAN WEATHER WIDGET (STATIC) ==========
const weatherStates = [
  { icon: "🪐", desc: "Clear Skies", temp: "-60°C" },
  { icon: "🌪️", desc: "Dust Storm", temp: "-55°C" },
  { icon: "☄️", desc: "Meteor Shower", temp: "-70°C" },
  { icon: "💨", desc: "Windy", temp: "-65°C" },
  { icon: "🌫️", desc: "Thin Fog", temp: "-68°C" }
];
function renderWeather() {
  const idx = Math.floor(Math.random() * weatherStates.length);
  const w = weatherStates[idx];
  document.getElementById('martianWeather').innerHTML =
    `<span class="weather-icon">${w.icon}</span>
     <span class="weather-desc">${w.desc}</span>
     <span class="weather-temp">${w.temp}</span>`;
}
renderWeather();

// ========== ANIMATED SCROLL REVEALS ==========
AOS.init({
  duration: 900,
  easing: "ease-out-cubic",
  once: false,
  mirror: false
});
