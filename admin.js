// ========== ADMIN SESSION CHECK ==========
if (!localStorage.getItem('loggedIn') || localStorage.getItem('role') !== 'admin') {
  window.location.href = "auth/index.html";
}

// ========== ADMIN GREETING ==========
const adminName = localStorage.getItem('name') || "Admin";
document.getElementById('adminGreeting').textContent = `Hi, ${adminName}!`;

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "auth/index.html";
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

// ========== CRUD LOGIC (demo, replace with Firebase for production) ==========

let announcements = [];
let gallery = [];
let schedule = [];
let events = [];
let resources = [];

function renderAnnouncements() {
  const list = document.getElementById('annList');
  list.innerHTML = "";
  announcements.forEach((a, idx) => {
    list.innerHTML += `<div class="admin-list-item">
      <span><b>${a.title}</b> (${a.date}) [${a.priority}]</span>
      <button class="admin-edit-btn" onclick="editAnnouncement(${idx})">Edit</button>
      <button class="admin-delete-btn" onclick="deleteAnnouncement(${idx})">Delete</button>
    </div>`;
  });
}
window.editAnnouncement = function(idx) {
  const a = announcements[idx];
  document.getElementById('annTitle').value = a.title;
  document.getElementById('annDesc').value = a.desc;
  document.getElementById('annDate').value = a.date;
  document.getElementById('annPriority').value = a.priority;
  deleteAnnouncement(idx);
};
window.deleteAnnouncement = function(idx) {
  announcements.splice(idx, 1);
  renderAnnouncements();
};
document.getElementById('announcementForm').onsubmit = function(e) {
  e.preventDefault();
  announcements.unshift({
    title: annTitle.value,
    desc: annDesc.value,
    date: annDate.value,
    priority: annPriority.value
  });
  renderAnnouncements();
  this.reset();
  adminMsg.textContent = "✅ Announcement saved!";
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

function renderGallery() {
  const list = document.getElementById('galleryList');
  list.innerHTML = "";
  gallery.forEach((g, idx) => {
    list.innerHTML += `<div class="admin-list-item">
      <span><img src="${g.img}" alt="" style="width:32px;height:24px;border-radius:6px;margin-right:8px;vertical-align:middle;">${g.caption}</span>
      <button class="admin-edit-btn" onclick="editGallery(${idx})">Edit</button>
      <button class="admin-delete-btn" onclick="deleteGallery(${idx})">Delete</button>
    </div>`;
  });
}
window.editGallery = function(idx) {
  const g = gallery[idx];
  document.getElementById('galleryImg').value = g.img;
  document.getElementById('galleryCaption').value = g.caption;
  deleteGallery(idx);
};
window.deleteGallery = function(idx) {
  gallery.splice(idx, 1);
  renderGallery();
};
document.getElementById('galleryForm').onsubmit = function(e) {
  e.preventDefault();
  gallery.unshift({
    img: galleryImg.value,
    caption: galleryCaption.value
  });
  renderGallery();
  this.reset();
  adminMsg.textContent = "✅ Gallery photo saved!";
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

function renderSchedule() {
  const list = document.getElementById('scheduleList');
  list.innerHTML = "";
  schedule.forEach((s, idx) => {
    list.innerHTML += `<div class="admin-list-item">
      <span>[${s.subsection}] <b>${s.subject}</b> ${s.time} @${s.location}</span>
      <button class="admin-edit-btn" onclick="editSchedule(${idx})">Edit</button>
      <button class="admin-delete-btn" onclick="deleteSchedule(${idx})">Delete</button>
    </div>`;
  });
}
window.editSchedule = function(idx) {
  const s = schedule[idx];
  document.getElementById('schedSubsection').value = s.subsection;
  document.getElementById('schedSubject').value = s.subject;
  document.getElementById('schedTime').value = s.time;
  document.getElementById('schedLocation').value = s.location;
  deleteSchedule(idx);
};
window.deleteSchedule = function(idx) {
  schedule.splice(idx, 1);
  renderSchedule();
};
document.getElementById('scheduleForm').onsubmit = function(e) {
  e.preventDefault();
  schedule.unshift({
    subsection: schedSubsection.value,
    subject: schedSubject.value,
    time: schedTime.value,
    location: schedLocation.value
  });
  renderSchedule();
  this.reset();
  adminMsg.textContent = "✅ Schedule entry saved!";
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

function renderEvents() {
  const list = document.getElementById('eventList');
  list.innerHTML = "";
  events.forEach((ev, idx) => {
    list.innerHTML += `<div class="admin-list-item">
      <span><b>${ev.title}</b> (${ev.date}) ${ev.rsvp ? `<a href="${ev.rsvp}" target="_blank">RSVP</a>` : ""}</span>
      <button class="admin-edit-btn" onclick="editEvent(${idx})">Edit</button>
      <button class="admin-delete-btn" onclick="deleteEvent(${idx})">Delete</button>
    </div>`;
  });
}
window.editEvent = function(idx) {
  const ev = events[idx];
  document.getElementById('eventTitle').value = ev.title;
  document.getElementById('eventDate').value = ev.date;
  document.getElementById('eventRSVP').value = ev.rsvp || "";
  deleteEvent(idx);
};
window.deleteEvent = function(idx) {
  events.splice(idx, 1);
  renderEvents();
};
document.getElementById('eventForm').onsubmit = function(e) {
  e.preventDefault();
  events.unshift({
    title: eventTitle.value,
    date: eventDate.value,
    rsvp: eventRSVP.value
  });
  renderEvents();
  this.reset();
  adminMsg.textContent = "✅ Event saved!";
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

function renderResources() {
  const list = document.getElementById('resourceList');
  list.innerHTML = "";
  resources.forEach((r, idx) => {
    list.innerHTML += `<div class="admin-list-item">
      <span><b>${r.title}</b> [${r.type}] <a href="${r.link}" target="_blank">Open</a></span>
      <button class="admin-edit-btn" onclick="editResource(${idx})">Edit</button>
      <button class="admin-delete-btn" onclick="deleteResource(${idx})">Delete</button>
    </div>`;
  });
}
window.editResource = function(idx) {
  const r = resources[idx];
  document.getElementById('resTitle').value = r.title;
  document.getElementById('resType').value = r.type;
  document.getElementById('resLink').value = r.link;
  deleteResource(idx);
};
window.deleteResource = function(idx) {
  resources.splice(idx, 1);
  renderResources();
};
document.getElementById('resourceForm').onsubmit = function(e) {
  e.preventDefault();
  resources.unshift({
    title: resTitle.value,
    type: resType.value,
    link: resLink.value
  });
  renderResources();
  this.reset();
  adminMsg.textContent = "✅ Resource saved!";
  setTimeout(() => { adminMsg.textContent = ""; }, 2000);
};

// Initial render
renderAnnouncements();
renderGallery();
renderSchedule();
renderEvents();
renderResources();
