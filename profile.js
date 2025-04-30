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

// ========== ADMIN ROLLS ==========
const adminRolls = [
  "018000000001",
  "091200000002",
  "123456789012",
  "987654321098",
  "112233445566",
  "223344556677",
  "334455667788",
  "445566778899",
  "556677889900",
  "667788990011"
];

// ========== TAB SWITCHING ==========
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

// ========== SHOW MESSAGE ==========
function showMsg(msg, color="#ff4040") {
  const el = document.getElementById('authMsg');
  el.textContent = msg;
  el.style.color = color;
}

// ========== LOGIN ==========
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

  // DEMO: Always successful login (replace with Firebase in production)
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('roll', roll);
  localStorage.setItem('name', roll); // Replace with actual name if available
  localStorage.setItem('role', adminRolls.includes(roll) ? 'admin' : 'student');
  // Optionally restore subsection if you store it elsewhere

  showMsg("Login successful! Redirecting...", "#00e676");
  setTimeout(() => {
    window.location.href = adminRolls.includes(roll) ? "../admin.html" : "../mainpage.html";
  }, 700);
};

// ========== REGISTER ==========
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

  // DEMO: Always successful registration (replace with Firebase in production)
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('roll', roll);
  localStorage.setItem('name', name);
  localStorage.setItem('subsection', subsection);
  localStorage.setItem('role', adminRolls.includes(roll) ? 'admin' : 'student');

  showMsg("Registration successful! Redirecting...", "#00e676");
  setTimeout(() => {
    window.location.href = adminRolls.includes(roll) ? "../admin.html" : "../mainpage.html";
  }, 700);
};

