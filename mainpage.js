// ========== SESSION CHECK & USER GREETING ==========
const userName = localStorage.getItem('name') || "Martian";
document.getElementById('userGreeting').textContent = `Hi, ${userName}!`;

if (!localStorage.getItem('loggedIn')) {
  window.location.href = "auth/index.html";
}

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  sessionStorage.clear();
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

// ========== ANNOUNCEMENTS FEED (MOCK DATA) ==========
const announcements = [
  { title: "Mid-Sem Exam Dates Released", desc: "Check the schedule for all subjects.", date: "2025-04-29", priority: "high" },
  { title: "Project Group Allocation", desc: "Find your group and mentor for the Martian Habitat Project.", date: "2025-04-28", priority: "medium" },
  { title: "Club Registrations Open", desc: "Join the Civil Innovators Club for workshops and fun!", date: "2025-04-27", priority: "low" }
];
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
renderAnnouncements();

// ========== SCHEDULES FOR A1, A2, A3 ==========
const schedules = {
  A1: [
    { subject: "Structural Analysis", time: "09:00", location: "Room A1" },
    { subject: "Martian Geology", time: "11:00", location: "Lab 2" },
    { subject: "Lunar Hydraulics", time: "13:00", location: "Room B2" },
    { subject: "Terraforming Ethics", time: "15:00", location: "Seminar Hall" }
  ],
  A2: [
    { subject: "Martian Geology", time: "09:00", location: "Lab 2" },
    { subject: "Structural Analysis", time: "11:00", location: "Room A2" },
    { subject: "Terraforming Ethics", time: "13:00", location: "Seminar Hall" },
    { subject: "Lunar Hydraulics", time: "15:00", location: "Room B3" }
  ],
  A3: [
    { subject: "Lunar Hydraulics", time: "09:00", location: "Room B3" },
    { subject: "Terraforming Ethics", time: "11:00", location: "Seminar Hall" },
    { subject: "Martian Geology", time: "13:00", location: "Lab 3" },
    { subject: "Structural Analysis", time: "15:00", location: "Room A3" }
  ]
};

function renderSchedule(subsection = "A1") {
  const timeline = document.getElementById('scheduleTimeline');
  timeline.innerHTML = "";
  const schedule = schedules[subsection];
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
const userSubsection = localStorage.getItem('subsection') || "A1";
subsectionSelect.value = userSubsection;
renderSchedule(userSubsection);

subsectionSelect.onchange = (e) => {
  localStorage.setItem('subsection', e.target.value);
  renderSchedule(e.target.value);
};

// ========== QUICK LINKS ==========
document.querySelectorAll('.quicklink-btn').forEach(btn => {
  btn.onclick = () => alert(`Navigate to ${btn.dataset.link} (integrate with router/Firebase as needed)`);
});

// ========== DAILY KNOWLEDGE BUBBLE ==========
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

// ========== UPCOMING EVENTS COUNTDOWN (MOCK) ==========
const nextEvent = {
  title: "Interplanetary Fest",
  date: "2025-05-05T10:00:00Z"
};
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
  document.getElementById('eventTitle').textContent = nextEvent.title;
  setTimeout(updateCountdown, 1000);
}
updateCountdown();
document.getElementById('rsvpBtn').onclick = () => alert("RSVP submitted! (Firebase integration here)");
document.getElementById('calendarBtn').onclick = () => alert("Add to calendar (ICS export or Google Calendar link)");

// ========== GALLERY CAROUSEL (MOCK) ==========
const galleryImages = [
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", alt: "Freshers' Day" },
  { url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", alt: "Expo" },
  { url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=400&q=80", alt: "Study Marathon" },
  { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80", alt: "Mars Friends" },
  { url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", alt: "Project Build" }
];
let galleryIdx = 0;
function renderGallery() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = "";
  for (let i = 0; i < 3; i++) {
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
renderGallery();

// ========== STUDENT CORNER (MOCK ROTATING QUOTES) ==========
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

// ========== PROJECTS & CLUBS (MOCK) ==========
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

// ========== MARTIAN WEATHER WIDGET (FICTIONAL) ==========
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
