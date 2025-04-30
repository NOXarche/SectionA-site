// ========== SESSION CHECK ==========
if (!localStorage.getItem('loggedIn')) {
  window.location.href = "auth/index.html";
}

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

// ========== LOGOUT ==========
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "auth/index.html";
};

// ========== GO TO MAIN PAGE ==========
document.getElementById('gotoMainBtn').onclick = () => {
  window.location.href = "mainpage.html";
};

// ========== LOAD USER DATA ==========
let user = {
  name: localStorage.getItem('name') || "Martian",
  roll: localStorage.getItem('roll') || "002410401001",
  subsection: localStorage.getItem('subsection') || "A1",
  role: localStorage.getItem('role') || "student"
};

function renderProfile() {
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileRoll').textContent = user.roll;
  document.getElementById('profileSubsection').textContent = user.subsection;
  document.getElementById('profileRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  document.getElementById('profileAvatar').textContent = user.role === "admin" ? "👨‍🚀" : "👩‍🚀";
  document.getElementById('adminBadge').style.display = user.role === "admin" ? "" : "none";
}
renderProfile();

// ========== EDIT NAME ==========
const editNameModal = document.getElementById('editNameModal');
document.getElementById('editNameBtn').onclick = () => {
  document.getElementById('editNameInput').value = user.name;
  editNameModal.classList.add('active');
};
document.getElementById('cancelEditName').onclick = () => editNameModal.classList.remove('active');
document.getElementById('editNameForm').onsubmit = function(e) {
  e.preventDefault();
  user.name = document.getElementById('editNameInput').value;
  localStorage.setItem('name', user.name);
  renderProfile();
  editNameModal.classList.remove('active');
  alert("Name updated! This will show on the main page after reload.");
};

// ========== EDIT SUBSECTION ==========
const subsectionSpan = document.getElementById('profileSubsection');
const editSubsectionBtn = document.getElementById('editSubsectionBtn');
const subsectionSelect = document.getElementById('subsectionSelect');
const saveSubsectionBtn = document.getElementById('saveSubsectionBtn');
editSubsectionBtn.onclick = () => {
  subsectionSpan.style.display = "none";
  editSubsectionBtn.style.display = "none";
  subsectionSelect.value = user.subsection;
  subsectionSelect.style.display = "";
  saveSubsectionBtn.style.display = "";
};
saveSubsectionBtn.onclick = () => {
  user.subsection = subsectionSelect.value;
  localStorage.setItem('subsection', user.subsection);
  renderProfile();
  subsectionSpan.style.display = "";
  editSubsectionBtn.style.display = "";
  subsectionSelect.style.display = "none";
  saveSubsectionBtn.style.display = "none";
  alert("Subsection updated!");
};

// ========== CHANGE PASSWORD (DEMO ONLY) ==========
const changePasswordModal = document.getElementById('changePasswordModal');
document.getElementById('changePasswordBtn').onclick = () => changePasswordModal.classList.add('active');
document.getElementById('cancelChangePassword').onclick = () => changePasswordModal.classList.remove('active');
document.getElementById('changePasswordForm').onsubmit = function(e) {
  e.preventDefault();
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  if (newPass !== confirmPass) {
    alert("New passwords do not match!");
    return;
  }
  changePasswordModal.classList.remove('active');
  alert("Password changed! (Demo only)");
};

// ========== FLOAT HOVER ANIMATION FOR CARD ==========
const floatCard = document.querySelector('.float-card');
if (floatCard) {
  floatCard.addEventListener('mousemove', (e) => {
    const rect = floatCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    floatCard.style.transform = `perspective(800px) rotateY(${x/18}deg) rotateX(${-y/18}deg) scale(1.03)`;
    floatCard.style.boxShadow = "0 16px 64px #ff8a0033, 0 6px 32px #1a1a2e88";
  });
  floatCard.addEventListener('mouseleave', () => {
    floatCard.style.transform = "";
    floatCard.style.boxShadow = "";
  });
}

// ========== DYNAMIC STAR BACKGROUND ==========
function createStars() {
  const starBg = document.getElementById('star-bg');
  if (!starBg) return;
  starBg.innerHTML = '';
  const w = window.innerWidth, h = window.innerHeight;
  const numStars = Math.floor((w * h) / 3500);
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * w}px`;
    star.style.top = `${Math.random() * h}px`;
    star.style.animationDuration = `${3 + Math.random() * 5}s`;
    star.animate([
      { transform: `translateY(0px)` },
      { transform: `translateY(${20 + Math.random() * 40}px)` }
    ], {
      duration: 8000 + Math.random() * 4000,
      direction: "alternate",
      iterations: Infinity
    });
    starBg.appendChild(star);
  }
}
window.addEventListener('DOMContentLoaded', createStars);
window.addEventListener('resize', createStars);
