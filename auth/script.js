// Theme toggle
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

// Tab switching
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    authForms.forEach(form => form.classList.remove('active'));
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
    document.getElementById('authMsg').textContent = "";
  });
});

// Demo/mock authentication logic (replace with Firebase in production)
function showMsg(msg, color="#ff4040") {
  const el = document.getElementById('authMsg');
  el.textContent = msg;
  el.style.color = color;
}

// Login
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const roll = document.getElementById('loginRoll').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!/^\d{12}$/.test(roll)) {
    showMsg("Roll number must be 12 digits.");
    return;
  }
  if (password.length < 6) {
    showMsg("Password must be at least 6 characters.");
    return;
  }
  // TODO: Replace with Firebase Auth
  // On success:
  // window.location.href = "../mainpage.html";
  showMsg("Demo: Login successful! (Replace with Firebase)", "#00e676");
  setTimeout(() => window.location.href = "../mainpage.html", 1000);
};

// Register
document.getElementById('registerForm').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const roll = document.getElementById('registerRoll').value.trim();
  const subsection = document.getElementById('registerSubsection').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (!/^\d{12}$/.test(roll)) {
    showMsg("Roll number must be 12 digits.");
    return;
  }
  if (!name) {
    showMsg("Name is required.");
    return;
  }
  if (!subsection) {
    showMsg("Please select subsection.");
    return;
  }
  if (password.length < 6) {
    showMsg("Password must be at least 6 characters.");
    return;
  }
  if (password !== confirmPassword) {
    showMsg("Passwords do not match.");
    return;
  }
  // TODO: Replace with Firebase Auth
  // On success:
  // window.location.href = "../mainpage.html";
  showMsg("Demo: Registration successful! (Replace with Firebase)", "#00e676");
  setTimeout(() => window.location.href = "../mainpage.html", 1000);
};
