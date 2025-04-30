// Import Firebase modules (adjust path as needed)
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// Your 10 admin rolls
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

// Theme toggle (unchanged)
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

function showMsg(msg, color="#ff4040") {
  const el = document.getElementById('authMsg');
  el.textContent = msg;
  el.style.color = color;
}

// LOGIN
document.getElementById('loginForm').onsubmit = async function(e) {
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
  try {
    // For demo: use roll@martian.com as email
    const email = `${roll}@martian.com`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", roll));
    let userData = userDoc.exists() ? userDoc.data() : {};
    // Set session/localStorage
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('name', userData.name || roll);
    localStorage.setItem('roll', roll);
    localStorage.setItem('subsection', userData.subsection || "A1");
    localStorage.setItem('role', adminRolls.includes(roll) ? 'admin' : 'student');
    showMsg("Login successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.href = adminRolls.includes(roll) ? "../admin.html" : "../mainpage.html";
    }, 900);
  } catch (err) {
    showMsg("Login failed. Please check your credentials.");
  }
};

// REGISTER
document.getElementById('registerForm').onsubmit = async function(e) {
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
  try {
    const email = `${roll}@martian.com`;
    await createUserWithEmailAndPassword(auth, email, password);
    // Save user profile to Firestore
    await setDoc(doc(db, "users", roll), {
      name,
      roll,
      subsection,
      role: adminRolls.includes(roll) ? 'admin' : 'student'
    });
    // Set session/localStorage
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('name', name);
    localStorage.setItem('roll', roll);
    localStorage.setItem('subsection', subsection);
    localStorage.setItem('role', adminRolls.includes(roll) ? 'admin' : 'student');
    showMsg("Registration successful! Redirecting...", "#00e676");
    setTimeout(() => {
      window.location.href = adminRolls.includes(roll) ? "../admin.html" : "../mainpage.html";
    }, 900);
  } catch (err) {
    showMsg("Registration failed. Roll may already be registered.");
  }
};

